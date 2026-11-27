import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PlatformHeroSection from "@/features/marketing/platform/PlatformHeroSection";
import PlatformWorkspaceSection from "@/features/marketing/platform/PlatformWorkspaceSection";
import PlatformRecordTabsSection from "@/features/marketing/platform/PlatformRecordTabsSection";
import PlatformModulesSection from "@/features/marketing/platform/PlatformModulesSection";
import PlatformInspectionSection from "@/features/marketing/platform/PlatformInspectionSection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Platform Overview",
  "One structured workspace for medical device labeling with departments, projects, seven-tab records, role-based access, audit trails, and ISO 15223-1 symbols.",
  "/platform/overview",
);

const PLATFORM_FAQS: FAQItem[] = [
  {
    id: "qms",
    question: "Does Uprevit replace our QMS or document control system?",
    answer:
      "No. Uprevit manages structured label content, versions, and internal cross-functional reviews. Export released versions to PDF and file them directly in your QMS.",
  },
  {
    id: "structure",
    question: "How are departments, projects, and products structured?",
    answer:
      "Your workspace mirrors your organization. Departments hold projects, projects hold products, and every product keeps its own seven-tab record, team, and version history.",
  },
  {
    id: "roles",
    question: "How do workspace roles and permissions work?",
    answer:
      "Admins manage the workspace, members, and approval workflows. Users create and edit product records, Approvers review the products in their assigned workflows, and Managers handle billing.",
  },
  {
    id: "migrate",
    question: "Can we migrate existing Excel spreadsheets without starting over?",
    answer:
      "Yes. Bulk import maps your Excel or CSV columns to product fields and runs a dry-run check first, so you can fix issues before any records are created.",
  },
  {
    id: "standards",
    question: "Which medical device standards are supported out of the box?",
    answer:
      "Label records are structured around EU MDR 2017/745, FDA 21 CFR 801 and UDI, ISO 15223-1 and ISO 20417 symbols and label information, Health Canada MDR, and UK MDR 2002 / UKCA.",
  },
];

export default function PlatformOverviewPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <PlatformHeroSection />
        <TileSpacerRow />
        <PlatformWorkspaceSection />
        <TileSpacerRow />
        <PlatformRecordTabsSection />
        <TileSpacerRow />
        <PlatformModulesSection />
        <TileSpacerRow />
        <PlatformInspectionSection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="Common questions from regulatory, quality, and packaging teams moving to Uprevit."
          faqs={PLATFORM_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about your labeling workflow and regulatory requirements."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact"
          contactCtaAttr="platform-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="Replace label spreadsheets"
          mutedTitle="with one structured platform."
          description="See your departments, seven-tab records, redlines, and approvals in a demo built around one of your own devices."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "platform-cta-book-demo",
          }}
          secondaryCta={{
            label: "View pricing",
            href: "/pricing",
            dataAttr: "platform-cta-view-pricing",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
