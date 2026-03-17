/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get("submissionId");
  const sortParam = searchParams.get("sort") || "newest";
  const page = searchParams.get("page") || "0";
  const size = searchParams.get("size") || "10";

  if (!submissionId) {
    return NextResponse.json({ message: "Missing submissionId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `http://localhost:8091/api/v1/comments/submission/${submissionId}?sort=${sortParam}&page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Error reaching backend" }, { status: 502 });
  }
}
