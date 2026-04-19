import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@uprevit/ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      {
        protocol: "https",
        hostname: "uprevit-storage-dev-and-test.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "r7codfanye.ufs.sh",
      },
      {
        protocol: "https",
        hostname:
          "uprevit-upload-stage-940900040930-us-east-1-an.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname:
          "uprevit-upload-prod-940900040930-us-east-1-an.s3.us-east-1.amazonaws.com",
      },
    ],
  },

  async rewrites() {
    const target =
      process.env.API_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
      (process.env.NODE_ENV === "development"
        ? "https://weh8ywxicg.execute-api.us-east-1.amazonaws.com/Prod"
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
