import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get("challengeId");
  const languageId = searchParams.get("languageId");

  if (!challengeId || !languageId) {
    return NextResponse.json(
      { message: "Missing challengeId or languageId" },
      { status: 400 }
    );
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/community/${challengeId}/my-solution?languageId=${languageId}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      const status = data?.error?.statusCode ?? res.status ?? 500;

      const message =
        (Array.isArray(data?.error?.message)
          ? data.error?.message?.[0]
          : data?.error?.message) ||
        data?.error?.details?.[0]?.message ||
        "Delete request failed";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(
      { message: "Solution Deleted Successfully.", data },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Unable to reach auth service" },
      { status: 502 }
    );
  }
}
