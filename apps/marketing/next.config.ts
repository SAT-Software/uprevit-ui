import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@uprevit/ui"],
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_MARKETING_CDN_URL}/**`),
    ],
  },
};

export default nextConfig;
