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
            <div className="relative flex flex-col gap-1.5 px-5 sm:px-8 lg:px-10">
              <h3 className="font-ui text-body-l font-medium leading-[22px] text-foreground">
                Seats follow roles
              </h3>
              <p className="max-w-[420px] text-pretty font-ui text-body-m leading-[22px] text-muted-foreground">
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
            className="flex min-w-0 flex-col rounded-tile bg-tile px-5 pb-6 pt-3 sm:px-8 sm:pb-8 sm:pt-4 lg:px-10"
          >
            <div className="-mx-1 overflow-x-auto px-1">
              <table
                aria-label="Role capabilities matrix"
                className="w-full min-w-[440px] border-collapse"
              >
                <thead>
                  <tr className="border-b border-border dark:border-edge-2">
                    <th
                      scope="col"
                      className="py-4 pr-3 text-left align-bottom font-ui text-caption font-medium uppercase leading-4 tracking-label text-faint-foreground sm:py-5 sm:text-label"
                    >
                      Capability
                    </th>
                    {ROLE_COLUMNS.map((col, colIndex) => {
                      const isHighlighted = hoveredRole === colIndex;
                      return (
                        <th
                          key={col.label}
                          scope="col"
                          onMouseEnter={() => setHoveredRole(colIndex)}
                          onMouseLeave={() => setHoveredRole(null)}
                          className={cn(
                            "w-[64px] py-4 text-center align-bottom font-normal transition-colors duration-150 sm:w-[76px] sm:py-5 md:w-[96px] lg:w-[80px] xl:w-[110px]",
                            isHighlighted &&
                              "bg-foreground/[0.035] dark:bg-white/[0.04]",
                          )}
                        >
                          <div className="flex flex-col items-center justify-center gap-0.5 py-1">
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
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {CAPABILITY_ROWS.map((row, rowIndex) => {
                    const isLast = rowIndex === CAPABILITY_ROWS.length - 1;
                    return (
                      <tr
                        key={row.capability}
                        className={cn(
                          !isLast &&
                            "border-b border-separator dark:border-edge-1",
                        )}
                      >
                        <th
                          scope="row"
                          className="py-3.5 pr-3 text-left font-ui text-[13px] font-normal leading-[19px] text-foreground sm:text-[15px] sm:leading-[22px]"
                        >
                          {row.capability}
                        </th>
                        {row.values.map((cell, colIndex) => {
                          const isHighlighted = hoveredRole === colIndex;
                          return (
                            <td
                              key={`${row.capability}-${ROLE_COLUMNS[colIndex].label}`}
                              onMouseEnter={() => setHoveredRole(colIndex)}
                              onMouseLeave={() => setHoveredRole(null)}
                              className={cn(
                                "py-3.5 text-center align-middle transition-colors duration-150",
                                isHighlighted &&
                                  "bg-foreground/[0.035] dark:bg-white/[0.04]",
                              )}
                            >
                              <div className="flex items-center justify-center py-1">
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
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
