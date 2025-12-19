import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const payload = await request.json();
  if (!payload) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ message: "Unothorize" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/execution/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
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
        "Code Submiting failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Code Submiting Successfull", data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
