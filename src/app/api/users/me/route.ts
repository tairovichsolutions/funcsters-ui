/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookieStore = cookies();
  try {
    const accessToken = (await cookieStore).get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/me`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Failed to delete account" },
        { status: res.status }
      );
    }

    // Success! Now clear session cookies
    const store = await cookieStore;
    store.delete("accessToken");
    store.delete("userId");
    store.delete("refreshToken");

    return NextResponse.json({
      success: true,
      message: "Account and all associated data have been permanently deleted.",
    });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      {
        message: error?.message || "Something went wrong during account deletion",
      },
      { status: 500 }
    );
  }
}
