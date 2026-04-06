"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "@/hooks/user/useGetUser";

const getProfileValue = (
  profile: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const value = profile?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();
  const hasRedirectedRef = useRef(false);

  const { data: userProfileData, isLoading: isUserLoading } = useGetUser();

  useEffect(() => {
    if (hasRedirectedRef.current) return;
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      hasRedirectedRef.current = true;
      router.replace("/");
      return;
    }

    const profile = auth.user?.profile as Record<string, unknown> | undefined;
    const userIdFromToken = getProfileValue(profile, "userId");
    if (userIdFromToken && isUserLoading) return;

    const tokenWorkspaceId = getProfileValue(profile, "workspaceId");
    const tokenStatus = getProfileValue(profile, "status");

    const workspaceId = userProfileData?.user?.workspaceId || tokenWorkspaceId;
    const status = userProfileData?.user?.status || tokenStatus;

    const targetPath =
      status === "invited"
        ? "/onboarding/onboard-user"
        : workspaceId
          ? "/dashboard"
          : "/onboarding/create-workspace";

    hasRedirectedRef.current = true;
    router.replace(targetPath);
  }, [
    auth.isAuthenticated,
    auth.isLoading,
    auth.user?.profile,
    isUserLoading,
    router,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
