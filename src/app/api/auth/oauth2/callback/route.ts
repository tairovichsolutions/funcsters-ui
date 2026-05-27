import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Server-side API route for OAuth2 callback cookie-setting.
 *
 * The OAuth2 callback page (client component) receives the token data
 * from the URL query param, then POSTs it here so that we can set
 * httpOnly cookies server-side — matching the pattern used by
 * /api/auth/login and /api/auth/register.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const { accessToken, id, refreshToken } = body ?? {};

    if (!accessToken || id == null) {
      return NextResponse.json(
        { message: "accessToken and id are required" },
        { status: 400 },
      );
    }

    // accessToken — httpOnly so JavaScript can't read it
    cookieStore.set("accessToken", accessToken, {
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

    // FIX: Set the refreshToken from the request body (passed via URL data
    // from the backend redirect). Previously, the backend set a cookie with
    // sameSite=None on the redirect response AND this route read it back and
    // re-set it with sameSite=Lax — creating TWO cookies with the same name
    // but different attributes. Logout could only clear one, leaving the
    // other orphaned. Now the backend passes the refresh token through the
    // URL data (same channel as the accessToken), and this route is the
    // ONLY place that sets the cookie — guaranteeing a single entry.
    if (refreshToken) {
      cookieStore.set("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 90 * 24 * 60 * 60, // 90 days — matches login/register
      });
    }

    return NextResponse.json(
      { message: "OAuth2 login successful." },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to process OAuth2 callback" },
      { status: 500 },
    );
  }
}
