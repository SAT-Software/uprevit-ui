"use client";

import { MotionConfig, motion } from "motion/react";
import { TileRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { SingleSignOn } from "@/features/marketing/landing-page/GovernanceSection";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const SSO_PROTOCOLS = ["SAML", "OIDC"];

export default function PricingAddOnsSection() {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="pricing-addons-heading" className="contents">
        <SectionHeader
          id="pricing-addons-heading"
          anchorId="add-ons"
          title="Add-ons."
          mutedTitle="When your team needs more."
        >
          Optional extras on top of your plan, added to your monthly invoice
          only if you turn them on.
        </SectionHeader>

        <TileRow centerClassName="flex flex-col items-stretch justify-between gap-4 overflow-hidden px-6 pt-7 sm:px-8 sm:pt-8 lg:flex-row lg:items-center lg:gap-12 lg:pl-8 lg:pr-0 lg:pt-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="flex flex-col gap-1.5"
          >
            <h3 className="font-sans text-[22px] font-medium leading-7 tracking-[-0.02em] text-foreground sm:text-[24px] sm:leading-[30px]">
              Single sign-on (SSO)
            </h3>
            <p className="max-w-[560px] font-ui text-[14px] leading-[21px] text-muted-foreground sm:text-[15px] sm:leading-[22px]">
              Sign in through your identity provider with SAML or OIDC, so
              access follows your company&apos;s accounts.
            </p>
            <div className="flex w-fit items-center gap-2 pt-3.5">
              {SSO_PROTOCOLS.map((protocol) => (
                <span
                  key={protocol}
                  className="inline-flex h-[30px] items-center rounded-md border border-foreground/[0.09] bg-card px-2.5 font-ui text-body-m leading-[18px] text-foreground dark:border-foreground/[0.09] dark:bg-surface-2"
                >
                  {protocol}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="flex w-full shrink-0 justify-center lg:w-[460px] xl:w-[520px]">
            <div className="w-full max-w-[436px]">
              <SingleSignOn
                reduceMotion={reduceMotion}
                caption="Optional add-on"
              />
            </div>
          </div>
        </TileRow>
      </section>
    </MotionConfig>
  );
}
