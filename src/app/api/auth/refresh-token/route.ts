/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // If there's no refresh token cookie at all, the user is logged out.
  // Return 401 immediately — do NOT set any cookies.
  if (!refreshToken) {
    return NextResponse.json(
      { message: "No refresh token" },
      { status: 401 },
    );
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/refresh-token`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: "refreshToken=" + refreshToken,
      },
      cache: "no-store",
    });

    const data = await res.json();

    // CRITICAL: Only set cookies if the backend actually returned a
    // valid response. Previously, cookies were set unconditionally,
    // which meant a failed refresh could set accessToken/userId to
    // "undefined" and — worse — during a logout race, a slightly-
    // delayed refresh call would re-establish the session.
    if (!res.ok || !data?.accessToken) {
      return NextResponse.json(
        { message: data?.message || "Refresh token invalid or expired" },
        { status: res.status || 401 },
      );
    }

    const cookiesFormApi = res.headers.getSetCookie();
    const refreshTokenMatch = cookiesFormApi.find((c) => c.includes("refreshToken="))?.match(/refreshToken=([^;]+)/);
    const newRefreshToken = refreshTokenMatch ? refreshTokenMatch[1] : refreshToken;

    // Re-persist the refresh token (backend rotated it).
    if (newRefreshToken) {
      cookieStore.set("refreshToken", String(newRefreshToken), {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 90 * 24 * 60 * 60, // 90 days
      });
    }

    cookieStore.set("accessToken", data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour — matches JWT expiration
    });

    // SECURITY FIX: Replaced the `userId` cookie with a simple `loggedIn` flag.
    cookieStore.set("loggedIn", "true", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 90 * 24 * 60 * 60, // 90 days
    });

    // SECURITY: Strip the accessToken from the response body before
    // returning to the client. The token is already set as an httpOnly
    // cookie — exposing it in the JSON body would allow XSS to steal it.
    // This matches the pattern used by /api/auth/login and /api/auth/register.
    const { accessToken: _strip, ...safeData } = data;

    return NextResponse.json(safeData, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong in refreshToken" },
      { status: err?.status || 500 },
    );
  }
}
