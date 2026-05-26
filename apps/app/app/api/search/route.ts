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
  if (!token || !(await verifyCognitoAccessToken(token))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return searchGET(request);
}
