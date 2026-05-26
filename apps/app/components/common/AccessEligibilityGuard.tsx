"use client";

import { useGetUser } from "@/hooks/user/useGetUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

const getProfileValue = (
  profile: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const value = profile?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export function AccessEligibilityGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const { data: userProfileData, isLoading: isUserLoading } = useGetUser();

  const profile = auth.user?.profile;
  const userIdFromToken = getProfileValue(profile, "userId");
  const tokenWorkspaceId = getProfileValue(profile, "workspaceId");
  const tokenStatus = getProfileValue(profile, "status");

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth.isAuthenticated || !auth.user?.profile) {
      router.replace("/");
      return;
    }

    if (userIdFromToken && isUserLoading) return;

    const status = userProfileData?.user?.status || tokenStatus;
    const workspaceId = userProfileData?.user?.workspaceId || tokenWorkspaceId;

    if (status === "invited") {
      router.replace("/onboarding/onboard-user");
      return;
    }

    if (!workspaceId) {
      router.replace("/onboarding/create-workspace");
    }
  }, [
    auth.isAuthenticated,
    auth.isLoading,
    auth.user?.profile,
    isUserLoading,
    router,
    tokenStatus,
    tokenWorkspaceId,
    userIdFromToken,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  if (auth.isLoading || (userIdFromToken && isUserLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}
