import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all_time";
  const page = searchParams.get("page") || "0";
  const size = searchParams.get("size") || "100";
  const country = searchParams.get("country") || "";

  try {
    let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/leaderboard?period=${period}&page=${page}&size=${size}`;
    if (country) {
      url += `&country=${encodeURIComponent(country)}`;
    }

    const res = await fetch(
      url,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      const status = data?.error?.statusCode ?? res.status ?? 500;
      const message =
        (Array.isArray(data?.error?.message)
          ? data.error?.message?.[0]
          : data?.error?.message) ||
        data?.error?.details?.[0]?.message ||
        "Leaderboard fetch failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Leaderboard fetch successful.", data },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach backend service" },
      { status: 502 },
    );
  }
}
