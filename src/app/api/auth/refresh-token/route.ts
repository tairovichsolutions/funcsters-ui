/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    cookieStore.set("refreshToken", String(refreshToken), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/refresh-token`;
    let res;
    if (refreshToken) {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "refreshToken=" + refreshToken,
        },
        cache: "no-store",
      });
    } else {
      res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const data = await res.json();

    cookieStore.set("accessToken", data?.accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    cookieStore.set("userId", data?.id, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message || "Something went wrong in refreshToken" },
      { status: err?.status || 500 },
    );
  }
}
