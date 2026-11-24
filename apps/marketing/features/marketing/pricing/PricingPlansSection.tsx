"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { TileRow } from "@/components/TileGrid";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const PRICE_PARTS: StepItem[] = [
  {
    number: "1",
    title: "Platform fee",
    description: "A fixed fee each billing cycle for your workspace.",
  },
  {
    number: "2",
    title: "Seats",
    description: "Full seats for builders, lower-priced for approvers.",
  },
  {
    number: "3",
    title: "Usage",
    description: "Stored files billed monthly and metered exports.",
  },
];

const QUOTE_STEPS: StepItem[] = [
  {
    number: "1",
    title: "Tell us about your team",
    description: "How many Admins, Users and Approvers.",
  },
  {
    number: "2",
    title: "Size your usage",
    description: "Expected stored files and exports each month.",
  },
  {
    number: "3",
    title: "Get your quote and workspace",
    description: "One clear monthly price, then we set you up.",
  },
];

const PLAN_INCLUDES = [
  "Workspace platform included",
  "Audit-ready change history",
  "Regulatory templates and symbol library",
  "Product and report exports",
];

function StepColumn({
  eyebrow,
  steps,
  className,
  delay = 0,
}: {
  eyebrow: string;
  steps: StepItem[];
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: EASE_OUT, delay }}
      className={`flex min-w-0 flex-col justify-between gap-7 rounded-tile bg-tile px-6 py-7 sm:gap-8 sm:px-8 sm:pb-8 sm:pt-10 ${className ?? ""}`}
    >
      <div className="font-ui text-label font-medium uppercase leading-4 tracking-label text-faint-foreground">
        {eyebrow}
      </div>

      <ol className="flex flex-col">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <li key={step.number} className="flex gap-3.5">
              <div className="flex w-6 shrink-0 flex-col items-center">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-stroke-strong bg-card font-mono text-caption leading-[14px] text-muted-foreground dark:border-edge-3 dark:bg-surface-2">
                  {step.number}
                </span>
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="hidden min-h-11 w-px flex-1 bg-border sm:block dark:bg-edge-3"
                  />
                )}
              </div>
              <div
                className={`flex min-w-0 flex-col gap-0.5 pt-0.5 ${!isLast ? "pb-5 sm:pb-4" : ""}`}
              >
                <div className="font-ui text-[15px] font-medium leading-[22px] text-foreground/80">
                  {step.title}
                </div>
                <p className="font-ui text-body-s leading-[19px] text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export default function PricingPlansSection() {
  return (
    <MotionConfig reducedMotion="user">
      <TileRow
        as="section"
        id="whats-included"
        aria-label="Pricing structure and plan details"
        className="scroll-mt-14"
        splitCenter
        centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[minmax(0,1fr)_420px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_460px_minmax(0,1fr)]"
      >
        <StepColumn
          eyebrow="Your price, in three parts"
          steps={PRICE_PARTS}
          className="order-2 lg:order-1"
          delay={0.04}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
          className="order-1 flex min-w-0 flex-col gap-7 rounded-tile bg-card p-6 shadow-[inset_0_0_0_1px_var(--border),0_4px_16px_rgba(0,0,0,0.04)] sm:p-8 lg:order-2 dark:bg-surface-2 dark:shadow-[inset_0_0_0_1px_var(--edge-3),0_4px_16px_rgba(0,0,0,0.4)]"
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground">
              Uprevit
            </h2>
            <p className="font-ui text-body-m leading-5 text-muted-foreground">
              One plan for regulated documentation teams: a monthly platform
              fee, role-based seats, and transparent storage and export usage.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-[44px] font-medium leading-[48px] tracking-display text-foreground sm:text-[48px] sm:leading-[52px]">
                Custom
              </span>
              <span className="font-ui text-[15px] leading-5 text-muted-foreground">
                pricing
              </span>
            </div>
            <p className="font-ui text-body-s leading-[18px] text-muted-foreground">
              Quoted for your team, billed monthly
            </p>
          </div>

          <Link
            href="/contact?topic=pricing"
            data-attr="pricing-talk-to-us"
            className="inline-flex h-[42px] w-full shrink-0 items-center justify-center rounded-lg border border-primary-700 bg-primary bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] px-4 font-ui text-[15px] font-medium leading-[18px] text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] outline-none transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-[#8A33FF] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] active:bg-primary-700 dark:hover:bg-primary-hover"
          >
            Talk to us
          </Link>

          <div className="flex flex-col gap-3 border-t border-separator pt-6 dark:border-edge-1">
            <div className="font-ui text-label font-medium uppercase leading-4 tracking-label text-faint-foreground">
              Includes
            </div>
            <ul className="flex flex-col gap-3">
              {PLAN_INCLUDES.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Icon
                    icon={Tick02Icon}
                    size={16}
                    strokeWidth={2.2}
                    className="shrink-0 text-primary dark:text-primary-400"
                  />
                  <span className="font-ui text-body-m leading-5 text-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <StepColumn
          eyebrow="Getting your quote"
          steps={QUOTE_STEPS}
          className="order-3"
          delay={0.08}
        />
      </TileRow>
    </MotionConfig>
  );
}
