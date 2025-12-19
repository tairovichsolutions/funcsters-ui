import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const payload = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userId = cookieStore.get("userId")?.value;

  if (!userId || !token) {
    return NextResponse.json(
      { message: "Missing userId or token" },
      { status: 400 }
    );
  }

  if (!payload) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { isUserNameChange, ...restPayload } = payload;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(restPayload),
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
        "Update Profile failed";
      return NextResponse.json({ message }, { status });
    }

    const newToken: string | undefined = data?.token;

    if (isUserNameChange && newToken) {
      cookieStore.set("token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return NextResponse.json(
      { message: "Profile Update Successfully", user: data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
