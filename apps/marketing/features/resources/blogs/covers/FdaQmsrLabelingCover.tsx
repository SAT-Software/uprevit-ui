"use client";

import * as React from "react";
import { StatusBadge } from "@/features/marketing/landing-page/StatusBadge";

const CONNECTOR_PATHS = [
  "M 197.25 148 C 230 148 230 174 262.75 174",
  "M 197.25 250 C 230 250 230 226 262.75 226",
] as const;

const RIGHT_HALF_PORTS = [
  [194, 148],
  [194, 250],
] as const;

const LEFT_HALF_PORTS = [
  [266, 174],
  [266, 226],
] as const;

const CHECKLIST_ROWS = [
  "UDI, dates & storage checked",
  "Label release recorded",
  "Matched to device file",
] as const;

function SourceTile({
  top,
  icon,
  label,
}: {
  top: number;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      style={{ top }}
      className="absolute left-[84px] flex h-[52px] w-[110px] rounded-[13px] border border-separator bg-file-frame p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-edge-2 dark:bg-surface-3"
    >
      <div className="flex flex-1 items-center justify-center gap-2 rounded-[10px] border border-separator/80 bg-card px-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:border-edge-2 dark:bg-surface-2 dark:shadow-none">
        {icon}
        <span className="font-sans text-[12px] font-semibold leading-4 text-foreground">
          {label}
        </span>
      </div>
    </div>
  );
}

export function FdaQmsrLabelingCover() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      setScale(Math.min(width / 620, height / 400, 1));
    };
    const rect = el.getBoundingClientRect();
    update(rect.width, rect.height);
    const observer = new ResizeObserver(([entry]) => {
      update(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex size-full items-center justify-center overflow-hidden"
    >
      <div
        className="relative h-[400px] w-[620px] shrink-0"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          width="620"
          height="400"
          viewBox="0 0 620 400"
          className="pointer-events-none absolute inset-0 text-foreground"
        >
          <circle
            cx="310"
            cy="200"
            r="158"
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.09}
            strokeWidth={1}
            strokeDasharray="2 5"
          />

          {CONNECTOR_PATHS.map((d) => (
            <path
              key={d}
              d={d}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.22}
              strokeWidth={1.2}
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
          ))}

          {RIGHT_HALF_PORTS.map(([x, y]) => (
            <path
              key={`r-${x}-${y}`}
              d={`M${x} ${y - 3.25}A3.25 3.25 0 0 1 ${x} ${y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/35 dark:fill-surface-2"
            />
          ))}

          {LEFT_HALF_PORTS.map(([x, y]) => (
            <path
              key={`l-${x}-${y}`}
              d={`M${x} ${y - 3.25}A3.25 3.25 0 0 0 ${x} ${y + 3.25}`}
              strokeWidth="1.2"
              className="fill-card stroke-foreground/35 dark:fill-surface-2"
            />
          ))}
        </svg>

        <SourceTile
          top={122}
          label="ISO 13485"
          icon={
            <svg
              width="16"
              height="16"
              viewBox="0 0 28 28"
              fill="none"
              className="shrink-0 text-muted-foreground"
            >
              <circle
                cx="14"
                cy="14"
                r="10.5"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <ellipse
                cx="14"
                cy="14"
                rx="5"
                ry="10.5"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <line
                x1="4"
                y1="14"
                x2="24"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
          }
        />

        <SourceTile
          top={224}
          label="Part 820"
          icon={
            <span className="font-sans text-[11px] font-extrabold tracking-[0.02em] text-muted-foreground">
              FDA
            </span>
          }
        />

        <div className="absolute left-[266px] top-[92px] flex h-[216px] w-[270px] rounded-[18px] border border-border bg-muted p-[5px] shadow-[0_12px_28px_-12px_rgba(0,0,0,0.12)] dark:border-edge-3 dark:bg-surface-3 dark:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.5)]">
          <div className="flex flex-1 flex-col justify-between rounded-[13px] border border-separator bg-card p-4 dark:border-edge-2 dark:bg-surface-2">
            <div className="flex items-center gap-2.5 border-b border-separator pb-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="2.25"
                    y="2.75"
                    width="11.5"
                    height="10.5"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M5 6.25H11M5 9.25H8.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex min-w-0 flex-col gap-px">
                <span className="font-sans text-[13.5px] font-semibold leading-4 text-foreground">
                  FDA QMSR
                </span>
                <span className="font-ui text-[10.5px] leading-[14px] text-muted-foreground">
                  21 CFR 820.45 · Labeling
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {CHECKLIST_ROWS.map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-2 font-ui text-[11.5px] leading-[15px] text-foreground"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-separator bg-muted text-foreground/75 dark:border-edge-2 dark:bg-surface-3">
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2.2 5.2L4.2 7.2L8 3.2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{row}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-separator pt-2.5">
              <StatusBadge tone="released" size="sm">
                Released
              </StatusBadge>
              <span className="font-mono text-[10.5px] leading-[14px] text-muted-foreground tabular-nums">
                Feb 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
