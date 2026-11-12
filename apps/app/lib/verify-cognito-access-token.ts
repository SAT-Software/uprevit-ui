import { createRemoteJWKSet, jwtVerify } from "jose";

const issuer = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY;
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function getJwks() {
  if (!issuer) {
    throw new Error("NEXT_PUBLIC_COGNITO_AUTHORITY is not configured");
  }

  jwks ??= createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
  return jwks;
}

export async function verifyCognitoAccessToken(
  token: string,
): Promise<{ sub: string } | null> {
  if (!issuer || !clientId) {
    console.error(
      "[auth] Token verification is disabled: NEXT_PUBLIC_COGNITO_AUTHORITY or NEXT_PUBLIC_CLIENT_ID is missing.",
    );
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJwks(), { issuer });
    if (payload.token_use !== "access" || payload.client_id !== clientId) return null;
    return typeof payload.sub === "string" && payload.sub ? { sub: payload.sub } : null;
  } catch {
    return null;
  }
}
