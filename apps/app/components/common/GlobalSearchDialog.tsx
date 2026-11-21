"use client";

import {
  GLOBAL_SEARCH_MIN_LENGTH,
  useGlobalSearch,
  type GlobalSearchItem,
  type GlobalSearchResult,
} from "@/hooks/search/useGlobalSearch";
import { GuardedLink } from "@/components/common/GuardedLink";
import { useWorkspaceAccess } from "@/hooks/user/useWorkspaceAccess";
import { filterGlobalSearchCommands } from "@/lib/global-search-commands";
import type { WorkflowStatus } from "@/types/workflow";
import { WORKFLOW_STATUS_LABELS } from "@/utils/workflow/workflow-labels";
import {
  Blockchain03Icon,
  KanbanIcon,
  NewOfficeIcon,
  Search01Icon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@uprevit/ui/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useTheme } from "next-themes";
import { Fragment, useState, type ReactNode } from "react";

const RESULT_GROUPS: {
  key: keyof GlobalSearchResult;
  heading: string;
  icon: IconSvgElement;
  href: (id: string) => string;
  meta?: (meta: string) => string;
}[] = [
  { key: "products", heading: "Products", icon: Blockchain03Icon, href: (id) => `/products/${id}/product-information` },
  { key: "projects", heading: "Projects", icon: KanbanIcon, href: (id) => `/projects/${id}` },
  { key: "departments", heading: "Departments", icon: NewOfficeIcon, href: (id) => `/departments/${id}` },
  { key: "workflows", heading: "Workflows", icon: WorkflowIcon, href: (id) => `/workflows/${id}`, meta: (status) => WORKFLOW_STATUS_LABELS[status as WorkflowStatus] ?? status },
];

const ITEM_CLASS = "h-10 gap-2.5 rounded-md px-2.5 py-0 data-[selected=true]:bg-foreground/[0.04]";
const GROUP_CLASS = "p-0 [&_[cmdk-group-heading]]:flex [&_[cmdk-group-heading]]:h-7 [&_[cmdk-group-heading]]:items-center [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-0";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, search }: { text: string; search: string }) {
  const words = search.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!words.length) return text;
  const pattern = new RegExp(`(${words.join("|")})`, "gi");
  return text.split(pattern).map((part, index) =>
    index % 2 ? (
      <span key={index} className="font-semibold text-foreground">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-[5px] border bg-muted px-1 font-sans text-[11px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const access = useWorkspaceAccess();
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const { data, isSearching, isError, refetch } = useGlobalSearch(search);

  const trimmed = search.trim();
  const canSearchServer = trimmed.length >= GLOBAL_SEARCH_MIN_LENGTH;
  const commands = filterGlobalSearchCommands(access, trimmed);
  const lowerSearch = trimmed.toLowerCase();
  const isLiteralMatch = (item: GlobalSearchItem) =>
    [item.title, item.code].some((value) => value?.toLowerCase().includes(lowerSearch));
  const byLiteralMatch = (a: GlobalSearchItem, b: GlobalSearchItem) =>
    Number(isLiteralMatch(b)) - Number(isLiteralMatch(a));
  const resultGroups = RESULT_GROUPS.map((group) => ({
    ...group,
    items: [...(data?.[group.key] ?? [])].sort(byLiteralMatch),
  }))
    .filter((group) => group.items.length)
    .sort((a, b) => byLiteralMatch(a.items[0], b.items[0]));
  const isStale = Boolean(data && data.query !== trimmed);
  const showSkeleton = canSearchServer && isSearching && !data;
  const isEmpty = !commands.length && !resultGroups.length && !showSkeleton && !isError && !(canSearchServer && isSearching);

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) setSearch("");
  };

  const openSelected = () =>
    document.querySelector<HTMLAnchorElement>("[cmdk-item][data-selected='true'] a")?.click();

  const itemLink = (href: string | undefined, children: ReactNode) =>
    href ? (
    <GuardedLink
      href={href}
      tabIndex={-1}
      onNavigateAccepted={() => handleOpenChange(false)}
      className="pointer-events-none flex min-w-0 flex-1 items-center gap-2.5"
    >
      {children}
    </GuardedLink>
    ) : (
      children
    );

  const renderCommands = (group: "Actions" | "Go to") => {
    const items = commands.filter((command) => command.group === group);
    if (!items.length) return null;
    return (
      <CommandGroup heading={group} className={GROUP_CLASS}>
        {items.map((command) => (
          <CommandItem
            key={command.id}
            value={`command-${command.id}`}
            className={ITEM_CLASS}
            onSelect={() => {
              if (command.href) return openSelected();
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
              handleOpenChange(false);
            }}
          >
            {itemLink(
              command.href,
              <>
                <Icon icon={command.icon} className="text-muted-foreground" />
                <span className="truncate text-foreground/80">
                  <Highlight text={command.label} search={trimmed} />
                </span>
              </>,
            )}
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

  const sections = [
    renderCommands("Actions"),
    renderCommands("Go to"),
    ...resultGroups.map((group) => (
      <CommandGroup key={group.key} heading={group.heading} className={GROUP_CLASS}>
        {group.items.map((item) => (
          <CommandItem
            key={item.id}
            value={`${group.key}-${item.id}`}
            className={ITEM_CLASS}
            disabled={isStale}
            onSelect={openSelected}
          >
            {itemLink(
              group.href(item.id),
              <>
                <Icon icon={group.icon} className="text-muted-foreground" />
                <span className="min-w-0 truncate text-foreground/80">
                  <Highlight text={item.title} search={trimmed} />
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
                  {item.code && <Highlight text={item.code} search={trimmed} />}
                </span>
                {item.meta && (
                  <span className="max-w-[40%] shrink-0 truncate text-xs text-muted-foreground">
                    {group.meta ? group.meta(item.meta) : item.meta}
                  </span>
                )}
              </>,
            )}
          </CommandItem>
        ))}
      </CommandGroup>
    )),
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="top-[15vh] max-w-[600px] translate-y-0 gap-0 overflow-hidden p-0 sm:rounded-[14px]">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search products, projects, departments, workflows and pages
        </DialogDescription>
        <Command shouldFilter={false} loop className="rounded-none">
          <div className="relative [&_[cmdk-input-wrapper]]:h-[52px] [&_[cmdk-input-wrapper]]:px-4 [&_[cmdk-input-wrapper]]:hover:bg-transparent">
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder="Search products, projects or workflows"
              className="h-[52px] pr-14 text-[15px]"
            />
            <div className="absolute top-1/2 right-4 -translate-y-1/2">
              {canSearchServer && isSearching ? (
                <Spinner className="text-muted-foreground" />
              ) : (
                <Kbd>Esc</Kbd>
              )}
            </div>
          </div>
          <CommandList className="max-h-[min(60vh,440px)] p-1.5">
            {sections.map((section, index) => (
              <Fragment key={index}>
                {index > 0 && <CommandSeparator alwaysRender className="mx-1 my-1" />}
                {section}
              </Fragment>
            ))}
            {showSkeleton && (
              <div className="space-y-4 px-2.5 py-3" aria-hidden>
                <Skeleton className="h-2 w-16" />
                {[60, 48, 72, 40].map((width) => (
                  <div key={width} className="flex items-center gap-2.5">
                    <Skeleton className="size-4" />
                    <Skeleton className="h-2" style={{ width: `${width}%` }} />
                  </div>
                ))}
              </div>
            )}
            {isError && canSearchServer && !isSearching && (
              <CommandGroup heading="Workspace" className={GROUP_CLASS}>
                <CommandItem value="retry" className={ITEM_CLASS} onSelect={() => refetch()}>
                  <span className="text-foreground/80">Couldn&apos;t search your workspace.</span>
                  <span className="ml-auto text-xs font-medium text-foreground">Try again</span>
                </CommandItem>
              </CommandGroup>
            )}
            {isEmpty && (
              <div className="flex flex-col items-center px-6 py-12 text-center">
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg border shadow-xs">
                  <Icon icon={Search01Icon} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No results for &ldquo;{trimmed}&rdquo;
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try a product name, plan number, project or workflow.
                </p>
              </div>
            )}
          </CommandList>
          <div className="flex h-10 items-center gap-4 border-t bg-muted/50 px-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              Move
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              Open
            </span>
            {canSearchServer && isSearching && <span className="ml-auto">Searching…</span>}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
