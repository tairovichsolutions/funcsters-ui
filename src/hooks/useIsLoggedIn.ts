"use client";

import { useEffect, useState } from "react";

const LOGIN_STATE_EVENT = "funcsters:login-state-changed";

/**
 * Call this after any login/logout/register action to immediately
 * notify all `useIsLoggedIn` consumers that the cookie has changed.
 */
export function notifyLoginStateChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOGIN_STATE_EVENT));
  }
}

function readCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("loggedIn=");
}

/**
 * Hydration-safe wrapper around the `loggedIn` cookie.
 *
 * Always returns `false` on SSR and the first client render pass
 * (keeping the HTML identical to what the server rendered), then
 * flips to the real cookie value in a `useEffect`.
 *
 * Re-reads the cookie when:
 *  - `notifyLoginStateChanged()` is called (instant, after login/logout)
 *  - The browser tab regains focus (catches external cookie changes)
 */
export function useIsLoggedIn(): boolean {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setLoggedIn(readCookie());
    check();

    window.addEventListener(LOGIN_STATE_EVENT, check);
    document.addEventListener("visibilitychange", check);

    return () => {
      window.removeEventListener(LOGIN_STATE_EVENT, check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  return loggedIn;
}

