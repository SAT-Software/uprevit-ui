"use client";

import * as React from "react";
import Link from "next/link";
import { MotionConfig, motion, useInView } from "motion/react";
import { ArrowRight02Icon, CustomerSupportIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@uprevit/ui/components/ui/accordion";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SectionHeader } from "./SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const FAQS: { id: string; question: string; answer: string }[] = [
  {
    id: "qms",
    question: "Does Uprevit replace our QMS or document control system?",
    answer:
      "No. Uprevit manages label content, versions and internal reviews. Formal release and sign-off stay in your QMS, so export released versions to PDF and file them in your document control system.",
  },
  {
    id: "electronic-signatures",
    question: "Are approvals in Uprevit electronic signatures?",
    answer:
      "No. Workflow approvals are an internal review record with names, functions and timestamps. They are not legally binding electronic signatures and do not replace formal QMS sign-off.",
  },
  {
    id: "regulations",
    question: "Which regulations does the label documentation cover?",
    answer:
      "Label records are structured around EU MDR 2017/745, FDA 21 CFR 801 and UDI, ISO 15223-1 and ISO 20417 symbols and label information, Health Canada MDR, and UK MDR 2002 / UKCA.",
  },
  {
    id: "integrations",
    question: "Can Uprevit connect to our ERP, PLM or MES?",
    answer:
      "Uprevit imports product data from Excel and CSV and exports controlled PDF and Excel packages you can file or load into your ERP, PLM or MES. Reach out to our team if you need a dedicated integration.",
  },
  {
    id: "ask-ai",
    question: "Can Ask AI see our product data?",
    answer:
      "No. Ask AI only reads the Uprevit documentation to answer how-to questions. It has no access to your workspace, products, source files, approval workflows, exports or user accounts.",
  },
  {
    id: "get-started",
    question: "How do we get started?",
    answer:
      "Book a demo with our team and we will set up your workspace, help import your existing product spreadsheets, and walk your regulatory, quality and packaging teams through their first review cycle.",
  },
];

const STATIC_RINGS = [
  { size: 96, borderClass: "border-foreground/25 opacity-25" },
  { size: 112, borderClass: "border-foreground/15 opacity-20" },
  { size: 128, borderClass: "border-border opacity-15 dark:border-foreground/10" },
];

const PULSE_OFFSETS = ["0s", "-1.2s", "-2.4s"];

function ContactEmblem({ reduceMotion }: { reduceMotion: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative -mx-6 flex h-[140px] shrink-0 items-center justify-center overflow-hidden sm:-mx-10"
    >
      <span className="absolute inset-x-0 top-1/2 h-0 -translate-y-1/2 border-t border-dashed border-foreground/[0.14] dark:border-file-line" />
      <span className="absolute left-1/2 top-1/2 size-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-stroke-strong dark:border-edge-3" />

      <div className="relative flex size-[176px] shrink-0 items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          {reduceMotion
            ? STATIC_RINGS.map((ring) => (
                <span
                  key={ring.size}
                  className={`absolute rounded-full border-[1.6px] border-solid ${ring.borderClass}`}
                  style={{ width: ring.size, height: ring.size }}
                />
              ))
            : PULSE_OFFSETS.map((delay) => (
                <span
                  key={delay}
                  className="faq-pulse-ring absolute size-[68px] rounded-full border border-foreground/45 dark:border-foreground/40"
                  style={{
                    animationDelay: delay,
                    animationPlayState: inView ? "running" : "paused",
                  }}
                />
              ))}
        </div>

        <div className="relative flex size-[68px] shrink-0 items-center justify-center rounded-full border border-file-frame bg-card shadow-[0_0_0_3px_#F5F5F5,0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] dark:border-edge-2 dark:bg-surface-2 dark:shadow-[0_0_0_3px_#1A1A1A,0_1px_3px_rgba(0,0,0,0.35)]">
          <Icon
            icon={CustomerSupportIcon}
            size={28}
            strokeWidth={1.5}
            className="text-foreground"
          />
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-1.5 font-ui text-[12px] font-semibold leading-4 text-subtle shadow-[0_0_0_2px_#FFFFFF,0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] dark:text-surface-0 dark:shadow-[0_0_0_2px_#141414,0_4px_6px_-1px_rgba(0,0,0,0.4)]">
            3
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="faq-heading" className="contents">
        <SectionHeader
          id="faq-heading"
          anchorId="faq"
          title="Frequently asked"
          mutedTitle="questions."
        >
          What regulatory, quality and IT teams usually ask before moving their
          label documentation into Uprevit.
        </SectionHeader>

        <TileRow
          splitCenter
          centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[436px_minmax(0,1fr)]"
        >
          <div className="order-2 flex min-w-0 flex-row items-center justify-between gap-4 rounded-tile bg-tile p-5 sm:px-8 sm:py-6 lg:order-1 lg:flex-col lg:items-stretch lg:justify-between lg:gap-10 lg:p-10">
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <h3 className="font-ui text-[14px] font-medium leading-5 text-foreground lg:text-[16px] lg:leading-[22px]">
                Still have questions?
              </h3>
              <p className="max-w-[320px] font-ui text-[13px] leading-[19px] text-muted-foreground lg:text-[14px] lg:leading-[22px]">
                Talk to our team about your products, markets and review
                process.
              </p>
            </div>

            <div className="hidden lg:block">
              <ContactEmblem reduceMotion={reduceMotion} />
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/contact"
                data-attr="faq-contact-us"
                className="group/cta inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-card px-3.5 font-ui text-[14px] font-medium leading-[18px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.08)] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out hover:border-stroke-strong hover:bg-subtle focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] lg:h-10 lg:rounded-sm lg:border-primary-700 lg:bg-primary lg:bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(0,0,0,0.04)_100%)] lg:px-4 lg:text-primary-foreground lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(106,18,220,0.25)] lg:hover:border-primary-700 lg:hover:bg-[#8A33FF] lg:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_8px_20px_-6px_rgba(127,34,254,0.6)] lg:active:bg-primary-700 dark:border-edge-2 dark:bg-surface-2 dark:hover:bg-surface-3 dark:lg:border-primary-700 dark:lg:bg-primary dark:lg:hover:bg-primary-hover"
              >
                <span>Contact us</span>
                <Icon
                  icon={ArrowRight02Icon}
                  size={14}
                  strokeWidth={1.8}
                  className="hidden transition-transform duration-150 ease-out lg:inline-block [@media(hover:hover)_and_(pointer:fine)]:group-hover/cta:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="order-1 flex min-w-0 flex-col rounded-tile bg-tile px-5 py-2 sm:px-8 sm:py-5 lg:order-2 lg:px-10 lg:py-6"
          >
            <Accordion
              type="single"
              collapsible
              defaultValue={FAQS[0].id}
              className="w-full"
            >
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-separator last:border-b-0 dark:border-edge-1"
                >
                  <AccordionTrigger className="cursor-pointer items-center gap-4 rounded-none py-4.5 font-ui text-[15px] font-medium leading-[22px] text-foreground hover:no-underline sm:gap-6 sm:py-5 sm:text-[16px] sm:leading-6 [&>svg]:size-[18px] [&>svg]:translate-y-0 [&>svg]:text-icon [&[data-state=open]>svg]:text-foreground">
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-ui text-[14px] leading-[21px] text-muted-foreground lg:min-h-[86px] lg:leading-[22px]">
                    <p className="max-w-prose">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
