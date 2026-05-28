"use client";

import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { cn } from "@uprevit/ui/lib/utils";
import { useSentryFeedbackAttach } from "@/hooks/sentry/useSentryFeedbackAttach";
import { PiChatTeardropDotsDuotone } from "react-icons/pi";

export function SidebarFeedbackButton() {
  const buttonRef = useSentryFeedbackAttach<HTMLButtonElement>();

  return (
    <SidebarMenuButton
      ref={buttonRef}
      type="button"
      className={cn("h-7 w-full border border-transparent")}
    >
      <PiChatTeardropDotsDuotone />
      Send Feedback
    </SidebarMenuButton>
  );
}
