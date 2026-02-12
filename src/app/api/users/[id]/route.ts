/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, ctx: RouteContext<"/api/users/[id]">) {
  const cookieStore = cookies();
  try {
    const { id } = await ctx?.params;

    if (!id) {
      return NextResponse.json(
        { authenticated: false, message: "user Id is required." },
        { status: 401 },
      );
    }

    const accessToken = (await cookieStore).get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: data });
  } catch (error: any) {
    return NextResponse.json(
      {
        authenticated: false,
        message: error?.message || "Something went wrong",
      },
      { status: error?.status || 500 },
    );
  }
}
