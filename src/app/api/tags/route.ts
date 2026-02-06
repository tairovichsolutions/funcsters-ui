/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const url = accessToken
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/tags/active`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/tags/active`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong" },
      { status: err?.status || 500 },
    );
  }
}
