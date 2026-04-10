/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    cookieStore.delete("accessToken");
    cookieStore.delete("userId");
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
