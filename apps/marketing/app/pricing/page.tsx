import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PricingHeroSection from "@/features/marketing/pricing/PricingHeroSection";
import PricingPlansSection from "@/features/marketing/pricing/PricingPlansSection";
import PricingUsageSection from "@/features/marketing/pricing/PricingUsageSection";
import PricingAddOnsSection from "@/features/marketing/pricing/PricingAddOnsSection";
import PricingRolesSection from "@/features/marketing/pricing/PricingRolesSection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

const PRICING_FAQS: FAQItem[] = [
  {
    id: "how-priced",
    question: "How is Uprevit priced?",
    answer:
      "Three parts: a fixed platform fee each billing cycle, seats for the people who use Uprevit, and usage add-ons for uploads and exports beyond what's included. Larger rollouts can be reviewed with our team.",
  },
  {
    id: "what-counts-as-seat",
    question: "What counts as a seat?",
    answer:
      "Admins and Users who create and edit products take a full seat. Approvers, who review products and act on their assigned workflows, use a half-price Approver seat. Billing-only Managers are free.",
  },
  {
    id: "what-counts-as-export",
    question: "What counts as an export?",
    answer:
      "An export is one completed PDF or XLSX product export or report export job. Every workspace includes 50 exports per month, with additional usage billed as a metered add-on.",
  },
  {
    id: "how-uploads-calculated",
    question: "How are uploads calculated?",
    answer:
      "Uploads are based on source files, artwork and attachments committed to the workspace. Every workspace includes 10 GB per month, with additional volume billed as a metered add-on.",
  },
  {
    id: "how-billing-works",
    question: "How does billing work?",
    answer:
      "Plans are quoted for your team and billed monthly on one clear invoice covering your platform fee, seats and any metered usage or optional add-ons like SSO. Annual agreements are also available on request.",
  },
  {
    id: "when-talk-to-us",
    question: "When should we talk to you?",
    answer:
      "Talk to us when you are ready for a quote, expect a larger rollout, need SSO or security review planning, or want a tailored agreement.",
  },
];

export default function PricingPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main className="contents">
        <PricingHeroSection />
        <PricingPlansSection />
        <TileSpacerRow />
        <PricingUsageSection />
        <TileSpacerRow />
        <PricingAddOnsSection />
        <TileSpacerRow />
        <PricingRolesSection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="What teams usually ask about seats, usage and billing before they sign."
          faqs={PRICING_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about seats, usage and the right setup for your rollout."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact?topic=pricing"
          contactCtaAttr="pricing-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="Start with one workspace."
          mutedTitle="Grow seat by seat."
          description="Walk through pricing for your team with us, and see your labels in Uprevit on the same call."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "pricing-cta-book-demo",
          }}
          secondaryCta={{
            label: "Contact us",
            href: "/contact",
            dataAttr: "pricing-cta-contact-us",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
