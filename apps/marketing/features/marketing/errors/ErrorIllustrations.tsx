import type { CSSProperties, ReactNode } from "react";
import {
  FileQuestionMarkIcon,
  MousePointerClickIcon,
  ServerCrashIcon,
  ServerStack01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

const NODE_RING =
  "size-[52px] shrink-0 rounded-[14px] border border-foreground/5 bg-frame-surface p-[3px] dark:border-separator";
const NODE_CARD =
  "flex size-full items-center justify-center rounded-[11px] bg-card shadow-[0_0_0_1px_var(--stroke-primary),0_1px_2px_rgba(0,0,0,0.05)] dark:bg-surface-2 dark:shadow-[0_0_0_1px_var(--edge-2)]";
const DASHED_LINE = "fill-none stroke-foreground/20";
const PORT = "fill-card dark:fill-surface-2";

function vars(values: Record<string, string>) {
  return values as CSSProperties;
}

function IllustrationFrame({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="hero-enter-float relative h-[120px] w-full sm:h-[200px]"
      style={vars({ "--hero-duration": "480ms" })}
    >
      <div className="absolute left-1/2 top-1/2 flex h-[200px] w-[536px] -translate-x-1/2 -translate-y-1/2 scale-[0.6] items-center px-10 sm:scale-100">
        {children}
      </div>
    </div>
  );
}

function VisitorNode() {
  return (
    <div className={NODE_RING}>
      <div className={cn(NODE_CARD, "bg-foreground text-background dark:bg-foreground")}>
        <Icon icon={MousePointerClickIcon} size={18} strokeWidth={1.6} />
      </div>
    </div>
  );
}

function StatusCode({ code, className }: { code: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative w-28 shrink-0 text-center font-ui text-[60px] font-semibold leading-none tracking-[-0.03em] text-foreground tabular-nums",
        className,
      )}
    >
      {code}
    </span>
  );
}

function RequestDot({ className, style }: { className: string; style: CSSProperties }) {
  return (
    <span
      className={cn("absolute top-[calc(50%-4.5px)] flex size-[9px] items-center justify-center", className)}
      style={style}
    >
      <span className="absolute inset-0 rounded-full bg-current opacity-15" />
      <span className="size-1 rounded-full bg-current" />
    </span>
  );
}

function RequestLine() {
  return (
    <svg viewBox="0 0 120 12" className="absolute inset-0 size-full overflow-visible">
      <path d="M3.25 6H117" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 4" className={DASHED_LINE} />
      <path d="M0 2.75A3.25 3.25 0 0 1 0 9.25" strokeWidth="1.2" className={cn(PORT, "stroke-foreground/40")} />
    </svg>
  );
}

export function NotFoundIllustration() {
  return (
    <IllustrationFrame>
      <VisitorNode />

      <div className="relative h-3 w-30 shrink-0">
        <RequestLine />
        <RequestDot
          className="error-loop-404 error-404-dot text-foreground"
          style={vars({ left: "115.5px", "--error-from": "-114px" })}
        />
        <span className="error-loop-404 error-404-wall absolute -top-[58px] right-0 h-32 w-px bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--destructive)_70%,transparent)_50%,transparent_100%)]" />
        {[
          { size: "-top-[42px] h-24 w-12", peak: "0.45", delay: "600ms" },
          { size: "-top-[50px] h-28 w-14", peak: "0.25", delay: "680ms" },
          { size: "-top-[58px] h-32 w-16", peak: "0.12", delay: "780ms" },
        ].map((ripple) => (
          <span
            key={ripple.delay}
            className={cn(
              "error-loop-404 error-404-ripple absolute right-0 origin-right rounded-l-full border border-r-0 border-destructive opacity-(--error-peak)",
              ripple.size,
            )}
            style={vars({ "--error-peak": ripple.peak, "--error-delay": ripple.delay })}
          />
        ))}
      </div>

      <StatusCode code="404" className="error-loop-404 error-404-knock" />

      <svg viewBox="0 0 120 12" className="h-3 w-30 shrink-0 overflow-visible">
        <path d="M2 6H116.75" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 4" className="fill-none stroke-foreground/12" />
        <path d="M120 2.75A3.25 3.25 0 0 0 120 9.25" strokeWidth="1.2" className={cn(PORT, "stroke-foreground/25")} />
      </svg>

      <div className={cn(NODE_RING, "border-dashed border-foreground/20 bg-frame-surface/40 dark:border-edge-3")}>
        <div className="flex size-full items-center justify-center rounded-[11px] border border-dashed border-foreground/15 bg-card/60 text-foreground/40 dark:bg-surface-2/60">
          <Icon icon={FileQuestionMarkIcon} size={18} strokeWidth={1.6} />
        </div>
      </div>
    </IllustrationFrame>
  );
}

export function ServerErrorIllustration() {
  return (
    <IllustrationFrame>
      <RequestDot
        className="error-loop-500 error-500-dot text-destructive"
        style={vars({ left: "433.5px" })}
      />

      <VisitorNode />

      <div className="relative h-3 w-30 shrink-0">
        <RequestLine />
      </div>

      <StatusCode code="500" className="bg-[var(--tile-surface-solid)]" />

      <svg viewBox="0 0 120 12" className="h-3 w-30 shrink-0 overflow-visible">
        <path d="M2 6H50" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 4" className={DASHED_LINE} />
        <path d="M52 6L56 1.5L59 10" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="fill-none stroke-foreground/40" />
        <path d="M64 2L67 10.5L71 6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="fill-none stroke-destructive/60" />
        <path d="M74 6H116.75" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="3 4" className="fill-none stroke-destructive/40" />
        <path d="M120 2.75A3.25 3.25 0 0 0 120 9.25" strokeWidth="1.2" className={cn(PORT, "stroke-destructive/60")} />
      </svg>

      <div className="error-loop-500 error-500-shake relative size-[52px] shrink-0">
        {[
          { size: "-inset-[14px]", peak: "0.3", start: "0.65", delay: "600ms" },
          { size: "-inset-[30px]", peak: "0.14", start: "0.46", delay: "760ms" },
        ].map((pulse) => (
          <span
            key={pulse.delay}
            className={cn(
              "error-loop-500 error-500-pulse absolute rounded-full border border-destructive opacity-(--error-peak)",
              pulse.size,
            )}
            style={vars({ "--error-peak": pulse.peak, "--error-start": pulse.start, "--error-delay": pulse.delay })}
          />
        ))}
        <div className={cn(NODE_RING, "absolute inset-0")}>
          <div className={cn(NODE_CARD, "text-foreground")}>
            <Icon icon={ServerStack01Icon} size={18} strokeWidth={1.6} />
          </div>
        </div>
        <div className={cn(NODE_RING, "error-loop-500 error-500-crashed absolute inset-0 border-destructive/12 bg-destructive-soft/75")}>
          <div className={cn(NODE_CARD, "text-destructive shadow-[0_0_0_1px_color-mix(in_srgb,var(--destructive)_18%,transparent),0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_color-mix(in_srgb,var(--destructive)_24%,transparent)]")}>
            <Icon icon={ServerCrashIcon} size={18} strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </IllustrationFrame>
  );
}
