import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import { POSTHOG_TOKEN, posthogConfig } from "@/lib/posthog/support";

Sentry.init({
  dsn: "https://09132c7199c00eb0563d8201a1d3f83e@o4511468020498432.ingest.us.sentry.io/4511468028035072",
  tracesSampleRate: 0.1,
  enableLogs: true,
  sendDefaultPii: true,
});

if (POSTHOG_TOKEN) {
  posthog.init(POSTHOG_TOKEN, posthogConfig);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
