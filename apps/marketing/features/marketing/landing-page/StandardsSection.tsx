"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";

const STANDARDS = [
  {
    logo: "/images/standards/eu-ce.svg",
    alt: "CE mark",
    width: 50,
    height: 36,
    title: "EU MDR 2017/745",
    body: "Annex I §23 label content and EU REP details, versioned per pack.",
  },
  {
    logo: "/images/standards/fda.svg",
    alt: "U.S. Food & Drug Administration",
    width: 168,
    height: 36,
    title: "FDA 21 CFR 801 · UDI",
    body: "UDI and US label content, kept with every approved release.",
  },
  {
    logo: "/images/standards/iso.svg",
    alt: "ISO",
    width: 45,
    height: 48,
    title: "ISO 15223-1 · ISO 20417",
    body: "Symbols and required label information in one shared library.",
  },
  {
    logo: "/images/standards/health-canada.svg",
    alt: "Health Canada",
    width: 170,
    height: 23,
    title: "Health Canada MDR",
    body: "English and French label text, reviewed together as one record.",
  },
  {
    logo: "/images/standards/ukca.svg",
    alt: "UKCA mark",
    width: 44,
    height: 44,
    title: "UK MDR 2002 · UKCA",
    body: "UKCA mark and UK Responsible Person details, per market.",
  },
];

export default function StandardsSection() {
  return (
    <MotionConfig reducedMotion="user">
    <section aria-labelledby="standards-heading" className="contents">
      <TileRow centerClassName="flex items-center justify-center px-5 py-[18px] sm:px-8 sm:py-5 lg:px-10">
        <h2
          id="standards-heading"
          className="max-w-[260px] text-balance text-center font-ui text-[14px] font-medium leading-5 text-muted-foreground sm:max-w-none"
        >
          Built around the standards your labels answer to
        </h2>
      </TileRow>

      <TileRow
        splitCenter
        centerClassName="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-5"
      >
        {STANDARDS.map((standard, index) => (
          <motion.div
            key={standard.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.45,
              ease: [0.23, 1, 0.32, 1],
              delay: index * 0.06,
            }}
            className={`group flex flex-row items-center gap-4 rounded-tile bg-tile px-5 py-5 sm:flex-col sm:items-start sm:gap-5 sm:px-8 sm:py-7 lg:px-6 lg:pb-9 lg:pt-8 xl:px-8 ${
              index === STANDARDS.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="flex h-12 w-[88px] shrink-0 items-center justify-center sm:h-14 sm:w-auto sm:justify-start">
              <Image
                src={standard.logo}
                alt={standard.alt}
                width={standard.width}
                height={standard.height}
                unoptimized
                style={
                  {
                    "--logo-w": `${standard.width}px`,
                    "--logo-h": `${standard.height}px`,
                  } as React.CSSProperties
                }
                className="h-auto max-h-9 w-auto max-w-full object-contain opacity-[0.72] [filter:grayscale(1)_contrast(1.6)] transition-[filter,opacity] duration-200 ease-out sm:h-[var(--logo-h)] sm:max-h-none sm:w-[var(--logo-w)] sm:max-w-none dark:[filter:grayscale(1)_contrast(1.6)_invert(1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover:[filter:grayscale(1)_contrast(12)] dark:[@media(hover:hover)_and_(pointer:fine)]:group-hover:[filter:grayscale(1)_contrast(12)_invert(1)]"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <h3 className="font-ui text-[14px] font-medium leading-[18px] text-foreground">
                {standard.title}
              </h3>
              <p className="font-ui text-[13px] leading-[19px] text-muted-foreground">
                {standard.body}
              </p>
            </div>
          </motion.div>
        ))}
      </TileRow>
    </section>
    </MotionConfig>
  );
}
