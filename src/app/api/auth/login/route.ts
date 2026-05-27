/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const payload = await request.json();
  if (!payload) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: res.status },
      );
    }

    const cookiesFormApi = res.headers.getSetCookie();
    const refreshTokenMatch = cookiesFormApi.find((c) => c.includes("refreshToken="))?.match(/refreshToken=([^;]+)/);
    const refreshTokenValue = refreshTokenMatch ? refreshTokenMatch[1] : null;

    cookieStore.set("accessToken", data?.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour — matches JWT expiration
    });

    // SECURITY FIX: Replaced the `userId` cookie (which enabled IDOR attacks)
    // with a simple `loggedIn` flag. This carries no sensitive data — just a
    // signal for the UI to know the user is authenticated before API calls resolve.
    cookieStore.set("loggedIn", "true", {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 90 * 24 * 60 * 60, // 90 days
    });

    if (refreshTokenValue) {
      cookieStore.set("refreshToken", refreshTokenValue, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 90 * 24 * 60 * 60, // 90 days
      });
    }

    // SECURITY: Strip the accessToken from the response body before
    // returning to the client. The token is already set as an httpOnly
    // cookie — exposing it in the JSON body would allow XSS to steal it.
    const { accessToken: _strip, ...safeData } = data;

    return NextResponse.json(
      { message: "Login Successful.", user: safeData },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
