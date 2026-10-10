"use client";

import Link from "next/link";
import { ArrowLeft02Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { buttonVariants } from "@uprevit/ui/components/ui/button";
import { cn } from "@uprevit/ui/lib/utils";
import { useDocsLayout } from "fumadocs-ui/layouts/docs";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";

/** Header above the docs content: Back to App on the left, theme on the right. */
export function DocsHeader() {
  const { slots } = useDocsLayout();
  const SearchTrigger = slots.searchTrigger ? slots.searchTrigger.sm : null;
  const SidebarTrigger = slots.sidebar?.trigger;

  return (
    <header
      id="nd-subnav"
      className="[grid-row:1] [grid-column:3/5] min-w-0 sticky top-(--fd-docs-row-1) z-30 flex h-(--fd-header-height) items-center gap-2 border-b bg-fd-background/80 px-4 backdrop-blur-sm layout:[--fd-header-height:--spacing(14)] md:px-6"
    >
      <Link
        href="/dashboard"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Icon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
        Back to App
      </Link>
      <div className="flex-1" />
      <ThemeSwitch
        className={cn("border-0 bg-transparent p-0 shadow-none *:rounded-md")}
      />
      {SearchTrigger ? (
        <SearchTrigger hideIfDisabled className="p-2 md:hidden" />
      ) : null}
      {SidebarTrigger ? (
        <SidebarTrigger
          aria-label="Open sidebar"
          className={buttonVariants({
            variant: "ghost",
            size: "icon-sm",
            className: "md:hidden",
          })}
        >
          <Icon icon={SidebarLeftIcon} size={16} strokeWidth={2} />
        </SidebarTrigger>
      ) : null}
    </header>
  );
}
