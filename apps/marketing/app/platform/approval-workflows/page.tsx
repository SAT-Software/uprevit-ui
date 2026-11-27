import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PlatformHeroSection from "@/features/marketing/platform/PlatformHeroSection";
import WorkflowBundleSection from "@/features/marketing/platform/WorkflowBundleSection";
import WorkflowDiscussionSection from "@/features/marketing/platform/WorkflowDiscussionSection";
import WorkflowHistorySection from "@/features/marketing/platform/WorkflowHistorySection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Approval Workflows",
  "Route label changes across Regulatory Affairs, Quality Assurance, Packaging, and Clinical—with live redlines, threaded feedback, and timestamped sign-offs.",
  "/platform/approval-workflows",
);

const APPROVALS_FAQS: FAQItem[] = [
  {
    id: "esignatures",
    question: "Are approvals in Uprevit legally binding electronic signatures?",
    answer:
      "No. Workflow approvals provide a structured internal review record with names, functions, rationales, and timestamps. Formal QMS sign-off stays in your QMS.",
  },
  {
    id: "bundle-products",
    question: "Can one workflow bundle multiple products together?",
    answer:
      "Yes. You can route a single product update or bundle an entire device family into one change package so cross-functional teams review related label updates together.",
  },
  {
    id: "change-requests",
    question: "What happens when a reviewer requests changes?",
    answer:
      "Change requests attach directly to the workflow or a specific product with threaded replies and file attachments. If content changes mid-review, Uprevit flags affected approvers to re-verify.",
  },
  {
    id: "out-of-office",
    question: "What if an assigned approver is out of office?",
    answer:
      "Workspace admins or workflow owners can reassign an approver for that function without restarting the package, and the replacement is logged in the immutable decision timeline.",
  },
  {
    id: "release-control",
    question: "Can we control when approved drafts become Released?",
    answer:
      "Yes. Collecting all sign-offs marks the package Ready, and authorized leads trigger Release when production and QMS timing align—promoting every draft to a locked live master.",
  },
];

export default function PlatformApprovalWorkflowsPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <PlatformHeroSection
          headingId="approvals-hero-heading"
          title="Structured approvals"
          mutedTitle="with built-in audit trails"
          description="Route label changes across Regulatory Affairs, Quality Assurance, Packaging, and Clinical—with live redlines, threaded feedback, and timestamped sign-offs."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "approvals-hero-book-demo",
          }}
          secondaryCta={{
            label: "See reports & exports",
            href: "/platform/reports-exports",
            dataAttr: "approvals-hero-reports",
          }}
        />
        <TileSpacerRow />
        <WorkflowBundleSection />
        <TileSpacerRow />
        <WorkflowDiscussionSection />
        <TileSpacerRow />
        <WorkflowHistorySection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="Questions on cross-functional sign-offs, change requests, and workflow governance."
          faqs={APPROVALS_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about approval routing and cross-functional reviews."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact"
          contactCtaAttr="approvals-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="No more chasing sign-offs"
          mutedTitle="across email threads."
          description="See how cross-functional teams review redlines, resolve feedback, and release label packages in one place."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "approvals-cta-book-demo",
          }}
          secondaryCta={{
            label: "View pricing",
            href: "/pricing",
            dataAttr: "approvals-cta-view-pricing",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
