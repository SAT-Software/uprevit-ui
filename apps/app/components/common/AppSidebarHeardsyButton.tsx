"use client";

import Script from "next/script";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Idea01Icon } from "@hugeicons/core-free-icons";

const HEARDSY_WIDGET_SRC =
  "https://heardsy.amittambulkar104.workers.dev/widget.js";

export function SidebarHeardsyButton() {
  return (
    <>
      <Script
        src={HEARDSY_WIDGET_SRC}
        strategy="afterInteractive"
        data-launcher="hidden"
      />
      <SidebarMenuButton
        type="button"
        data-openheard-open="feedback"
        aria-label="Open feature requests, roadmap, and changelog"
        className="h-8 w-full text-sidebar-accent-foreground/40"
      >
        <Icon icon={Idea01Icon} />
        <span className="text-sidebar-foreground">Feature requests</span>
      </SidebarMenuButton>
    </>
  );
}
