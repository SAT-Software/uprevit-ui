"use client";

import * as React from "react";
import { MotionConfig, motion } from "motion/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { RoleBasedAccess } from "@/features/marketing/landing-page/GovernanceSection";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type CellValue = "check" | "dash" | "plus-manager";

interface RoleColumn {
  label: string;
  shortLabel: string;
  seat: string;
}

const ROLE_COLUMNS: RoleColumn[] = [
  { label: "Admin", shortLabel: "Admin", seat: "Full seat" },
  { label: "User", shortLabel: "User", seat: "Full seat" },
  { label: "Approver", shortLabel: "Appr.", seat: "Approver seat" },
  { label: "Manager", shortLabel: "Mgr.", seat: "Free" },
];

const CAPABILITY_ROWS: {
  capability: string;
  values: [CellValue, CellValue, CellValue, CellValue];
}[] = [
  {
    capability: "Create and edit products",
    values: ["check", "check", "dash", "dash"],
  },
  {
    capability: "Start review workflows",
    values: ["check", "check", "dash", "dash"],
  },
  {
    capability: "View products and history",
    values: ["check", "check", "check", "dash"],
  },
  {
    capability: "Approve in assigned workflows",
    values: ["check", "check", "check", "dash"],
  },
  {
    capability: "Manage the workspace and members",
    values: ["check", "dash", "dash", "dash"],
  },
  {
    capability: "View usage",
    values: ["check", "dash", "dash", "check"],
  },
  {
    capability: "Billing and invoices",
    values: ["plus-manager", "plus-manager", "plus-manager", "check"],
  },
];

export default function PricingRolesSection() {
  const reduceMotion = usePrefersReducedMotion();
  const [hoveredRole, setHoveredRole] = React.useState<number | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="pricing-roles-heading" className="contents">
        <SectionHeader
          id="pricing-roles-heading"
          anchorId="roles"
          title="Who needs which seat."
          mutedTitle="At a glance."
        >
          Seats follow roles. People who build products take a full seat,
          reviewers a lower-priced Approver seat, and billing-only members are
          free.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[436px_minmax(0,1fr)]"
        >
          <article className="relative hidden min-w-0 flex-col gap-7 overflow-hidden rounded-tile bg-tile pt-10 lg:flex">
            <DotsBackdrop
              className="top-24 opacity-30"
              dotsClassName="[mask-image:radial-gradient(ellipse_76%_72%_at_50%_50%,transparent_58%,#000_78%,transparent_96%)]"
            />
            <div className="relative flex flex-col gap-1.5 px-8 xl:px-10">
              <h3 className="font-ui text-body-l font-medium leading-[22px] text-foreground">
                Seats follow roles
              </h3>
              <p className="max-w-[420px] font-ui text-body-m leading-[22px] text-muted-foreground">
                Each role sees and does only what it&apos;s allowed. Pick seats
                by what people do.
              </p>
            </div>
            <RoleBasedAccess
              reduceMotion={reduceMotion}
              badgeVariant="detailed"
              activeRoleIndex={hoveredRole}
              onRoleHover={setHoveredRole}
            />
          </article>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="flex min-w-0 flex-col rounded-tile bg-tile px-4 pb-6 pt-3 sm:px-8 sm:pb-8 sm:pt-4"
          >
            <div
              role="table"
              aria-label="Role capabilities matrix"
              className="w-full"
            >
              <div
                role="row"
                className="flex items-end border-b border-border py-4 sm:py-5 dark:border-edge-2"
              >
                <div
                  role="columnheader"
                  className="min-w-0 flex-1 pr-2 font-ui text-caption font-medium uppercase leading-4 tracking-label text-faint-foreground sm:text-label"
                >
                  Capability
                </div>
                {ROLE_COLUMNS.map((col, colIndex) => {
                  const isHighlighted = hoveredRole === colIndex;
                  return (
                    <div
                      key={col.label}
                      role="columnheader"
                      onMouseEnter={() => setHoveredRole(colIndex)}
                      onMouseLeave={() => setHoveredRole(null)}
                      className={cn(
                        "flex w-[44px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-md py-1 transition-colors duration-150 sm:w-[76px] md:w-[96px] lg:w-[80px] xl:w-[110px]",
                        isHighlighted &&
                          "bg-foreground/[0.035] dark:bg-white/[0.04]",
                      )}
                    >
                      <span className="font-sans text-[13px] font-medium leading-5 text-foreground sm:hidden">
                        {col.shortLabel}
                      </span>
                      <span className="hidden font-sans text-[16px] font-medium leading-6 text-foreground sm:inline xl:text-lead">
                        {col.label}
                      </span>
                      <span className="hidden font-ui text-caption leading-[16px] text-muted-foreground sm:inline xl:text-body-s xl:leading-[18px]">
                        {col.seat}
                      </span>
                    </div>
                  );
                })}
              </div>

              {CAPABILITY_ROWS.map((row, rowIndex) => {
                const isLast = rowIndex === CAPABILITY_ROWS.length - 1;
                return (
                  <div
                    key={row.capability}
                    role="row"
                    className={cn(
                      "flex items-center py-3.5",
                      !isLast &&
                        "border-b border-separator dark:border-edge-1",
                    )}
                  >
                    <div
                      role="rowheader"
                      className="min-w-0 flex-1 pr-2 font-ui text-[13px] leading-[19px] text-foreground sm:text-[15px] sm:leading-[22px]"
                    >
                      {row.capability}
                    </div>
                    {row.values.map((cell, colIndex) => {
                      const isHighlighted = hoveredRole === colIndex;
                      return (
                        <div
                          key={`${row.capability}-${ROLE_COLUMNS[colIndex].label}`}
                          role="cell"
                          onMouseEnter={() => setHoveredRole(colIndex)}
                          onMouseLeave={() => setHoveredRole(null)}
                          className={cn(
                            "flex w-[44px] shrink-0 items-center justify-center rounded-md py-1 transition-colors duration-150 sm:w-[76px] md:w-[96px] lg:w-[80px] xl:w-[110px]",
                            isHighlighted &&
                              "bg-foreground/[0.035] dark:bg-white/[0.04]",
                          )}
                        >
                          {cell === "check" && (
                            <>
                              <Icon
                                icon={Tick02Icon}
                                size={18}
                                strokeWidth={2.2}
                                className="size-4 shrink-0 text-primary sm:size-[18px] dark:text-primary-400"
                              />
                              <span className="sr-only">Included</span>
                            </>
                          )}
                          {cell === "dash" && (
                            <>
                              <span
                                aria-hidden="true"
                                className="h-[1.5px] w-2.5 shrink-0 bg-ring sm:w-3"
                              />
                              <span className="sr-only">Not included</span>
                            </>
                          )}
                          {cell === "plus-manager" && (
                            <>
                              <span className="whitespace-nowrap font-ui text-[11px] leading-4 text-muted-foreground sm:hidden">
                                + Mgr.
                              </span>
                              <span className="hidden whitespace-nowrap font-ui text-body-s leading-[18px] text-muted-foreground sm:inline">
                                + Manager
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
