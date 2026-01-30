import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/auth/oauth2/authorization-url/[provider]">,
) {
  const { provider } = await ctx?.params;

  if (!provider) {
    return NextResponse.json(
      { authenticated: false, message: "Provider  is required." },
      { status: 401 },
    );
  }

  const url = `https://api.funcsters.io/oauth2/authorization/${provider}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    const data = res;

    if (!res.ok) {
      const status = res.status ?? 500;
      const message = "Authorization Url fetch failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Authorization Url fetch Successful.", data },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
