import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/challenges/[id]">,
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { id } = await ctx?.params;

  if (!id) {
    return NextResponse.json(
      { authenticated: false, message: "challenge Id is required." },
      { status: 401 },
    );
  }

  try {
    const url = accessToken
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/guest/challenges/${id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      cache: "no-store",
    });
    const data = await res.json();


    if (!res.ok) {
      const status = data?.error?.statusCode ?? res.status ?? 500;
      const message =
        (Array.isArray(data?.error?.message)
          ? data.error?.message?.[0]
          : data?.error?.message) ||
        data?.error?.details?.[0]?.message ||
        "Challenges Fetch failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Challenges FetCh Successful.", data },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
