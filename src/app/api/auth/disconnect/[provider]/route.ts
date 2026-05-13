import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // SECURITY: Whitelist valid providers
  const validProviders = ["google", "github", "linkedin"];
  if (!validProviders.includes(provider)) {
    return NextResponse.json({ message: "Invalid provider" }, { status: 400 });
  }

  if (!accessToken) {
    return NextResponse.json(
      { message: "Unauthorized: missing accessToken" },
      { status: 401 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.FUNCSTER_BACKEND_URL}/v1/users/me/disconnect/${provider}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      const status =
        data?.error?.statusCode ?? data?.statusCode ?? res.status ?? 500;
      const message =
        data?.message ||
        (Array.isArray(data?.error?.message)
          ? data.error?.message?.[0]
          : data?.error?.message) ||
        data?.detail ||
        "Disconnect failed";

      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Disconnected successfully.", data },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to reach user service" },
      { status: 502 },
    );
  }
}
