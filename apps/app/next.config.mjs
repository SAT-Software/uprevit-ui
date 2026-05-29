import { withSentryConfig } from "@sentry/nextjs";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig = {
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
      {
        protocol: "https",
        hostname: "uprevit-standard-symbols.s3.us-east-1.amazonaws.com",
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

const withMDX = createMDX();

export default withSentryConfig(withMDX(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "uprevit",

  project: "uprevit-ui",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
