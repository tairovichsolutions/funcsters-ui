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

    const { accessToken, id } = body ?? {};

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

    // FIX: Forward the refreshToken into the Next.js cookie jar.
    // The backend's CustomOAuth2SuccessHandler sets a refreshToken cookie
    // on the redirect response (domain=funcsters.io). The browser stores it
    // and sends it with this POST request. We re-set it here with consistent
    // settings (sameSite=lax) matching the login/register routes so that
    // the refresh-token rotation works correctly after the 1-hour access
    // token expires. Without this, OAuth2 users would be silently logged
    // out when the access token expired.
    const refreshToken = cookieStore.get("refreshToken")?.value;
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
