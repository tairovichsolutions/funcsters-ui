import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: missing accessToken" },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.FUNCSTER_BACKEND_URL}/v1/users/me/set-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      const status =
        data?.error?.statusCode ?? data?.statusCode ?? res.status ?? 500;
      const message =
        data?.message ||
        (Array.isArray(data?.error?.message)
          ? data.error?.message?.[0]
          : data?.error?.message) ||
        data?.detail ||
        "Set password failed";

      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Password set successfully.", data },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to reach user service" },
      { status: 502 },
    );
  }
}
