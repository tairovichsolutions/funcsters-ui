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
    });

    // userId — NOT httpOnly (the client reads it for UI state)
    cookieStore.set("userId", String(id), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

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
