import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * SECURITY: This route acts as a secure bridge for the OAuth connect flow.
 * 
 * The frontend cannot pass the accessToken to the backend directly (it's httpOnly),
 * and we cannot trust a user-supplied email parameter. Instead:
 * 1. This route reads the httpOnly accessToken cookie (server-side only)
 * 2. Passes it as a signed `connect_token` parameter to the backend
 * 3. The backend validates the JWT and extracts the email securely
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // SECURITY: Whitelist valid providers to prevent path traversal
  const validProviders = ["google", "github", "linkedin"];
  if (!validProviders.includes(provider)) {
    return new Response("Invalid provider", { status: 400 });
  }

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const display = url.searchParams.get("display") || "popup";

  const backendBase = process.env.NEXT_PUBLIC_OAUTH2_BASE_URL;
  if (!backendBase) {
    return new Response("Server misconfiguration: NEXT_PUBLIC_OAUTH2_BASE_URL not set", { status: 500 });
  }
  const connectUrl = `${backendBase}/oauth2/authorization/${provider}?action=connect&display=${display}&connect_token=${accessToken}`;

  redirect(connectUrl);
}
