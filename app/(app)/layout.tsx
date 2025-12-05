"use client";

import { AppHeader } from "@/components/common/AppHeader";
import { MainContentWrapper } from "@/components/common/MainContentWrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "@/hooks/user/useGetUser";
import { AppSidebar } from "@/components/common/AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: userProfileData } = useGetUser();

  useEffect(() => {
    // Don't redirect while auth is still loading - this prevents
    // redirecting to root on page refresh before auth state is restored
    if (auth.isLoading) return;

    if (!auth.isAuthenticated || !auth.user?.profile) {
      router.replace("/");
      return;
    }

    if (auth.isAuthenticated) {
      const workspaceId = auth.user?.profile?.workspaceId;
      // const status = auth.user?.profile?.status;
      const status = userProfileData?.user?.status;

      if (status === "invited") {
        router.replace("/onboarding/onboard-user");
      }

      if (status !== "active" && !workspaceId) {
        router.replace("/onboarding/create-workspace");
      }
    }
  }, [auth, router, pathname, userProfileData]);

  if (auth.isLoading) {
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
