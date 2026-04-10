/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const LOCAL_BACKEND = "http://localhost:8091/api/v1";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { id } = await params;
  
  try {
    const content = await request.text();
    const res = await fetch(`${LOCAL_BACKEND}/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${accessToken}`,
      },
      body: content,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json(data, { status: res.status });
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Error editing comment" }, { status: 502 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { id } = await params;
  
  try {
    const res = await fetch(`${LOCAL_BACKEND}/comments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(data, { status: res.status });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || "Error deleting comment" }, { status: 502 });
  }
}
