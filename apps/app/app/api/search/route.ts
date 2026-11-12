import { consumeRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { verifyCognitoAccessToken } from "@/lib/verify-cognito-access-token";
import { source } from "@/lib/source";
import { createFromSource } from "fumadocs-core/search/server";
import type { NextRequest } from "next/server";

const { GET: searchGET } = createFromSource(source, {
  language: "english",
});

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.slice("Bearer ".length).trim();
  const identity = token ? await verifyCognitoAccessToken(token) : null;
  if (!identity) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = consumeRateLimit(`search:${identity.sub}`, 60, 60_000);
  if (!limit.ok) return rateLimitResponse(limit.retryAfter);

  return searchGET(request);
}
