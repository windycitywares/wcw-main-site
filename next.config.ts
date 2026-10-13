import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  // Small Node server for cPanel "Setup Node.js App" (built by GitHub Actions, see .github/workflows).
  output: "standalone",
  poweredByHeader: false,
  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.windycitywares.com" }, // product photos
      { protocol: "https", hostname: "i.etsystatic.com" },
    ],
  },
};

export default nextConfig;
