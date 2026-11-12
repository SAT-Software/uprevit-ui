import { apiProxyTarget } from "@/lib/api-proxy-target.mjs";
import { handleChatRequest, MAX_CHAT_BODY_BYTES } from "@/lib/glossen/chat";
import { consumeRateLimit } from "@/lib/rate-limit";
import { verifyCognitoAccessToken } from "@/lib/verify-cognito-access-token";

export const maxDuration = 60;

const CHAT_REQUESTS_PER_MINUTE = 20;
const MAX_OUTPUT_TOKENS = 1024;

const textResponse = (message: string, status: number) =>
  new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });

async function consumeDailyQuota(token: string) {
  if (!apiProxyTarget) return textResponse("Chat is unavailable right now.", 503);
  const quota = await fetch(`${apiProxyTarget}/docs/chat/quota`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);
  if (quota?.status === 429) {
    const body = await quota.json().catch(() => null);
    return textResponse(body?.message ?? "Daily docs chat limit reached. It resets tomorrow.", 429);
  }
  if (!quota?.ok) return textResponse("Chat is unavailable right now.", 503);
  return null;
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.slice("Bearer ".length).trim();
  const identity = token ? await verifyCognitoAccessToken(token) : null;
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_CHAT_BODY_BYTES) {
    return textResponse("The chat request is too large.", 413);
  }

  const limit = consumeRateLimit(`chat:${identity.sub}`, CHAT_REQUESTS_PER_MINUTE, 60_000);
  if (!limit.ok) return textResponse("Too many chat requests. Wait a minute, then try again.", 429);

  return handleChatRequest(request, {
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    beforeModelCall: () => consumeDailyQuota(token),
  });
}
