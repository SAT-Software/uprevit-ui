import { useCallback, useLayoutEffect, useRef } from "react";
import { type AuthContextProps, useAuth } from "react-oidc-context";
import { getProfileValue } from "@/utils/authProfile";

export function getSupportPrincipal(auth: AuthContextProps) {
  const profile = auth.user?.profile;
  const ids = ["sub", "userId", "workspaceId"].map((key) => getProfileValue(profile, key));
  return auth.isAuthenticated && ids.every(Boolean)
    ? JSON.stringify(ids)
    : "";
}

export function useSupportPrincipal() {
  const auth = useAuth();
  const principal = getSupportPrincipal(auth);
  const current = useRef(principal);
  useLayoutEffect(() => {
    current.current = auth.isLoading ? "" : principal;
    return () => {
      current.current = "";
    };
  }, [auth.isLoading, principal]);
  const isCurrent = useCallback(
    () => Boolean(principal) && current.current === principal,
    [principal],
  );
  return { principal, isCurrent };
}
