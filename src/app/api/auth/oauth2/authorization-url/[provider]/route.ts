import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/auth/oauth2/authorization-url/[provider]">
) {
  const { provider } = await ctx?.params;

  if (!provider) {
    return NextResponse.json(
      { authenticated: false, message: "Provider  is required." },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/ouath2/authorization-url/${provider}`,

      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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
        "Authorization Url fecth failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Authorization Url FetCh Successful.", data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
