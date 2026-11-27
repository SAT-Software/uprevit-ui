"use client";

import { MotionConfig } from "motion/react";
import {
  SecurityCheckIcon,
  SquareLock02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { SectionHeader } from "@/features/marketing/landing-page/SectionHeader";
import { SectionPoints, type SectionPoint } from "@/features/marketing/landing-page/SectionPoints";

const GUARDRAILS: SectionPoint[] = [
  {
    title: "Protected during review",
    body: "Active approval workflows guard records under review and alert approvers immediately if any tracked change occurs.",
    icon: SecurityCheckIcon,
  },
  {
    title: "Immutable released masters",
    body: "Once a version reaches Released, every field, symbol, spec cell, and label tag stays permanently read-only.",
    icon: SquareLock02Icon,
  },
  {
    title: "Clean supersession on release",
    body: "Releasing v4 automatically transitions v3 to Obsolete with timestamped attribution and full audit history.",
    icon: Tick02Icon,
  },
];

export default function VersionGuardrailsSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="version-guardrails-heading" className="contents">
        <SectionHeader
          id="version-guardrails-heading"
          anchorId="guardrails"
          title="Guardrails enforced"
          mutedTitle="by the platform."
        >
          Version integrity is built into every action—no shared-drive naming
          conventions or manual lock spreadsheets required.
        </SectionHeader>

        <SectionPoints points={GUARDRAILS} />
      </section>
    </MotionConfig>
  );
}
