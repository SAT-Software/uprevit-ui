import posthog from "posthog-js";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

if (token) {
  posthog.init(token, {
    api_host: "/ingest",
    ui_host: host.replace(".i.posthog.com", ".posthog.com"),
    defaults: "2026-08-30",
    person_profiles: "identified_only",
    cookieless_mode: "on_reject",
    opt_out_capturing_by_default: true,
    capture_dead_clicks: true,
    capture_heatmaps: true,
    capture_exceptions: true,
    capture_performance: { web_vitals: true, network_timing: false },
    enable_recording_console_log: false,
    session_recording: {
      maskAllInputs: true,
      recordHeaders: false,
      recordBody: false,
    },
  });
}
