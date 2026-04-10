import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Return the API base URL from server-side runtime env so the client
  // doesn't depend on NEXT_PUBLIC_API_BASE_URL being baked at build time
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8091/api";

  return NextResponse.json({ accessToken, apiBaseUrl });
}
