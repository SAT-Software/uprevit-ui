"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { TileSpacerRow } from "@/components/TileGrid";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import ContactHeroSection from "./ContactHeroSection";
import ContactNextStepsSection from "./ContactNextStepsSection";
import type { ContactTopicId } from "./ContactNoteRouting";

const VALID_TOPICS = new Set<ContactTopicId>([
  "demo",
  "pricing",
  "security",
  "support",
]);

const CONTACT_FAQS: FAQItem[] = [
  {
    id: "book-demo-to-try",
    question: "Do I need to book a demo to try Uprevit?",
    answer:
      "No, but most teams find it faster. On the call we set up a workspace with one of your own labels, so you leave with something real instead of a sandbox.",
  },
  {
    id: "who-talking-to",
    question: "Who will I be talking to?",
    answer:
      "You will speak directly with the product and regulatory team building Uprevit—not a scripted sales queue. The same person stays with you from first reply through workspace setup.",
  },
  {
    id: "move-existing-labels",
    question: "Can you help move our existing labels in?",
    answer:
      "Yes. Bring an existing product spreadsheet or CSV and we will map it into our import template, validate the fields with you, and load your first products together.",
  },
  {
    id: "security-questionnaire",
    question: "Can you complete our vendor security questionnaire?",
    answer:
      "Yes. Select Security review in the form above or send your questionnaire directly to contact@uprevit.com and we will share our security overview and complete your review package.",
  },
  {
    id: "outside-us-eu",
    question: "Do you work with teams outside the US and EU?",
    answer:
      "Yes. Uprevit supports medical device teams across North America, the EU, the UK and APAC, with label documentation structured around FDA UDI, EU MDR, ISO 15223-1, Health Canada and UKCA.",
  },
  {
    id: "existing-customer-help",
    question: "I'm already a customer. Where do I get help?",
    answer:
      "Select Support in the form above or email contact@uprevit.com from your workspace address. You can also reach support directly from the Help section inside your Uprevit workspace.",
  },
];

function ContactTopicSync({
  onTopic,
}: {
  onTopic: (topic: ContactTopicId) => void;
}) {
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const param = searchParams.get("topic");
    if (param && VALID_TOPICS.has(param as ContactTopicId)) {
      onTopic(param as ContactTopicId);
    }
  }, [searchParams, onTopic]);

  return null;
}

export default function ContactPageContent() {
  const reduceMotion = usePrefersReducedMotion();
  const [selectedTopic, setSelectedTopic] =
    React.useState<ContactTopicId>("demo");

  const handleBookDemoClick = React.useCallback(() => {
    setSelectedTopic("demo");
    const target = document.getElementById("contact-form");
    if (target) {
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [reduceMotion]);

  return (
    <>
      <React.Suspense fallback={null}>
        <ContactTopicSync onTopic={setSelectedTopic} />
      </React.Suspense>
      <ContactHeroSection
        selectedTopic={selectedTopic}
        onSelectTopic={setSelectedTopic}
      />
      <TileSpacerRow />
      <ContactNextStepsSection />
      <TileSpacerRow />
      <FAQSection
        title="Before you"
        mutedTitle="reach out."
        description="Quick answers about demos, onboarding and what we need from you."
        faqs={CONTACT_FAQS}
        contactTitle="Prefer email?"
        contactBody="Write to us directly at contact@uprevit.com and we'll route it to the right person."
        contactCtaLabel="Email us"
        contactCtaHref="mailto:contact@uprevit.com"
        contactCtaAttr="contact-faq-email-us"
        showCtaArrow={false}
      />
      <TileSpacerRow />
      <CTASection
        title="See your own labels"
        mutedTitle="in Uprevit."
        description="Bring one product. We'll set it up live, run it through review and export the release on the call."
        primaryCta={{
          label: "Book a demo",
          href: "#contact-form",
          dataAttr: "contact-cta-book-demo",
        }}
        secondaryCta={{
          label: "View pricing",
          href: "/pricing",
          dataAttr: "contact-cta-view-pricing",
        }}
        onPrimaryClick={handleBookDemoClick}
      />
    </>
  );
}
