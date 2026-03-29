import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { requestId: string } }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const p = await params;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/pairing/request/${p.requestId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ message: "Failed to delete request" }, { status: 502 });
  }
}
