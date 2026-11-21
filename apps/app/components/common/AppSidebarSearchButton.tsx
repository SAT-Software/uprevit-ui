"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { SidebarMenuButton } from "@uprevit/ui/components/ui/sidebar";
import { useEffect, useState } from "react";
import { GlobalSearchDialog } from "./GlobalSearchDialog";

export function SidebarSearchButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      event.preventDefault();
      setOpen((current) => !current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <SidebarMenuButton
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        aria-keyshortcuts="Meta+K Control+K"
        className="h-8 w-full border bg-background text-sidebar-accent-foreground/40 shadow-xs hover:bg-background"
      >
        <Icon icon={Search01Icon} />
        <span className="flex-1 text-muted-foreground">Search</span>
        <kbd className="inline-flex h-5 items-center rounded-[5px] border bg-muted px-1.5 font-sans text-[11px] font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
          ⌘K
        </kbd>
      </SidebarMenuButton>
      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
