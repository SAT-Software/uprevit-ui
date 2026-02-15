"use client";

import { AppHeader } from "@/components/common/AppHeader";
import { MainContentWrapper } from "@/components/common/MainContentWrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "@/hooks/user/useGetUser";
import { AppSidebar } from "@/components/common/AppSidebar";

const getProfileValue = (
  profile: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const value = profile?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const { data: userProfileData, isLoading: isUserLoading } = useGetUser();

  const profile = auth.user?.profile as Record<string, unknown> | undefined;
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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <MainContentWrapper>{children}</MainContentWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
