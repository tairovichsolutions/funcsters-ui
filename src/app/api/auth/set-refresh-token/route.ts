/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    cookieStore.set("refreshToken", String(refreshToken), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong in refreshToken" },
      { status: err?.status || 500 },
    );
  }
}
