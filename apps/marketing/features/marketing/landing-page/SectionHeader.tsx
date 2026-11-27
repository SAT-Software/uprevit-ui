"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, ease: EASE_OUT, delay },
  };
}

export function SectionHeader({
  id,
  anchorId,
  title,
  mutedTitle,
  children,
}: {
  id: string;
  anchorId?: string;
  title: ReactNode;
  mutedTitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <TileRow
      id={anchorId}
      className={anchorId ? "scroll-mt-14" : undefined}
      centerClassName="flex flex-col gap-4 px-5 pb-8 pt-14 sm:gap-6 sm:px-8 sm:pb-10 sm:pt-18 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-10 lg:pb-12 lg:pt-24"
    >
      <motion.h2
        id={id}
        {...reveal(0)}
        className="text-balance font-sans text-[26px] font-medium leading-[1.15] tracking-[-0.035em] text-foreground sm:text-[34px] lg:text-[40px]"
      >
        {title}
        <span className="sm:hidden"> </span>
        <br className="hidden sm:inline" />
        <span className="text-foreground/55">{mutedTitle}</span>
      </motion.h2>
      <motion.p
        {...reveal(0.08)}
        className="border-s border-border ps-4 text-pretty font-ui text-[14px] leading-[1.5] text-muted-foreground sm:ps-6 sm:text-[16px] lg:w-[440px] lg:shrink-0 dark:border-edge-2"
      >
        {children}
      </motion.p>
    </TileRow>
  );
}
