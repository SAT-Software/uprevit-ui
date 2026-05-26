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

export async function verifyCognitoAccessToken(token: string): Promise<boolean> {
  if (!issuer) return false;

  try {
    const { payload } = await jwtVerify(token, getJwks(), { issuer });

    if (clientId && payload.client_id !== clientId) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
