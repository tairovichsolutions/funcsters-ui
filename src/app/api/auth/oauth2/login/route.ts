import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { message: "payload is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/oauth2/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: json?.message ?? "Failed to create auth URL" },
        { status: res.status }
      );
    }

    cookieStore.set("token", json?.data?.token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 4,
    });

    cookieStore.set("userId", String(json?.data?.id), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 4,
    });

    return NextResponse.json({ data: json.data }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to start OAuth login" },
      { status: 500 }
    );
  }
}
