/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const LOCAL_BACKEND = "http://localhost:8091/api/v1";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // UPVOTE or DOWNVOTE

  if (!type) {
    return NextResponse.json({ message: "Missing type" }, { status: 400 });
  }

  const { id } = await params;

  try {
    const res = await fetch(`${LOCAL_BACKEND}/comments/${id}/vote?type=${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
    return NextResponse.json({ success: true }, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Error voting" }, { status: 502 });
  }
}
