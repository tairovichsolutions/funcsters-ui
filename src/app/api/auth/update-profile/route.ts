import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * SECURITY FIX: Profile updates now use the backend's PATCH /v1/users/me
 * endpoint which derives the user ID from the JWT token. Previously, the
 * userId was read from a non-httpOnly cookie (client-manipulable).
 */
export async function PATCH(request: Request) {
  const payload = await request.json();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication required" },
      { status: 401 },
    );
  }

  if (!payload) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { isUserNameChange, ...restPayload } = payload;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(restPayload),
        cache: "no-store",
      },
    );

    const data = await res.text();

    return NextResponse.json(
      { message: "Profile Update successfully", user: data },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
