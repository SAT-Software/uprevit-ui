import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const posthogAssetsHost = posthogHost.replace(".i.posthog.com", "-assets.i.posthog.com");

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  transpilePackages: ["@uprevit/ui"],
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_PUBLIC_MARKETING_CDN_URL}/**`),
    ],
  },
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssetsHost}/static/:path*` },
      { source: "/ingest/array/:path*", destination: `${posthogAssetsHost}/array/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
};

export default createMDX()(nextConfig);
