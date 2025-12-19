/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId");
  const languageId = searchParams.get("languageId");

  if (!challengeId || !languageId) {
    return NextResponse.json(
      { message: "Missing challengeId or languageId" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/community/${challengeId}/my-solution?languageId=${languageId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
    const data = await res.json();

    if (!res.ok) {
      const status = data?.error?.statusCode ?? res.status ?? 500;
      const message =
        (Array.isArray(data?.error?.message)
          ? data.error?.message?.[0]
          : data?.error?.message) ||
        data?.detail ||
        data?.error?.details?.[0]?.message ||
        "Failed to fetch community solutions.";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
