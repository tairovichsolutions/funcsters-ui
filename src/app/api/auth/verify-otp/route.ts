import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();
  if (!payload || !payload.email || !payload.otp) {
    return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/verify-otp`,
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
        { message: data.message || "Failed to verify OTP" },
        { status: res.status },
      );
    }

    return NextResponse.json(
      { message: data.message || "OTP verified successfully" },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
