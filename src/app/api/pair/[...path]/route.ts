/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Catch-all proxy from Next.js to the Spring backend for all pair-programming
 * endpoints. Handles auth by reading the httpOnly `accessToken` cookie and
 * attaching it as `Authorization: Bearer ...` to the upstream request.
 *
 * Why the proxy exists:
 *   - The FE stores the JWT in an httpOnly cookie (inaccessible to client JS)
 *   - The Spring backend's JwtAuthenticationFilter reads from the
 *     `Authorization` header only, not cookies
 *   - Direct browser -> backend calls would have no way to attach the header
 *   - This server-side proxy bridges the two: cookie in, bearer out
 *
 * The frontend calls `/api/pair/${path}` which resolves upstream to
 * `${NEXT_PUBLIC_API_BASE_URL}/v1/pair/${path}` (e.g.
 * `http://localhost:8091/api/v1/pair/${path}` locally).
 */

async function proxy(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendBase) {
    return NextResponse.json({ message: "Backend URL not configured" }, { status: 500 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
  }

  const suffix = path.join("/");
  const url = new URL(`${backendBase}/v1/pair/${suffix}`);
  // Forward query params verbatim.
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
  };

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  // Forward the body for non-GET/HEAD requests.
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "DELETE") {
    const contentType = req.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;
    const body = await req.text();
    if (body) init.body = body;
  }

  try {
    const res = await fetch(url.toString(), init);
    const text = await res.text();
    const resHeaders = new Headers();
    const upstreamCT = res.headers.get("content-type");
    if (upstreamCT) resHeaders.set("content-type", upstreamCT);
    return new NextResponse(text, { status: res.status, headers: resHeaders });
  } catch (err: any) {
    return NextResponse.json(
      { message: err?.message ?? "Upstream fetch failed" },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
