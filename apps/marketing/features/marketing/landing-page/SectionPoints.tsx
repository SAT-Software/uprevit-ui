"use client";

import { motion } from "motion/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow } from "@/components/TileGrid";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type SectionPoint = { title: string; body: string; icon: IconSvgElement };

export function SectionPoints({ points }: { points: SectionPoint[] }) {
  return (
    <TileRow splitCenter centerClassName="grid grid-cols-1 gap-px md:grid-cols-3">
      {points.map((point, index) => (
        <motion.div
          key={point.title}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.06 }}
          className="group flex items-start gap-4 rounded-tile bg-tile px-5 py-6 sm:px-8 sm:py-7 md:flex-col md:gap-3 lg:flex-row lg:gap-4 lg:px-10 lg:py-8"
        >
          <span className="flex shrink-0 rounded-xl border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <span className="flex size-9 items-center justify-center rounded-[9px] bg-card shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:bg-surface-2">
              <Icon
                icon={point.icon}
                size={18}
                strokeWidth={1.8}
                className="shrink-0 text-muted-foreground transition-colors duration-200 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-foreground"
              />
            </span>
          </span>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-balance font-ui text-[16px] font-medium leading-[1.375] text-foreground">{point.title}</h3>
            <p className="max-w-[280px] text-pretty font-ui text-[14px] leading-[1.55] text-muted-foreground lg:max-w-[250px]">{point.body}</p>
          </div>
        </motion.div>
      ))}
    </TileRow>
  );
}
