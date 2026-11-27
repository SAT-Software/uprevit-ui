"use client";

import { MotionConfig, motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const NEXT_STEPS = [
  {
    title: "A personal reply",
    description:
      "Someone from the team reads your note and replies personally, not a sequence.",
    rows: [
      { label: "First reply", value: "2–3 business days" },
      { label: "From", value: "A real person" },
    ],
  },
  {
    title: "A live walkthrough",
    description:
      "We show Uprevit on a product like yours: drafts, review, redlines and release.",
    rows: [
      { label: "Call", value: "30 minutes" },
      { label: "Prep", value: "Nothing needed" },
    ],
  },
  {
    title: "Your workspace, set up",
    description:
      "We set up your workspace and invite your reviewers. Bring existing products in with our import template.",
    rows: [
      { label: "Setup", value: "Within a week" },
      { label: "Import", value: "Bulk, from a template" },
    ],
  },
];

export default function ContactNextStepsSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="contact-next-heading" className="contents">
        <SectionHeader
          id="contact-next-heading"
          anchorId="what-happens-next"
          title="What happens next."
          mutedTitle="No sales maze."
        >
          One person owns your request from first reply to a working workspace.
          Most teams go from note to first label in under two weeks.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-3"
        >
          {NEXT_STEPS.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.05 }}
              className="flex min-w-0 flex-col justify-between gap-8 rounded-tile bg-tile px-5 py-6 sm:gap-10 sm:p-8 lg:p-10"
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="font-ui text-[16px] font-medium leading-[22px] text-foreground">
                  {step.title}
                </h3>
                <p className="text-pretty font-ui text-[14px] leading-[21px] text-muted-foreground sm:text-[15px] sm:leading-[22px]">
                  {step.description}
                </p>
              </div>

              <dl className="flex flex-col gap-3.5">
                {step.rows.map((row, rowIndex) => (
                  <div
                    key={row.label}
                    className={`flex items-baseline justify-between gap-4 ${
                      rowIndex < step.rows.length - 1
                        ? "border-b border-separator pb-3.5 dark:border-edge-1"
                        : ""
                    }`}
                  >
                    <dt className="font-ui text-body-m leading-5 text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-right font-sans text-[20px] font-medium leading-7 tracking-[-0.02em] text-foreground tabular-nums sm:text-[22px] lg:text-[18px] xl:text-[22px]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.article>
          ))}
        </TileRow>
      </section>
    </MotionConfig>
  );
}
