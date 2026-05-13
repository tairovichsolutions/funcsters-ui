/**
 * OAuth2 base URL for the backend. Used for:
 * - Building OAuth2 redirect URLs (login flow)
 * - Validating postMessage origin (popup flows)
 *
 * Reads from NEXT_PUBLIC_OAUTH2_BASE_URL environment variable.
 * Falls back to empty string — the env var MUST be set in .env / .env.local.
 */
export const OAUTH2_BASE_URL =
  process.env.NEXT_PUBLIC_OAUTH2_BASE_URL ?? "";
