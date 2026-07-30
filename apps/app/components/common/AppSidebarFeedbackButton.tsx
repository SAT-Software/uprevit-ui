"use client";

import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { cn } from "@uprevit/ui/lib/utils";
import { useSentryFeedbackAttach } from "@/hooks/sentry/useSentryFeedbackAttach";
import {
  SENTRY_FEEDBACK_ARIA_LABEL,
  SENTRY_FEEDBACK_BUTTON_LABEL,
} from "@/lib/sentry/feedbackLabels";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { ChatFeedback01Icon } from "@hugeicons/core-free-icons";

export function SidebarFeedbackButton() {
  const buttonRef = useSentryFeedbackAttach<HTMLButtonElement>();

  return (
    <SidebarMenuButton
      ref={buttonRef}
      type="button"
      aria-label={SENTRY_FEEDBACK_ARIA_LABEL}
      className={cn("h-8 w-full text-sidebar-accent-foreground/40")}
    >
      <Icon icon={ChatFeedback01Icon} />
      <span className="text-sidebar-foreground">
        {SENTRY_FEEDBACK_BUTTON_LABEL}
      </span>
    </SidebarMenuButton>
  );
}
