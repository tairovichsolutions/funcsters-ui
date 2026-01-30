/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const query = month ? `?month=${encodeURIComponent(month)}` : "";

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/dashboard/activity-calendar${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
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
        "Activity calendar fetch failed";

      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Activity calendar fetched successfully.", data },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Unable to reach activity calendar service" },
      { status: 502 },
    );
  }
}
