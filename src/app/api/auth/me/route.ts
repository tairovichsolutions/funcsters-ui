/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/lib/axiosClient";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  try {
    const userId = (await cookieStore).get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { authenticated: false, message: "user Id is required." },
        { status: 401 }
      );
    }

    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { status, data } = await axiosClient.get(`/v1/users/${userId}`, {
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
