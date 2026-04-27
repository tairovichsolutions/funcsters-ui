import type { NextConfig } from "next";

const BACKEND_URL = process.env.FUNCSTER_BACKEND_URL ?? "http://localhost:8091";
// Strip any trailing /api since the WS endpoint is at /ws at the backend root.
const BACKEND_ORIGIN = BACKEND_URL.replace(/\/api\/?$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      // Same-origin WebSocket proxy so the browser sends httpOnly cookies
      // on the /ws upgrade request (JwtHandshakeInterceptor reads them).
      {
        source: "/ws/:path*",
        destination: `${BACKEND_ORIGIN}/ws/:path*`,
      },
      {
        source: "/ws",
        destination: `${BACKEND_ORIGIN}/ws`,
      },
    ];
  },
};

export default nextConfig;
