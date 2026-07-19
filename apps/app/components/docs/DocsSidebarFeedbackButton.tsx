"use client";

import { useSentryFeedbackAttach } from "@/hooks/sentry/useSentryFeedbackAttach";
import {
  SENTRY_FEEDBACK_ARIA_LABEL,
  SENTRY_FEEDBACK_BUTTON_LABEL,
} from "@/lib/sentry/feedbackLabels";
import { ChatFeedback01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

export function DocsSidebarFeedbackButton() {
  const buttonRef = useSentryFeedbackAttach<HTMLButtonElement>();

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={SENTRY_FEEDBACK_ARIA_LABEL}
      className={cn(
        "flex w-full min-w-0 items-start gap-2 rounded-lg border bg-fd-secondary/50 p-2.5 text-start text-sm leading-snug text-fd-muted-foreground",
        "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 cursor-pointer",
      )}
    >
      <Icon
        icon={ChatFeedback01Icon}
        size={16}
        strokeWidth={2}
        className="shrink-0"
      />
      <span className="min-w-0">{SENTRY_FEEDBACK_BUTTON_LABEL}</span>
    </button>
  );
}
