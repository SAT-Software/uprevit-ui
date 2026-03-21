import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "uprevit-storage-dev-and-test.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname:
          "uprevit-upload-stage-940900040930-us-east-1-an.s3.us-east-1.amazonaws.com",
      },
    ],
  },

  async rewrites() {
    const target =
      process.env.API_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : undefined);

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
