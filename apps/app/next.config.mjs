import { withPostHogConfig } from "@posthog/nextjs-config";
import { createMDX } from "fumadocs-mdx/next";

const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const posthogAssetsHost = posthogHost.replace(".i.posthog.com", "-assets.i.posthog.com");

const isDev = process.env.NODE_ENV === "development";
const originOf = (value) => (value ? new URL(value).origin : "");
const cognitoHosts = [
  originOf(process.env.NEXT_PUBLIC_COGNITO_AUTHORITY),
  originOf(process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
  "https://*.amazoncognito.com",
]
  .filter(Boolean)
  .join(" ");
const s3Hosts = "https://*.s3.us-east-1.amazonaws.com https://*.cloudfront.net";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  `form-action 'self' ${cognitoHosts}`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://cdn.jsdelivr.net https://images.unsplash.com https://utfs.io https://r7codfanye.ufs.sh ${s3Hosts}`,
  "font-src 'self' data:",
  `connect-src 'self' ${cognitoHosts} https://*.posthog.com ${s3Hosts}`,
  `media-src 'self' blob: ${s3Hosts}`,
  "worker-src 'self' blob:",
  "frame-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig = {
  skipTrailingSlashRedirect: true,
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
        hostname: "utfs.io",
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

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async rewrites() {
    const target =
      process.env.API_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_API_PROXY_TARGET ||
      (process.env.NODE_ENV === "development"
        ? "https://weh8ywxicg.execute-api.us-east-1.amazonaws.com/Prod"
        : undefined);

    return {
      afterFiles: [
        {
          source: "/ingest/static/:path*",
          destination: `${posthogAssetsHost}/static/:path*`,
        },
        {
          source: "/ingest/array/:path*",
          destination: `${posthogAssetsHost}/array/:path*`,
        },
        {
          source: "/ingest/:path*",
          destination: `${posthogHost}/:path*`,
        },
      ],
      fallback: target
        ? [
            {
              source: "/api/:path*",
              destination: `${target}/:path*`,
            },
          ]
        : [],
    };
  },
};

const withMDX = createMDX();

export default withPostHogConfig(withMDX(nextConfig), {
  personalApiKey: process.env.POSTHOG_API_KEY ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID,
  host: posthogHost.replace(".i.posthog.com", ".posthog.com"),
  sourcemaps: {
    enabled: Boolean(process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID),
    deleteAfterUpload: true,
  },
});
