import { Activity01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@uprevit/ui/components/ui/sidebar";

const statusPageUrl = process.env.NEXT_PUBLIC_STATUS_PAGE_URL;

export function SidebarSystemStatusButton() {
  if (!statusPageUrl) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="h-8 w-full text-sidebar-accent-foreground/40"
      >
        <a href={statusPageUrl} target="_blank" rel="noopener noreferrer">
          <Icon icon={Activity01Icon} />
          <span className="text-sidebar-foreground">System Status</span>
          <Icon icon={ArrowUpRight01Icon} className="ml-auto" />
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
