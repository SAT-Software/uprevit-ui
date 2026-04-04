"use client";

import { useCallback } from "react";
import { useAuth } from "react-oidc-context";

export function useSignOut() {
  const auth = useAuth();

  return useCallback(async () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;
    const logoutUri =
      process.env.NEXT_PUBLIC_LOGOUT_URI ??
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.NEXT_PUBLIC_REDIRECT_URI ??
      window.location.origin;
    const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;

    await auth.removeUser();

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri,
    )}`;
  }, [auth]);
}
