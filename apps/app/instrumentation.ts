import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  _request,
  context,
) => {
  const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (process.env.NEXT_RUNTIME !== "nodejs" || !token) return;

  const { PostHog } = await import("posthog-node");
  const posthog = new PostHog(token, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  await posthog.captureExceptionImmediate(error, undefined, {
    source: "next-server",
    routePath: context.routePath,
    routeType: context.routeType,
  });
  await posthog.shutdown();
};
