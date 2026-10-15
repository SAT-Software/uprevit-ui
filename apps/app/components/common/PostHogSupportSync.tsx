"use client";

import { useLayoutEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useGetSupportConfig } from "@/hooks/support/useGetSupportConfig";
import { getSupportPrincipal } from "@/hooks/support/useSupportPrincipal";
import { getProfileValue } from "@/utils/authProfile";
import {
  applySupportIdentity,
  clearSupportSession,
  startSupportReplay,
  stopSupportReplay,
} from "@/lib/posthog/support";

export function PostHogSupportSync() {
  const auth = useAuth();
  const { data: config, isFresh } = useGetSupportConfig();
  const principal = getSupportPrincipal(auth);
  const userId = getProfileValue(auth.user?.profile, "userId");

  useLayoutEffect(() => {
    stopSupportReplay();
    if (auth.isLoading) return;
    if (!auth.isAuthenticated || !principal || !userId) {
      clearSupportSession();
      return;
    }

    const identified = applySupportIdentity(userId, config?.identityHash);
    if (identified && isFresh && config?.replayEnabled) {
      startSupportReplay();
    }
    return stopSupportReplay;
  }, [auth.isAuthenticated, auth.isLoading, config, isFresh, principal, userId]);

  return null;
}
