"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { WorkspaceAccessFrozenScreen } from "@/components/common/WorkspaceAccessFrozenScreen";
import { useGetUser } from "@/hooks/user/useGetUser";
import { getProfileValue } from "@/utils/authProfile";
import { isWorkspaceAccessFrozenError } from "@/utils/workspaceAccessErrors";

export default function AuthCallbackPage() {
  const router = useRouter();
  const auth = useAuth();
  const hasRedirectedRef = useRef(false);

  const {
    data: userProfileData,
    isFetching: isUserFetching,
    isError: isUserError,
    error: userError,
  } = useGetUser();
  const isAccessFrozen = isWorkspaceAccessFrozenError(userError);

  useEffect(() => {
    if (hasRedirectedRef.current || isAccessFrozen) return;
    if (auth.isLoading) return;

    if (!auth.isAuthenticated) {
      hasRedirectedRef.current = true;
      router.replace("/");
      return;
    }

    const profile = auth.user?.profile as Record<string, unknown> | undefined;
    const userIdFromToken = getProfileValue(profile, "userId");
    if (userIdFromToken && isUserFetching && !isUserError) return;

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
    isAccessFrozen,
    isUserError,
    isUserFetching,
    router,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  if (isAccessFrozen) {
    return <WorkspaceAccessFrozenScreen />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
