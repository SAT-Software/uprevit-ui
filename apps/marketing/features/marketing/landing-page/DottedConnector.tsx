"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function DottedConnector({
  d,
  active,
  canvasWidth,
  canvasHeight,
  transition,
  baseOpacity = 0.22,
  activeOpacity = 0.82,
  strokeWidth = 1.2,
  dashArray = "3 4",
}: {
  d: string;
  active: boolean;
  canvasWidth: number;
  canvasHeight: number;
  transition: Transition;
  baseOpacity?: number;
  activeOpacity?: number;
  strokeWidth?: number;
  dashArray?: string;
}) {
  const rawId = React.useId();
  const maskId = `dotted-connector-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reduceMotion = usePrefersReducedMotion();

  return (
    <>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity={baseOpacity}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
      />
      <mask
        id={maskId}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
      >
        <motion.path
          d={d}
          fill="none"
          stroke="#fff"
          strokeWidth={strokeWidth + 6}
          initial={false}
          animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : active
                ? {
                    pathLength: transition,
                    opacity: {
                      duration: 0.05,
                      delay: typeof transition === "object" && "delay" in transition ? transition.delay : 0,
                    },
                  }
                : {
                    pathLength: transition,
                    opacity: { duration: 0.22 },
                  }
          }
        />
      </mask>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity={activeOpacity}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
        mask={`url(#${maskId})`}
      />
    </>
  );
}
