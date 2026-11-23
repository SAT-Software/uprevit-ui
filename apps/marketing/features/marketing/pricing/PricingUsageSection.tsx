"use client";

import { MotionConfig, motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const USAGE_CARDS = [
  {
    eyebrow: "Uploads",
    description:
      "Source files, artwork and attachments committed to the workspace.",
    rows: [
      { label: "Included", value: "10 GB / month" },
      { label: "Beyond that", value: "Metered add-on" },
    ],
  },
  {
    eyebrow: "Exports",
    description: "Each completed PDF or XLSX product or report export.",
    rows: [
      { label: "Included", value: "50 / month" },
      { label: "Beyond that", value: "Metered add-on" },
    ],
  },
  {
    eyebrow: "Other seats",
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
          anchorId="allowances"
          title="Generous allowances."
          mutedTitle="Usage only past them."
        >
          Every workspace includes uploads and exports each month. Past that,
          usage is metered as a transparent add-on. No tiers to outgrow.
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
              className="flex min-w-0 flex-col justify-between gap-8 rounded-tile bg-tile p-6 sm:gap-10 sm:p-8"
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="font-ui text-label font-medium uppercase leading-4 tracking-label text-faint-foreground">
                  {card.eyebrow}
                </h3>
                <p className="font-ui text-[14px] leading-[21px] text-muted-foreground sm:text-[15px] sm:leading-[22px]">
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
                    <dd className="text-right font-sans text-[20px] font-medium leading-7 tracking-[-0.02em] text-foreground sm:text-[22px] lg:text-[18px] xl:text-[22px]">
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
