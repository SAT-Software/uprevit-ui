import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PlatformHeroSection from "@/features/marketing/platform/PlatformHeroSection";
import VersionStatesSection from "@/features/marketing/platform/VersionStatesSection";
import VersionCloneSection from "@/features/marketing/platform/VersionCloneSection";
import VersionTimelineSection from "@/features/marketing/platform/VersionTimelineSection";
import VersionGuardrailsSection from "@/features/marketing/platform/VersionGuardrailsSection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Version Control",
  "Manage drafts, active reviews, immutable live releases, and obsolete medical device labeling records in one timeline—so your team never ships from an outdated file.",
  "/platform/version-control",
);

const VERSION_FAQS: FAQItem[] = [
  {
    id: "immutable",
    question: "Can anyone edit a Released or Obsolete version?",
    answer:
      "No. Released and Obsolete versions are permanently read-only across all seven tabs, symbols, specs, and label tags.",
  },
  {
    id: "clone-draft",
    question: "How do we start a revision without disrupting live production?",
    answer:
      "Select New Version on any Released master to clone all seven tabs, symbols, specs, and label tags into a fresh Draft revision while the live master stays untouched and locked.",
  },
  {
    id: "supersession",
    question: "What happens to the previous live version when a new one releases?",
    answer:
      "Releasing a new approved revision automatically transitions the previous master to Obsolete with timestamped attribution, preserving the entire supersession chain for QMS audits.",
  },
  {
    id: "auditors",
    question: "Can auditors inspect historical obsolete versions?",
    answer:
      "Yes. Open the product version timeline to jump into any prior release in instant read-only mode, review its exact seven-tab content, or export a PDF dossier.",
  },
  {
    id: "review-guard",
    question: "How are drafts protected while under active review?",
    answer:
      "Active approval workflows guard records in review—preventing silent edits and immediately alerting assigned approvers if any tracked field changes before sign-off.",
  },
];

export default function PlatformVersionControlPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <PlatformHeroSection
          headingId="version-hero-heading"
          title="Every label version"
          mutedTitle="tracked from draft to release"
          description="Manage drafts, active reviews, live releases, and obsolete records in one timeline—so your team never ships from an outdated file."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "version-hero-book-demo",
          }}
          secondaryCta={{
            label: "Explore redlining",
            href: "/platform/redlining",
            dataAttr: "version-hero-redlining",
          }}
        />
        <TileSpacerRow />
        <VersionStatesSection />
        <TileSpacerRow />
        <VersionCloneSection />
        <TileSpacerRow />
        <VersionTimelineSection />
        <TileSpacerRow />
        <VersionGuardrailsSection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="How Uprevit protects live masters, locks released history, and tracks every revision."
          faqs={VERSION_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about version control and release governance."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact"
          contactCtaAttr="version-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="Never ship from the wrong file."
          mutedTitle="Track every version cleanly."
          description="See how Uprevit keeps drafts, active reviews, locked masters, and superseded history organized in one timeline."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "version-cta-book-demo",
          }}
          secondaryCta={{
            label: "View pricing",
            href: "/pricing",
            dataAttr: "version-cta-view-pricing",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
