import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PlatformHeroSection from "@/features/marketing/platform/PlatformHeroSection";
import RedlineDiffSection from "@/features/marketing/platform/RedlineDiffSection";
import RedlineTabsSection from "@/features/marketing/platform/RedlineTabsSection";
import RedlineApprovalsSection from "@/features/marketing/platform/RedlineApprovalsSection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Automated Redlining",
  "Compare any draft against its released master field by field—specs, ISO symbols, and compliance—inside Uprevit with zero manual track-changes.",
  "/platform/redlining",
);

const REDLINING_FAQS: FAQItem[] = [
  {
    id: "baseline-version",
    question: "Which version does Uprevit compare my draft against?",
    answer:
      "Redline mode automatically compares your working draft or in-review version against the live released master so reviewers see the exact delta.",
  },
  {
    id: "sections-included",
    question: "Which product sections are included in automated redlines?",
    answer:
      "All seven structured product tabs are compared automatically—including Product Information, Compliance Standards, Label Components, Symbols & Graphics, Product Specifications, Operational Parameters, and Annotated Label Tags.",
  },
  {
    id: "skip-unchanged",
    question: "How do reviewers avoid scanning unchanged fields?",
    answer:
      "Reviewers can filter directly by Updated, Added, or Removed highlights and jump straight to the tabs with active changes instead of reading untouched specifications line by line.",
  },
  {
    id: "in-review-redlines",
    question: "Can approvers view redlines directly during review?",
    answer:
      "Yes. Live automated redlines sit inside every approval workflow so Regulatory, QA, and Packaging reviewers verify exact changes right alongside threaded comments and sign-offs.",
  },
  {
    id: "no-track-changes",
    question: "Do we need to enable track-changes before making edits?",
    answer:
      "No. Because every label attribute is stored as structured version data, Uprevit computes exact field-level diffs automatically—no Word Track Changes or manual markup required.",
  },
];

export default function PlatformRedliningPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <PlatformHeroSection
          headingId="redlining-hero-heading"
          title="Automated redlines"
          mutedTitle="against your master version"
          description="Compare any working draft against its released master field by field—specs, ISO symbols, and compliance claims—right inside Uprevit with zero manual track-changes."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "redlining-hero-book-demo",
          }}
          secondaryCta={{
            label: "See approval workflows",
            href: "/platform/approval-workflows",
            dataAttr: "redlining-hero-approvals",
          }}
        />
        <TileSpacerRow />
        <RedlineDiffSection />
        <TileSpacerRow />
        <RedlineTabsSection />
        <TileSpacerRow />
        <RedlineApprovalsSection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="How automated in-app redlines compare drafts against your released master."
          faqs={REDLINING_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about automated redlining across your product records."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact"
          contactCtaAttr="redlining-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="Stop diffing labels by hand."
          mutedTitle="Review every change in context."
          description="Walk through automated seven-tab redlining live with one of your own device labeling updates."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "redlining-cta-book-demo",
          }}
          secondaryCta={{
            label: "View pricing",
            href: "/pricing",
            dataAttr: "redlining-cta-view-pricing",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
