"use client";

import Script from "next/script";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Idea01Icon } from "@hugeicons/core-free-icons";

const HEARDSY_ORIGIN = "https://heardsy.amittambulkar104.workers.dev";
const HEARDSY_WIDGET_SRC = `${HEARDSY_ORIGIN}/widget.js`;

// The widget opens itself from data-openheard-open once its script has run and
// defined window.openheard. Until then, or if the script is blocked, open the
// public board instead so the button never does nothing.
const openBoardIfWidgetMissing = () => {
  if (typeof (window as Window & { openheard?: unknown }).openheard === "function") {
    return;
  }
  window.open(HEARDSY_ORIGIN, "_blank", "noopener,noreferrer");
};

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
        onClick={openBoardIfWidgetMissing}
        aria-label="Open feature requests, roadmap, and changelog"
        className="h-8 w-full text-sidebar-accent-foreground/40"
      >
        <Icon icon={Idea01Icon} />
        <span className="text-sidebar-foreground">Feature requests</span>
      </SidebarMenuButton>
    </>
  );
}
