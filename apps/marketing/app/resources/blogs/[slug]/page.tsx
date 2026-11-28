import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { TileGrid, TileSpacerRow } from "@/components/TileGrid";
import CTASection from "@/features/marketing/landing-page/CTASection";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import MarketingHeader from "@/features/marketing/marketing-header";
import { BlogPostArticle } from "@/features/resources/blogs/BlogPostArticle";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { pageMetadata, siteUrl } from "@/lib/metadata";

type BlogPostPageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost((await params).slug);
  if (!post) return {};

  const path = `/resources/blogs/${post.slug}`;
  const metadata = pageMetadata(post.title, post.description, path);
  const images = {
    url: `${path}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: post.title,
  };

  return {
    ...metadata,
    authors: [{ name: post.author }],
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const url = `${siteUrl}/resources/blogs/${post.slug}`;

  return (
    <TileGrid>
      <MarketingHeader inTileGrid />
      <TileSpacerRow />
      <main id="main-content" className="contents">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            mainEntityOfPage: url,
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@id": `${siteUrl}/#organization` },
            publisher: { "@id": `${siteUrl}/#organization` },
            image: `${url}/opengraph-image`,
          }}
        />
        <BlogPostArticle post={post} />
        <CTASection
          title="See your own labels"
          mutedTitle="in Uprevit."
          description="Bring one product. We'll set it up live, run it through review and export the release on the call."
          primaryCta={{
            label: "Book a demo",
            href: "/contact?topic=demo",
            dataAttr: "blog-article-cta-book-demo",
          }}
          secondaryCta={{
            label: "Explore the platform",
            href: "/platform/overview",
            dataAttr: "blog-article-cta-platform",
          }}
        />
      </main>
      <FooterSection inTileGrid />
    </TileGrid>
  );
}
