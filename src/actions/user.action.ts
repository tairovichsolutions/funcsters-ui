"use server";

import { cookies } from "next/headers";

/**
 * SECURITY FIX: Fetch the current user via the backend's /v1/users/me
 * endpoint which derives the user identity from the JWT token.
 *
 * Previously, this action read a `userId` cookie (non-httpOnly, client-
 * manipulable) and used it to call /v1/users/${userId}, allowing any user
 * to view any other user's profile by changing the cookie in DevTools.
 */
export async function getUser() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: true,
      authenticated: false,
      user: null,
    };
  }

  const res = await fetch(
    `${process.env.FUNCSTER_BACKEND_URL}/v1/users/me`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
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
