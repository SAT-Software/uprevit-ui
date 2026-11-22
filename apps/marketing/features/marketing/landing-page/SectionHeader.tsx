"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 8 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.45, ease: EASE_OUT, delay },
  };
}

export function SectionHeader({
  id,
  title,
  mutedTitle,
  children,
}: {
  id: string;
  title: ReactNode;
  mutedTitle: ReactNode;
  children: ReactNode;
}) {
  return (
    <TileRow centerClassName="flex flex-col gap-8 px-6 pb-12 pt-16 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:pt-24">
      <motion.h2
        id={id}
        {...reveal(0)}
        className="font-sans text-[32px] font-medium leading-[38px] tracking-[-0.035em] text-foreground sm:text-[40px] sm:leading-[46px]"
      >
        {title}
        <br />
        <span className="text-foreground/40">{mutedTitle}</span>
      </motion.h2>
      <motion.p
        {...reveal(0.08)}
        className="border-l border-border pl-6 font-ui text-[16px] leading-6 text-muted-foreground lg:w-[440px] lg:shrink-0 dark:border-edge-2"
      >
        {children}
      </motion.p>
    </TileRow>
  );
}
