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

    // Re-persist the refresh token (backend may have rotated it).
    cookieStore.set("refreshToken", String(refreshToken), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    cookieStore.set("accessToken", data.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("userId", String(data.id), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong in refreshToken" },
      { status: err?.status || 500 },
    );
  }
}
