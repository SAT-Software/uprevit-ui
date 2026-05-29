"use client";

import * as Sentry from "@sentry/nextjs";
import { useGetUser } from "@/hooks/user/useGetUser";
import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export function SentryUserSync() {
  const auth = useAuth();
  const { data } = useGetUser();
  const user = data?.user;
  const userId =
    typeof auth.user?.profile?.userId === "string"
      ? auth.user.profile.userId
      : undefined;

  useEffect(() => {
    if (!auth.isAuthenticated || !userId) {
      Sentry.setUser(null);
      return;
    }

    if (!user?.email) return;

    Sentry.setUser({
      id: userId,
      email: user.email,
      name: user.name,
    });
  }, [auth.isAuthenticated, userId, user?.email, user?.name]);

  return null;
}
