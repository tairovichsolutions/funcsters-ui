"use server";

import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies(); // no await
  const userId = cookieStore.get("userId")?.value;
  const token = cookieStore.get("token")?.value;

  if (!userId || !token) {
    return {
      success: true,
      authenticated: false,
      user: null,
    };
  }

  const res = await fetch(
    `${process.env.FUNCSTER_BACKEND_URL}/v1/users/${userId}`,
    {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      cache: "no-store",
    }
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
