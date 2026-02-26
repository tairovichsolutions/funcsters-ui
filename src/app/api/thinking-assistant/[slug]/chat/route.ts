import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: { slug: string } }
) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const payload = await request.json();

    if (!payload) {
        return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    if (!accessToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/challenges/${slug}/thinking-assistant/chat`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
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
                "Thinking Assistant failed";
            return NextResponse.json({ message }, { status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        return NextResponse.json(
            { message: "Unable to reach assistant service" },
            { status: 502 }
        );
    }
}
