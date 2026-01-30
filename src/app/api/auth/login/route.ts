/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const payload = await request.json();
  if (!payload) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: res.status },
      );
    }

    const cookiesFormApi = res.headers.getSetCookie();

    const cookieObj: any = {};

    const cookie2dArr = cookiesFormApi[0]?.split("; ").map((c) => c.split("="));

    cookie2dArr.map((a) => {
      if (
        cookieObj[`${a[0]}`] === "Secure" ||
        cookieObj[`${a[0]}`] === "HttpOnly"
      ) {
        cookieObj[`${a[0]}`] = true;
      } else {
        cookieObj[`${a[0]}`] = a[1];
      }
    });

    cookieStore.set("accessToken", data?.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("userId", String(data.id), {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("refreshToken", String(cookieObj.refreshToken), {
      path: cookieObj.Path,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      maxAge: cookieObj["Max-Age"],
      expires: cookieObj.Expires,
    });

    return NextResponse.json(
      { message: "Login Successful.", user: data },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
