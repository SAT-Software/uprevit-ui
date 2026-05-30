"use client";

import { useSentryFeedbackAttach } from "@/hooks/sentry/useSentryFeedbackAttach";
import {
  SENTRY_FEEDBACK_ARIA_LABEL,
  SENTRY_FEEDBACK_BUTTON_LABEL,
} from "@/lib/sentry/feedbackLabels";
import { cn } from "@uprevit/ui/lib/utils";
import { PiChatTeardropDotsDuotone } from "react-icons/pi";

export function DocsSidebarFeedbackButton() {
  const buttonRef = useSentryFeedbackAttach<HTMLButtonElement>();

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={SENTRY_FEEDBACK_ARIA_LABEL}
      className={cn(
        "flex w-full min-w-0 items-start gap-2 rounded-lg border bg-fd-secondary/50 p-2.5 text-start text-sm leading-snug text-fd-muted-foreground",
        "transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80",
      )}
    >
      <PiChatTeardropDotsDuotone className=" size-4 shrink-0" />
      <span className="min-w-0">{SENTRY_FEEDBACK_BUTTON_LABEL}</span>
    </button>
  );
}
