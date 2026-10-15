"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { WorkspaceAccessFrozenScreen } from "@/components/common/WorkspaceAccessFrozenScreen";
import { WorkspaceAccessRemovedScreen } from "@/components/common/WorkspaceAccessRemovedScreen";
import { useGetUser } from "@/hooks/user/useGetUser";
import { getProfileValue } from "@/utils/authProfile";
import { getSupportReturnPath } from "@/utils/supportReturnPath";
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
  const supportReturnPath = getSupportReturnPath(auth.user?.state);

  useEffect(() => {
    if (hasRedirectedRef.current || auth.isLoading) return;

    if (auth.isAuthenticated && supportReturnPath) {
      hasRedirectedRef.current = true;
      router.replace(supportReturnPath);
      return;
    }

    if (isAccessFrozen) return;

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

    if (status === "inactive") {
      return;
    }

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
    supportReturnPath,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  if (isAccessFrozen && !supportReturnPath) {
    return <WorkspaceAccessFrozenScreen />;
  }

  const profile = auth.user?.profile as Record<string, unknown> | undefined;
  const tokenStatus = getProfileValue(profile, "status");
  const status = userProfileData?.user?.status || tokenStatus;

  if (status === "inactive" && !supportReturnPath) {
    return <WorkspaceAccessRemovedScreen />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">Signing you in…</p>
    </div>
  );
}
