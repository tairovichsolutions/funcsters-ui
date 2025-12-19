/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request, ctx: RouteContext<"/api/users/[id]">) {
  const cookieStore = cookies();
  try {
    const { id } = await ctx?.params;

    if (!id) {
      return NextResponse.json(
        { authenticated: false, message: "user Id is required." },
        { status: 401 }
      );
    }

    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { status, data } = await axiosClient.get(`/v1/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    if (status !== 200) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, user: data });
  } catch (error: any) {
    return NextResponse.json(
      {
        authenticated: false,
        message: error?.message || "Something went wrong",
      },
      { status: error?.status || 500 }
    );
  }
}
