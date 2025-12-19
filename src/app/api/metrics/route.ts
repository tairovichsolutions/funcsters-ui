import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/dashboard/metrics`,
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
        data?.error?.details?.[0]?.message ||
        "Metrics fecth failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Metrics FetCh Successful.", data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
