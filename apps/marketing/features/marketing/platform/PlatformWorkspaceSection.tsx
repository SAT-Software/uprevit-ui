"use client";

import { MotionConfig, motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  CubeIcon,
  Folder02Icon,
  Layers01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { GovTile, RoleBasedAccess } from "@/features/marketing/landing-page/GovernanceSection";
import { ScaledCanvas } from "@/features/marketing/landing-page/ScaledCanvas";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { usePlayback } from "@/features/marketing/landing-page/usePlayback";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const LEVELS: {
  label: string;
  code: string;
  icon: IconSvgElement;
  width: number;
  className: string;
  metaClassName: string;
}[] = [
  {
    label: "Products",
    code: "PX-2042",
    icon: CubeIcon,
    width: 224,
    className:
      "border-white/[0.14] bg-[#1A1A1A] font-semibold text-subtle shadow-[0_8px_18px_-6px_rgba(0,0,0,0.2)] dark:border-white/[0.16] dark:bg-[#383838] dark:text-foreground",
    metaClassName: "text-white/50",
  },
  {
    label: "Projects",
    code: "PRJ-019",
    icon: Layers01Icon,
    width: 256,
    className:
      "border-white/[0.12] bg-[#262626] text-[#E5E5E5] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.15)] dark:border-white/[0.12] dark:bg-[#2A2A2A] dark:text-foreground/90",
    metaClassName: "text-white/40",
  },
  {
    label: "Departments",
    code: "DPT-002",
    icon: Folder02Icon,
    width: 288,
    className:
      "border-white/10 bg-[#333333] text-[#D4D4D4] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.12)] dark:border-white/[0.08] dark:bg-[#1F1F1F] dark:text-foreground/80",
    metaClassName: "text-white/65",
  },
];

const LEVEL_STAGGER = [1.98, 1.45, 0.85] as const;
const LEVEL_DURATION = [0.5, 0.52, 0.55] as const;
const LEVEL_Z = ["z-10", "z-20", "z-30"] as const;

const SHOWN = { opacity: 1, y: 0, scale: 1 };
const BASE_HIDDEN = { opacity: 0, y: 12, scale: 0.96 };
const LEVEL_HIDDEN = { opacity: 0, y: 46, scale: 0.94 };
const EXIT = { duration: 0.28, ease: EASE_OUT };

function WorkspaceHierarchy({ reduceMotion }: { reduceMotion: boolean }) {
  const [ref, on] = usePlayback(reduceMotion, 8200, 1000);

  return (
    <ScaledCanvas ref={ref} aria-hidden="true" width={400} height={356}>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-6 size-[280px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(23,23,23,0.12)_0%,rgba(23,23,23,0.04)_45%,transparent_72%)] dark:bg-[radial-gradient(circle,rgba(237,237,237,0.06)_0%,rgba(237,237,237,0.02)_45%,transparent_72%)]"
      />
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="relative flex flex-col items-center gap-1.5">
          {LEVELS.map((level, index) => (
            <motion.div
              key={level.label}
              initial={false}
              animate={on ? SHOWN : reduceMotion ? { opacity: 0 } : LEVEL_HIDDEN}
              transition={
                on
                  ? {
                      duration: LEVEL_DURATION[index],
                      ease: EASE_OUT,
                      delay: LEVEL_STAGGER[index],
                    }
                  : EXIT
              }
              className={cn(
                "relative flex h-[42px] shrink-0 items-center justify-between gap-2 rounded-[11px] border px-3.5",
                LEVEL_Z[index],
                level.className,
              )}
              style={{ width: level.width }}
            >
              <span className="flex items-center gap-2">
                <Icon icon={level.icon} size={14} strokeWidth={2} className="shrink-0" />
                <span className="font-ui text-[13px] leading-4">{level.label}</span>
              </span>
              <span className={cn("font-mono text-[10px] leading-[13px]", level.metaClassName)}>
                {level.code}
              </span>
            </motion.div>
          ))}
          <motion.div
            initial={false}
            animate={on ? SHOWN : reduceMotion ? { opacity: 0 } : BASE_HIDDEN}
            transition={on ? { duration: 0.5, ease: EASE_OUT, delay: 0.15 } : EXIT}
            className="relative z-40 w-[328px] rounded-[15px] border border-border bg-card p-1.5 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.07)] dark:border-edge-2 dark:bg-surface-2"
          >
            <div className="flex h-[38px] items-center justify-between rounded-[9px] border border-dashed border-stroke-strong bg-surface-hover px-3 dark:border-edge-3 dark:bg-surface-3">
              <span className="flex items-center gap-2">
                <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-foreground font-sans text-[10px] font-semibold leading-3 text-background">
                  U
                </span>
                <span className="font-ui text-[13px] font-semibold leading-4 text-foreground">Uprevit</span>
              </span>
              <span className="font-mono text-[10px] uppercase leading-[13px] text-placeholder">Workspace</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={
            on
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.95, y: reduceMotion ? 0 : 6 }
          }
          transition={on ? { duration: 0.4, ease: EASE_OUT, delay: 2.45 } : EXIT}
          className="mt-[22px] flex items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white py-1 pl-2 pr-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-edge-2 dark:bg-surface-2"
        >
          <Icon icon={Tick02Icon} size={14} strokeWidth={2.4} className="shrink-0 text-foreground" />
          <span className="font-ui text-[12px] font-medium leading-4 text-foreground">Products</span>
          <span className="flex h-4 items-center rounded-full bg-foreground/[0.08] px-[5px] font-mono text-[9px] leading-3 text-foreground shadow-[inset_0_0_0_1px_rgba(23,23,23,0.14)] dark:shadow-[inset_0_0_0_1px_rgba(237,237,237,0.14)]">
            4/4
          </span>
        </motion.div>
      </div>
    </ScaledCanvas>
  );
}

export default function PlatformWorkspaceSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="platform-workspace-heading" className="contents">
        <SectionHeader
          id="platform-workspace-heading"
          anchorId="workspace"
          title="Organized like your teams."
          mutedTitle="Scoped by role."
        >
          Mirror your business units from Departments down to Projects and
          Products, while role-based access keeps authoring, approvals, and
          workspace governance cleanly separated.
        </SectionHeader>

        <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px lg:grid-cols-2">
          <GovTile
            title="Workspace hierarchy"
            body="Every product lives in a clear Department → Project → Product tree with team ownership."
            maxWidth={520}
          >
            <WorkspaceHierarchy reduceMotion={reduceMotion} />
          </GovTile>
          <GovTile
            title="Role-based access control"
            body="Clear permissions across workspace roles and per-product teams."
            maxWidth={520}
          >
            <RoleBasedAccess reduceMotion={reduceMotion} badgeVariant="tooltip" />
          </GovTile>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
