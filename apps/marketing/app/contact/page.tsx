import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import ContactPageContent from "@/features/marketing/contact/ContactPageContent";
import FooterSection from "@/features/marketing/landing-page/FooterSection";

export const metadata = pageMetadata(
  "Contact Us",
  "Talk to the Uprevit team about medical device labeling, product demos, pricing or enterprise rollouts. We reply within 2–3 business days.",
  "/contact",
);

export default function ContactPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main className="contents">
        <ContactPageContent />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
