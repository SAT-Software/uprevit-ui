"use client";

import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import { cn } from "@uprevit/ui/lib/utils";
import type { ComponentProps } from "react";
import { useSentryFeedbackAttach } from "@/hooks/sentry/useSentryFeedbackAttach";
import { PiChatTeardropDotsDuotone } from "react-icons/pi";
import { Button } from "@uprevit/ui/components/ui/button";

function SentryFeedbackButton() {
  const buttonRef = useSentryFeedbackAttach<HTMLButtonElement>();

  return (
    <Button ref={buttonRef} aria-label="Send feedback" variant="ghost">
      <PiChatTeardropDotsDuotone className="size-4" /> Send Feedback
    </Button>
  );
}

export function DocsSidebarThemeSwitch({
  className,
  ...props
}: ComponentProps<typeof ThemeSwitch>) {
  return (
    <div className="ms-auto flex w-full min-w-0 flex-1 items-center justify-between">
      <SentryFeedbackButton />
      <ThemeSwitch
        {...props}
        className={cn(
          "ms-0! shrink-0 rounded-none border-y-0 border-e-0 px-1 py-0 *:rounded-md",
          className,
        )}
      />
    </div>
  );
}
