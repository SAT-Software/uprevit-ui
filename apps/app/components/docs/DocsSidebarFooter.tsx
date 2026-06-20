"use client";

import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import { cn } from "@uprevit/ui/lib/utils";
import { DocsSidebarFeedbackButton } from "./DocsSidebarFeedbackButton";

export function DocsSidebarFooter() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2">
      <DocsSidebarFeedbackButton />
      <div className="flex items-center justify-end p-0.5 mt-1">
        <ThemeSwitch
          className={cn("border-0 bg-transparent p-0 shadow-none *:rounded-md")}
        />
      </div>
    </div>
  );
}
