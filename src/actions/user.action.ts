"use server";

import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!userId || !accessToken) {
    return {
      success: true,
      authenticated: false,
      user: null,
    };
  }

  const res = await fetch(
    `${process.env.FUNCSTER_BACKEND_URL}/v1/users/${userId}`,
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
      cache: "no-store",
    },
  );

  if (!res.ok) {
    return {
      success: false,
      authenticated: false,
      user: null,
    };
  }

  const data = await res.json();

  return {
    success: true,
    authenticated: Boolean(data?.username),
    user: data,
  };
}
