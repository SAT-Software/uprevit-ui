"use client";

import { AppHeader } from "@/components/common/AppHeader";
import { AccessEligibilityGuard } from "@/components/common/AccessEligibilityGuard";
import { MainContentWrapper } from "@/components/common/MainContentWrapper";
import {
  SidebarInset,
  SidebarProvider,
} from "@uprevit/ui/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar";
import { ProductExportJobNotifier } from "@/components/common/ProductExportJobNotifier";
import { ReportExportJobNotifier } from "@/components/common/ReportExportJobNotifier";
import { SentryUserSync } from "@/components/common/SentryUserSync";
import { ProductWorkbookUnsavedGuardProvider } from "@/lib/product-workbook-unsaved-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccessEligibilityGuard>
      <SentryUserSync />
      <ProductWorkbookUnsavedGuardProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <ProductExportJobNotifier />
          <ReportExportJobNotifier />
          <MainContentWrapper>{children}</MainContentWrapper>
        </SidebarInset>
      </SidebarProvider>
      </ProductWorkbookUnsavedGuardProvider>
    </AccessEligibilityGuard>
  );
}
