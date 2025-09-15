import { AppHeader } from "@/components/common/app-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { MainContentWrapper } from "@/components/common/main-content-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AuthWrapper } from "@/components/auth/auth-wrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
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
		</AuthWrapper>
  );
}
