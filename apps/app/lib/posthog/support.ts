import posthog, {
  type BeforeSendFn,
  type PostHogConfig,
  type Properties,
} from "posthog-js";
import { redactPath, redactUrl } from "@/lib/posthog/redactUrl";

export const POSTHOG_TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const SUPPORT_PROXY_PATHS: Record<string, string> = {
  "/api/conversations/v1/widget/message": "/api/posthog/conversations/message",
  "/api/conversations/v1/widget/restore": "/api/posthog/conversations/restore",
};

const REPLAY_BLOCK_SELECTOR =
  "img,picture,video,audio,canvas,svg,iframe,object,embed,frame,frameset";

const REPLAY_SAFE_ATTRIBUTES = new Set([
  "class",
  "style",
  "type",
  "role",
  "rel",
  "media",
  "disabled",
  "checked",
  "selected",
  "hidden",
  "tabindex",
  "colspan",
  "rowspan",
  "dir",
]);

const URL_PROPERTY = /^\$(initial_|session_entry_)?(current_url|pathname)$/;
const REFERRER_PROPERTY = /referr/;

function redactProperties(properties?: Properties) {
  if (!properties) return;
  for (const key of Object.keys(properties)) {
    const value = properties[key];
    if (REFERRER_PROPERTY.test(key)) {
      delete properties[key];
    } else if (URL_PROPERTY.test(key) && typeof value === "string") {
      properties[key] = key.endsWith("pathname")
        ? redactPath(value)
        : redactUrl(value, window.location.origin);
    }
  }
}

const supportBeforeSend: BeforeSendFn = (event) => {
  if (window.location.pathname.startsWith("/support/")) return null;
  const isAllowed =
    event.event === "$snapshot" ||
    event.event === "$identify" ||
    event.event.startsWith("$conversations_");
  if (!isAllowed) return null;

  redactProperties(event.properties);
  redactProperties(event.$set);
  redactProperties(event.$set_once);
  return event;
};

export const posthogConfig: Partial<PostHogConfig> = {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: "2026-08-30",
  person_profiles: "identified_only",
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  rageclick: false,
  capture_dead_clicks: false,
  capture_heatmaps: false,
  capture_exceptions: false,
  capture_performance: false,
  enable_recording_console_log: false,
  disable_session_recording: true,
  disable_surveys: true,
  disable_product_tours: true,
  disable_web_experiments: true,
  disable_capture_url_hashes: true,
  save_referrer: false,
  save_campaign_params: false,
  mask_all_text: true,
  mask_all_element_attributes: true,
  mask_personal_data_properties: true,
  advanced_disable_toolbar_metrics: true,
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: "*",
    blockSelector: REPLAY_BLOCK_SELECTOR,
    maskAttributeFn: (name, value, element) =>
      name.startsWith("rr_") ||
      (REPLAY_SAFE_ATTRIBUTES.has(name) && !/url\s*\(/i.test(value)) ||
      (name === "href" && element?.tagName === "LINK")
        ? value
        : "",
    captureCanvas: { recordCanvas: false },
    captureJsonLd: false,
    recordHeaders: false,
    recordBody: false,
    recordCrossOriginIframes: false,
    maskCapturedNetworkRequestFn: (request) => ({
      ...request,
      name: redactUrl(request.name, window.location.origin),
    }),
  },
  before_send: supportBeforeSend,
  rewriteRequestPath: (url) => {
    const proxyPath = SUPPORT_PROXY_PATHS[url.pathname];
    return proxyPath ? new URL(proxyPath, window.location.origin) : url;
  },
};

let replayRequested = false;
let appliedIdentity = "";
let reloadRequired = false;

const isIdentified = () => posthog.get_property("$user_state") === "identified";

export function startSupportReplay() {
  if (!posthog.__loaded || replayRequested) return;
  replayRequested = true;
  posthog.startSessionRecording(true);
}

export function stopSupportReplay() {
  if (!posthog.__loaded) return;
  replayRequested = false;
  posthog.stopSessionRecording();
}

export function applySupportIdentity(distinctId: string, identityHash?: string | null) {
  if (!posthog.__loaded) return false;
  if (isIdentified() && posthog.get_distinct_id() !== distinctId) {
    clearSupportSession();
  }
  if (!identityHash) return false;
  if (reloadRequired) {
    window.location.reload();
    return false;
  }
  if (posthog.get_distinct_id() !== distinctId) {
    posthog.identify(distinctId);
  }

  const nextIdentity = `${distinctId}:${identityHash}`;
  if (nextIdentity === appliedIdentity) return true;
  appliedIdentity = nextIdentity;
  posthog.setIdentity(distinctId, identityHash);
  return true;
}

export function isSupportIdentityCurrent(distinctId: string, identityHash: string) {
  return appliedIdentity === `${distinctId}:${identityHash}`;
}

export function clearSupportSession() {
  if (!posthog.__loaded) return;
  stopSupportReplay();
  if (!appliedIdentity && !isIdentified()) return;
  appliedIdentity = "";
  reloadRequired = true;
  posthog.clearIdentity();
  posthog.reset();
}
