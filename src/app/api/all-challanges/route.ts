/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  try {
    const base = token
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/challenges`;

    const incomingUrl = new URL(req.url);
    const qs = incomingUrl.search;

    const url = `${base}${qs}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong" },
      { status: err?.status || 500 }
    );
  }
}
