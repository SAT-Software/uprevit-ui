"use client";

import * as Sentry from "@sentry/nextjs";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { cn } from "@uprevit/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import { PiChatTeardropDotsDuotone } from "react-icons/pi";

export function SidebarFeedbackButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [feedback] = useState(() => Sentry.getFeedback());

  useEffect(() => {
    if (!feedback || !buttonRef.current) return;
    return feedback.attachTo(buttonRef.current, {
      formTitle: "Submit Feedback",
    });
  }, [feedback]);

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
