import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PlatformHeroSection from "@/features/marketing/platform/PlatformHeroSection";
import ReportsQuerySection from "@/features/marketing/platform/ReportsQuerySection";
import ReportsProductExportsSection from "@/features/marketing/platform/ReportsProductExportsSection";
import ReportsQueueSection from "@/features/marketing/platform/ReportsQueueSection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Reports & Exports",
  "Query your entire device catalog for internal impact assessments—and export complete product dossiers for Notified Bodies, auditors, print vendors, and ERPs.",
  "/platform/reports-exports",
);

const REPORTS_FAQS: FAQItem[] = [
  {
    id: "report-vs-product-export",
    question: "How are Report Exports different from Complete Product Exports?",
    answer:
      "Report Exports output filtered multi-product query results to PDF or Excel for internal portfolio assessments. Complete Product Exports package all 7 tabs of one specific product version for external stakeholders.",
  },
  {
    id: "external-stakeholders",
    question: "Who are Complete Product Exports designed for?",
    answer:
      "They are structured for external handoff to Notified Bodies, regulatory auditors, QMS document control systems, print vendors, and ERP teams who need one controlled version package.",
  },
  {
    id: "saved-queries",
    question: "Can we save and share portfolio queries across our team?",
    answer:
      "Yes. Save recurring where-used queries—such as devices sharing an ISO symbol, sterilization method, or target market—so Regulatory and Labeling teams can rerun them in one click.",
  },
  {
    id: "background-jobs",
    question: "Do large PDF or Excel exports freeze the browser?",
    answer:
      "No. Large product dossiers, portfolio reports, and audit log exports process asynchronously in a background queue with live progress and signed download links when ready.",
  },
  {
    id: "audit-logs",
    question: "Can we also export workspace audit logs?",
    answer:
      "Yes. Workspace admins can filter and export full audit trails covering product edits, version promotions, approval decisions, and membership changes for inspection readiness.",
  },
];

export default function PlatformReportsExportsPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <PlatformHeroSection
          headingId="reports-hero-heading"
          title="Portfolio-wide reporting"
          mutedTitle="and audit-ready product exports"
          description="Query your entire device catalog for internal impact assessments—and export complete product dossiers for Notified Bodies, auditors, print vendors, and ERPs."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "reports-hero-book-demo",
          }}
          secondaryCta={{
            label: "See pricing",
            href: "/pricing",
            dataAttr: "reports-hero-pricing",
          }}
        />
        <TileSpacerRow />
        <ReportsQuerySection />
        <TileSpacerRow />
        <ReportsProductExportsSection />
        <TileSpacerRow />
        <ReportsQueueSection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="Understanding internal portfolio reports, complete product exports, and background jobs."
          faqs={REPORTS_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about portfolio reporting and complete product exports."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact"
          contactCtaAttr="reports-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="Answer audit questions fast."
          mutedTitle="Export with confidence."
          description="See portfolio-wide impact queries and one-click complete product dossiers running live in Uprevit."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "reports-cta-book-demo",
          }}
          secondaryCta={{
            label: "View pricing",
            href: "/pricing",
            dataAttr: "reports-cta-view-pricing",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
