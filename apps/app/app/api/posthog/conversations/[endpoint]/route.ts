import { redactUrl } from "@/lib/posthog/redactUrl";

const POSTHOG_HOSTS = new Set(["https://us.i.posthog.com", "https://eu.i.posthog.com"]);
const UPSTREAM_PATHS: Record<string, string> = {
  message: "/api/conversations/v1/widget/message",
  restore: "/api/conversations/v1/widget/restore",
};
const MAX_BODY_BYTES = 64 * 1024;
const TOKEN_PATTERN = /^[\w-]{1,200}$/;

const error = (message: string, status: number) =>
  Response.json({ detail: message }, { status, headers: { "Cache-Control": "no-store" } });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function getUpstreamHost() {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "";
  return POSTHOG_HOSTS.has(host) ? host : null;
}

function redactCurrentUrl(target: Record<string, unknown>) {
  if (typeof target.current_url === "string") {
    target.current_url = redactUrl(target.current_url) || undefined;
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> },
) {
  const { endpoint } = await params;
  const path = UPSTREAM_PATHS[endpoint];
  if (!path) return error("Not found", 404);

  const host = getUpstreamHost();
  if (!host || !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    return error("Support is not configured", 503);
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return error("Forbidden", 403);

  let appOrigin: string;
  try {
    const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL || request.url);
    if (!["http:", "https:"].includes(appUrl.protocol)) return error("Support is not configured", 503);
    appOrigin = appUrl.origin;
  } catch {
    return error("Support is not configured", 503);
  }
  const origin = request.headers.get("origin");
  if (origin && origin !== appOrigin) return error("Forbidden", 403);

  const token = request.headers.get("x-conversations-token") ?? "";
  if (!TOKEN_PATTERN.test(token)) return error("Invalid conversations token", 401);

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return error("Message is too large", 413);
  }
  const body = await request.text();
  if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) {
    return error("Message is too large", 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return error("Invalid request body", 400);
  }
  if (!isRecord(payload)) return error("Invalid request body", 400);

  redactCurrentUrl(payload);
  if (isRecord(payload.session_context)) redactCurrentUrl(payload.session_context);

  let upstream: Response;
  try {
    upstream = await fetch(`${host}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Conversations-Token": token,
        Origin: appOrigin,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "error",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (fetchError) {
    const timedOut = fetchError instanceof DOMException && fetchError.name === "TimeoutError";
    return error("Support could not be reached", timedOut ? 504 : 502);
  }

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/json",
      "Cache-Control": "no-store",
    },
  });
}
