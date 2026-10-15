"use client";

import { ChatFeedback01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { SendFeedbackDialog } from "./SendFeedbackDialog";

export function SidebarSupportButton() {
  return (
    <SendFeedbackDialog>
      <SidebarMenuButton
        type="button"
        aria-label="Report a bug, issue, or send product feedback"
        className="h-8 w-full text-sidebar-accent-foreground/40"
      >
        <Icon icon={ChatFeedback01Icon} />
        <span className="text-sidebar-foreground">Send feedback</span>
      </SidebarMenuButton>
    </SendFeedbackDialog>
  );
}
