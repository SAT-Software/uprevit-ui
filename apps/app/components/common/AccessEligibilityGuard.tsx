"use client";

import { useGetUser } from "@/hooks/user/useGetUser";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { WorkspaceAccessFrozenScreen } from "@/components/common/WorkspaceAccessFrozenScreen";
import { WorkspaceAccessRemovedScreen } from "@/components/common/WorkspaceAccessRemovedScreen";
import { getProfileValue } from "@/utils/authProfile";
import { isPlatformOperatorProfile } from "@/utils/isPlatformOperator";
import { isWorkspaceAccessFrozenError } from "@/utils/workspaceAccessErrors";

export function AccessEligibilityGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: userProfileData,
    isFetching: isUserFetching,
    isError: isUserError,
    error: userError,
  } = useGetUser();

  const profile = auth.user?.profile;
  const userIdFromToken = getProfileValue(profile, "userId");
  const tokenWorkspaceId = getProfileValue(profile, "workspaceId");
  const tokenStatus = getProfileValue(profile, "status");
  const isPlatformAdminRoute = pathname.startsWith("/platform-admin");
  const isPlatformOperator = isPlatformOperatorProfile(profile);
  const isAccessFrozen = isWorkspaceAccessFrozenError(userError);
  const status = userProfileData?.user?.status || tokenStatus;
  const isAccessRemoved = status === "inactive";

  useEffect(() => {
    if (auth.isLoading || isAccessFrozen) return;

    if (!auth.isAuthenticated || !auth.user?.profile) {
      router.replace("/");
      return;
    }

    if (isPlatformAdminRoute && isPlatformOperator) return;

    if (userIdFromToken && isUserFetching && !isUserError) return;

    const resolvedStatus = userProfileData?.user?.status || tokenStatus;
    const workspaceId = userProfileData?.user?.workspaceId || tokenWorkspaceId;

    if (resolvedStatus === "inactive") {
      return;
    }

    if (resolvedStatus === "invited") {
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
    isAccessFrozen,
    isPlatformAdminRoute,
    isPlatformOperator,
    isUserError,
    isUserFetching,
    router,
    tokenStatus,
    tokenWorkspaceId,
    userIdFromToken,
    userProfileData?.user?.status,
    userProfileData?.user?.workspaceId,
  ]);

  if (isPlatformAdminRoute && isPlatformOperator) {
    return children;
  }

  if (isAccessRemoved) {
    return <WorkspaceAccessRemovedScreen />;
  }

  if (isAccessFrozen) {
    return <WorkspaceAccessFrozenScreen />;
  }

  if (
    auth.isLoading ||
    (userIdFromToken && isUserFetching && !isUserError && !userProfileData)
  ) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return children;
}
