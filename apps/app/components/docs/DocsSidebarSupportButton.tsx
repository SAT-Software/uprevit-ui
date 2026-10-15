"use client";

import { ChatFeedback01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { SendFeedbackDialog } from "@/components/common/SendFeedbackDialog";

export function DocsSidebarSupportButton() {
  return (
    <SendFeedbackDialog>
      <button
        type="button"
        aria-label="Report a bug, issue, or send product feedback"
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
        <span className="min-w-0">Send feedback</span>
      </button>
    </SendFeedbackDialog>
  );
}
