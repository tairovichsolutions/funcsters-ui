/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;
    const accessToken = cookieStore.get("accessToken")?.value;

    // Forward the logout to the backend so it can invalidate the
    // refresh token in the database. Without this, the token remains
    // valid and could theoretically be reused.
    if (refreshToken) {
      try {
        const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/logout`;
        await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken
              ? { Authorization: `Bearer ${accessToken}` }
              : {}),
            Cookie: `refreshToken=${refreshToken}`,
          },
          cache: "no-store",
        });
      } catch {
        // Best-effort — even if the backend call fails, we still
        // clear the local cookies below so the user is logged out
        // from the browser's perspective.
      }
    }

    // Delete all auth cookies from the Next.js cookie jar.
    cookieStore.delete("accessToken");
    cookieStore.delete("loggedIn");
    cookieStore.delete("refreshToken");

    return NextResponse.json(
      { success: true, message: "Logout successful." },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong in logout" },
      { status: err?.status || 500 },
    );
  }
}
