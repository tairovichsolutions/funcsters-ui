/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request?.nextUrl?.searchParams;
  const challengeId = searchParams.get("challengeId");
  const languageId = searchParams.get("languageId");
  const solutionId = searchParams.get("solutionId");

  const body = await request.json();
  const { vote } = body;

  if (!challengeId || !languageId || !solutionId) {
    return NextResponse.json(
      {
        message: `Missing challengeId languageId solutionId required parameters`,
      },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/community/${Number(
        challengeId,
      )}/solutions/${Number(solutionId)}/vote?languageId=${Number(languageId)}`,

      {
        method: "POST",
        body: JSON.stringify({ voteType: vote }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
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
        "Failed to fetch vote community solutions.";
      return NextResponse.json({ message }, { status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message || "Unable to reach auth service" },
      { status: 502 },
    );
  }
}
