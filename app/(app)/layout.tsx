"use client";

import { AppHeader } from "@/components/common/app-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { MainContentWrapper } from "@/components/common/main-content-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { useGetUser } from "@/hooks/user/useGetUser";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading: isUserLoading } = useGetUser();

  useMemo(() => {
    if (auth.isAuthenticated) {
      const userStatus = data?.user?.status;
      const workspaceId = auth.user?.profile?.workspaceId;

      // If user is invited and not on the onboarding page, redirect them
      if (userStatus === "invited" && pathname !== "/onboarding/onboard-user") {
        router.replace("/onboarding/onboard-user");
        return;
      }

      // If user is not invited, has no workspace, and is not on the create-workspace page
      if (
        userStatus !== "invited" &&
        !workspaceId &&
        pathname !== "/onboarding/create-workspace"
      ) {
        router.replace("/onboarding/create-workspace");
        return;
      }
    }
  }, [auth, data, router, pathname]);

  if (auth.isLoading || (auth.isAuthenticated && isUserLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "260px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <MainContentWrapper>{children}</MainContentWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
