import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/auth/profile-avatar/[id]">
) {
  const { id } = await ctx?.params;

  if (!id) {
    return NextResponse.json(
      { message: "User id is required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  const formData = await request.formData();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/users/profile-picture/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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
        data?.detail ||
        data?.error?.details?.[0]?.message ||
        "Profile Avatar Update failed";

      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Profile Avatar Update Successful.", user: data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
