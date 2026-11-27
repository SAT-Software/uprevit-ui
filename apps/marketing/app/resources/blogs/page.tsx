import { pageMetadata } from "@/lib/metadata";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import MarketingHeader from "@/features/marketing/marketing-header";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import BlogsSection from "@/features/resources/blogs/BlogsSection";

export const metadata = pageMetadata(
  "Blog",
  "Regulatory updates, practical guides and product news for medical device labeling teams.",
  "/resources/blogs",
);

export default function BlogsPage() {
  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <BlogsSection />
        <CTASection
          title="See your own labels"
          mutedTitle="in Uprevit."
          description="Bring one product. We'll set it up live, run it through review and export the release on the call."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "blog-cta-book-demo",
          }}
          secondaryCta={{
            label: "Explore the platform",
            href: "/platform/overview",
            dataAttr: "blog-cta-platform",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
