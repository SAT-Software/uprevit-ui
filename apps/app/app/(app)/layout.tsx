"use client";

import { AppHeader } from "@/components/common/AppHeader";
import { AccessEligibilityGuard } from "@/components/common/AccessEligibilityGuard";
import { MainContentWrapper } from "@/components/common/MainContentWrapper";
import {
  SidebarInset,
  SidebarProvider,
} from "@uprevit/ui/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar";
import { ExportJobNotifier } from "@/components/common/ExportJobNotifier";
import { GlobalSearchProvider } from "@/components/common/GlobalSearchProvider";
import { PostHogSupportSync } from "@/components/common/PostHogSupportSync";
import { ProductWorkbookUnsavedGuardProvider } from "@/lib/product-workbook-unsaved-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccessEligibilityGuard>
      <PostHogSupportSync />
      <ProductWorkbookUnsavedGuardProvider>
      <SidebarProvider>
      <GlobalSearchProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <ExportJobNotifier resource="products" />
          <ExportJobNotifier resource="reports" />
          <MainContentWrapper>{children}</MainContentWrapper>
        </SidebarInset>
      </GlobalSearchProvider>
      </SidebarProvider>
      </ProductWorkbookUnsavedGuardProvider>
    </AccessEligibilityGuard>
  );
}
