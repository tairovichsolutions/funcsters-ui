/**
 * Resolves a profile image URL from the API.
 *
 * Images may be:
 *  - null/undefined → fallback to a generated avatar based on username
 *  - An absolute URL (starts with "http") → use as-is (Google/GitHub OAuth avatars)
 *  - A relative path like "/images/1/image.png" → prepend the static file server
 */
export function resolveAvatarUrl(
  url: string | null | undefined,
  username?: string,
): string {
  if (!url) {
    const name = encodeURIComponent(username || "U");
    return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=96&bold=true`;
  }
  if (url.startsWith("http")) {
    return url;
  }
  // Relative path from the backend static file server
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${process.env.NEXT_PUBLIC_STATIC_FILE_URL || "https://www.funcsters.io/static"}${path}`;
}
