"use client";

import { CustomerSupportIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { SendFeedbackDialog } from "./SendFeedbackDialog";

export function SidebarSupportButton() {
  return (
    <SendFeedbackDialog>
      <SidebarMenuButton
        type="button"
        aria-label="Contact support to report a bug, issue, or send feedback"
        className="h-8 w-full text-sidebar-accent-foreground/40"
      >
        <Icon icon={CustomerSupportIcon} />
        <span className="text-sidebar-foreground">Contact Support</span>
      </SidebarMenuButton>
    </SendFeedbackDialog>
  );
}
