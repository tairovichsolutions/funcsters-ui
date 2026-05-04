import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload || !payload.email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to send reset instructions" },
        { status: res.status },
      );
    }

    return NextResponse.json(
      { message: data.message || "Password reset instructions sent to your email" },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
