import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import PlatformHeroSection from "@/features/marketing/platform/PlatformHeroSection";
import ProductsAttributesSection from "@/features/marketing/platform/ProductsAttributesSection";
import ProductsBulkImportSection from "@/features/marketing/platform/ProductsBulkImportSection";
import ProductsDetailsSection from "@/features/marketing/platform/ProductsDetailsSection";
import FAQSection, { type FAQItem } from "@/features/marketing/landing-page/FAQSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Products & Bulk Import",
  "Give every medical device a clean seven-tab source of truth—and onboard existing Excel catalogs into Uprevit with dry-run validation before creating a single draft.",
  "/platform/products",
);

const PRODUCTS_FAQS: FAQItem[] = [
  {
    id: "format",
    question: "What file format does Bulk Import accept?",
    answer:
      "Upload Excel (.xlsx) or CSV workbooks formatted with the Uprevit import template—covering product metadata, custom fields, compliance standards, languages, and label components.",
  },
  {
    id: "overwrite",
    question: "Can Bulk Import overwrite existing released products?",
    answer:
      "No. Dry-run validation flags any duplicate product plan numbers before import, and Bulk Import only creates fresh Draft v1 records so existing released masters are never modified.",
  },
  {
    id: "custom-fields",
    question: "Can we capture attributes beyond the standard medical device fields?",
    answer:
      "Yes. Add custom key-value attributes such as DEHP-Free, Latex-Free, or MRI Safety to any product record, and map custom columns directly during Excel bulk import.",
  },
  {
    id: "label-tags",
    question: "How do Annotated Label Tags work?",
    answer:
      "Upload artwork for pouch, carton, or IFU labels, draw color-coded callout regions directly on the canvas, and link each zone to a structured legend entry that travels with every revision.",
  },
  {
    id: "specs-grid",
    question: "Can we edit technical specs like a spreadsheet?",
    answer:
      "Yes. Both Product Specifications and Operational Parameters include built-in multi-sheet workbook grids with Find & Replace, column filters, cell formatting, and direct .xlsx import/export.",
  },
];

export default function PlatformProductsPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <PlatformHeroSection
          headingId="products-hero-heading"
          title="Structured product records,"
          mutedTitle="onboarded from your spreadsheets"
          description="Give every device a clean seven-tab source of truth—and bring existing Excel catalogs into Uprevit with dry-run validation before creating a single draft."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "products-hero-book-demo",
          }}
          secondaryCta={{
            label: "See version control",
            href: "/platform/version-control",
            dataAttr: "products-hero-version-control",
          }}
        />
        <TileSpacerRow />
        <ProductsAttributesSection />
        <TileSpacerRow />
        <ProductsBulkImportSection />
        <TileSpacerRow />
        <ProductsDetailsSection />
        <TileSpacerRow />
        <FAQSection
          title="Frequently asked"
          mutedTitle="questions."
          description="Answers on our seven-tab data model, custom fields, and validated Excel onboarding."
          faqs={PRODUCTS_FAQS}
          contactTitle="Still have questions?"
          contactBody="Talk to our team about migrating your spreadsheets and product catalog."
          contactCtaLabel="Contact us"
          contactCtaHref="/contact"
          contactCtaAttr="products-faq-contact-us"
          showCtaArrow={false}
        />
        <TileSpacerRow />
        <CTASection
          title="Bring your catalog in."
          mutedTitle="Leave messy sheets behind."
          description="Bring an existing product spreadsheet to a demo and watch it validate and load into structured seven-tab drafts live."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "products-cta-book-demo",
          }}
          secondaryCta={{
            label: "View pricing",
            href: "/pricing",
            dataAttr: "products-cta-view-pricing",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
