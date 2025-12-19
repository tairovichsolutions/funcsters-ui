/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { challengeId, languageId, visible } = body;

  if (!challengeId || !languageId || visible === undefined) {
    return NextResponse.json(
      {
        message: `Missing challengeId languageId required parameters`,
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/community/${challengeId}/my-solution/visibility?languageId=${languageId}&visible=${visible}`,
      {
        method: "PATCH",
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
        "Failed to fetch visibility community solutions.";
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
