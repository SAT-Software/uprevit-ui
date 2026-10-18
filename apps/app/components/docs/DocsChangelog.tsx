import type { ReactNode } from "react";
import {
  ArrowUp02Icon,
  SparklesIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import { DocsIcon } from "@/components/docs/DocsIcon";

const GROUPS = {
  new: { label: "New", icon: SparklesIcon, variant: "green" },
  improved: { label: "Improved", icon: ArrowUp02Icon, variant: "blue" },
  fixed: { label: "Fixed", icon: Wrench01Icon, variant: "orange" },
} as const;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function DocsChangelogRelease({
  date,
  latest,
  children,
}: {
  date: string;
  latest?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="relative grid gap-x-10 gap-y-3 pb-12 last:pb-0 md:grid-cols-[8rem_1fr]">
      <div className="not-prose md:sticky md:top-[calc(var(--fd-docs-row-2,4rem)+1.5rem)] md:self-start">
        <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-start md:pt-1.5">
          <time
            dateTime={date}
            className="text-sm font-medium text-fd-muted-foreground"
          >
            {dateFormatter.format(new Date(date))}
          </time>
          {latest ? <Badge variant="green">Latest</Badge> : null}
        </div>
      </div>
      <div
        className={cn(
          "relative min-w-0 border-l border-fd-border pl-6 md:pl-8",
          "[&>h2:first-of-type]:mt-0 [&>h2]:scroll-mt-24",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-3 -left-[5px] size-2.5 rounded-full ring-4 ring-fd-background",
            latest ? "bg-fd-primary" : "bg-fd-muted-foreground/40",
          )}
        />
        {children}
      </div>
    </section>
  );
}

export function DocsChangelogGroup({
  type,
  children,
}: {
  type: keyof typeof GROUPS;
  children: ReactNode;
}) {
  const group = GROUPS[type];

  return (
    <div className="mt-5 first:mt-0 [&_ul]:mt-2 [&_ul]:mb-0">
      <Badge variant={group.variant} className="not-prose gap-1 py-0.5">
        <span aria-hidden="true" className="contents">
          <DocsIcon icon={group.icon} size={12} />
        </span>
        {group.label}
      </Badge>
      {children}
    </div>
  );
}
