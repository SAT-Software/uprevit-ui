import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "r7codfanye.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },

  async rewrites() {
    const target = process.env.NEXT_PUBLIC_API_PROXY_TARGET; // e.g. http://localhost:4000 or https://api.example.com
    if (!target) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
