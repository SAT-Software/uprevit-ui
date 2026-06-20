"use client";

import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { cn } from "@uprevit/ui/lib/utils";
import { useSentryFeedbackAttach } from "@/hooks/sentry/useSentryFeedbackAttach";
import {
  SENTRY_FEEDBACK_ARIA_LABEL,
  SENTRY_FEEDBACK_BUTTON_LABEL,
} from "@/lib/sentry/feedbackLabels";
import { PiChatTeardropDotsDuotone } from "react-icons/pi";

export function SidebarFeedbackButton() {
  const buttonRef = useSentryFeedbackAttach<HTMLButtonElement>();

  return (
    <SidebarMenuButton
      ref={buttonRef}
      type="button"
      aria-label={SENTRY_FEEDBACK_ARIA_LABEL}
      className={cn("h-7 w-full border border-transparent")}
    >
      <PiChatTeardropDotsDuotone />
      {SENTRY_FEEDBACK_BUTTON_LABEL}
    </SidebarMenuButton>
  );
}
