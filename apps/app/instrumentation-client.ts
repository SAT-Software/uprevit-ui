import posthog from "posthog-js";
import { POSTHOG_TOKEN, posthogConfig } from "@/lib/posthog/support";

if (POSTHOG_TOKEN) {
  posthog.init(POSTHOG_TOKEN, posthogConfig);
}
