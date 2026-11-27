"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  GitBranchIcon,
  GitCompareIcon,
  GridTableIcon,
  Note01Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const MODULES: { title: string; body: string; href: string; icon: IconSvgElement }[] = [
  {
    title: "Products & bulk import",
    body: "Build 7-tab records or import Excel catalogs with dry-run validation.",
    href: "/platform/products",
    icon: GridTableIcon,
  },
  {
    title: "Version control",
    body: "Track Draft, In review, Released, and Obsolete states with locked masters.",
    href: "/platform/version-control",
    icon: GitBranchIcon,
  },
  {
    title: "Redlining",
    body: "Inspect automated field-by-field diffs across all 7 tabs in-app.",
    href: "/platform/redlining",
    icon: GitCompareIcon,
  },
  {
    title: "Approval workflows",
    body: "Route multi-product packages across RA, QA, and Packaging.",
    href: "/platform/approval-workflows",
    icon: SecurityCheckIcon,
  },
  {
    title: "Reports & exports",
    body: "Run portfolio impact reports and export full PDF & Excel dossiers.",
    href: "/platform/reports-exports",
    icon: Note01Icon,
  },
];

export default function PlatformModulesSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="platform-modules-heading" className="contents">
        <SectionHeader
          id="platform-modules-heading"
          anchorId="modules"
          title="From spreadsheet import"
          mutedTitle="to audit-ready release."
        >
          Every stage of medical device labeling connects inside one workspace.
          Dive deeper into any module below.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {MODULES.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, ease: EASE_OUT, delay: index * 0.05 }}
              className={cn(
                "rounded-tile bg-tile",
                index === MODULES.length - 1 && "sm:col-span-2 lg:col-span-1",
              )}
            >
              <Link
                href={module.href}
                data-attr={`platform-module-${index + 1}`}
                className="group/module flex h-full flex-col items-start gap-3.5 rounded-tile px-5 py-6 outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring sm:px-8 sm:py-7 xl:px-6 xl:py-8 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-subtle dark:[@media(hover:hover)_and_(pointer:fine)]:hover:bg-surface-2"
              >
                <span className="flex shrink-0 rounded-xl border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-3">
                  <span className="flex size-9 items-center justify-center rounded-[9px] bg-card text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-out dark:bg-surface-2 [@media(hover:hover)_and_(pointer:fine)]:group-hover/module:-translate-y-px">
                    <Icon icon={module.icon} size={18} strokeWidth={1.8} />
                  </span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5 text-balance font-ui text-[15px] font-medium leading-[1.4] text-foreground">
                    {module.title}
                    <Icon
                      icon={ArrowRight02Icon}
                      size={14}
                      strokeWidth={1.8}
                      className="shrink-0 -translate-x-1 text-foreground/60 opacity-0 transition-[opacity,transform] duration-200 ease-out group-focus-visible/module:translate-x-0 group-focus-visible/module:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/module:translate-x-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/module:opacity-100"
                    />
                  </span>
                  <span className="text-pretty font-ui text-[13.5px] leading-[1.5] text-muted-foreground">
                    {module.body}
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </TileRow>
      </section>
    </MotionConfig>
  );
}
