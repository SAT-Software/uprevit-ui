import { AppHeader } from "@/components/common/app-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
        <div className="flex flex-1 flex-col gap-4 bg-muted h-full">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
