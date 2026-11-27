"use client";

import { MotionConfig, motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const USAGE_CARDS = [
  {
    eyebrow: "Stored files",
    tag: "Monthly",
    description:
      "Source files, artwork and attachments kept in your workspace. Measured once on your billing date.",
    rows: [
      { label: "Billed by", value: "Per GB / month" },
      { label: "Uploads & viewing", value: "No extra fee" },
    ],
  },
  {
    eyebrow: "Exports",
    tag: "Metered",
    description:
      "Each completed PDF or XLSX product dossier or report export. Pay only when you generate them.",
    rows: [
      { label: "Billed by", value: "Per export" },
      { label: "Quiet months", value: "No charge" },
    ],
  },
  {
    eyebrow: "Role-based seats",
    tag: "Per role",
    description:
      "Not everyone needs a full seat. Approvers cost half a User seat; billing-only Managers are free.",
    rows: [
      { label: "Approver", value: "Half price" },
      { label: "Manager", value: "Free" },
    ],
  },
];

export default function PricingUsageSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="pricing-usage-heading" className="contents">
        <SectionHeader
          id="pricing-usage-heading"
          anchorId="usage"
          title="Pay for what you use."
          mutedTitle="Nothing bundled in."
        >
          Storage, exports and seats are billed transparently each month — no
          free caps to track and no tiers to outgrow.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-3"
        >
          {USAGE_CARDS.map((card, index) => (
            <motion.article
              key={card.eyebrow}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: EASE_OUT, delay: index * 0.05 }}
              className="flex min-w-0 flex-col justify-between gap-8 rounded-tile bg-tile px-5 py-6 sm:gap-10 sm:p-8 lg:p-10"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-ui text-label font-medium uppercase leading-4 tracking-label text-faint-foreground">
                    {card.eyebrow}
                  </h3>
                  <span className="inline-flex shrink-0 items-center rounded-sm border border-stroke-primary bg-muted px-2 py-[3px] font-mono text-caption uppercase leading-[14px] text-muted-foreground dark:border-edge-2 dark:bg-surface-2">
                    {card.tag}
                  </span>
                </div>
                <p className="text-pretty font-ui text-[14px] leading-[21px] text-muted-foreground sm:text-[15px] sm:leading-[22px]">
                  {card.description}
                </p>
              </div>

              <dl className="flex flex-col gap-3.5">
                {card.rows.map((row, rowIndex) => (
                  <div
                    key={row.label}
                    className={`flex items-baseline justify-between gap-4 ${
                      rowIndex < card.rows.length - 1
                        ? "border-b border-separator pb-3.5 dark:border-edge-1"
                        : ""
                    }`}
                  >
                    <dt className="font-ui text-body-m leading-5 text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-right font-sans text-[19px] font-medium leading-7 tracking-[-0.02em] text-foreground tabular-nums sm:text-[21px] lg:text-[18px] xl:text-[21px]">
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
