import { handleChatRequest } from "@/lib/glossen/chat";
import { verifyCognitoAccessToken } from "@/lib/verify-cognito-access-token";

export const maxDuration = 60;

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authorization.slice("Bearer ".length).trim();
  if (!token || !(await verifyCognitoAccessToken(token))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handleChatRequest(request);
}
