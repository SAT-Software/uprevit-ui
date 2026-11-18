import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarketingHeader from "@/features/marketing/marketing-header";
import FooterSection from "@/features/marketing/landing-page/FooterSection";
import CTASection from "@/features/marketing/landing-page/CTASection";
import { DottedVerticalLines } from "@/features/marketing/landing-page/DottedVerticalLines";
import { BlogPostArticle } from "@/features/resources/blogs/BlogPostArticle";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { JsonLd } from "@/components/JsonLd";
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

  const metadata = pageMetadata(
    post.title,
    post.description,
    `/resources/blogs/${post.slug}`,
  );

  return {
    ...metadata,
    authors: [{ name: post.author }],
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();

  const url = `${siteUrl}/resources/blogs/${post.slug}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative bg-accent/50">
      <MarketingHeader />
      <div className="relative w-full">
        <DottedVerticalLines />
        <main className="relative z-10 w-full pt-8 md:pt-24">
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
              image: `${siteUrl}/og-image.png`,
            }}
          />
          <BlogPostArticle post={post} />
          <CTASection />
        </main>
        <div className="relative z-35 w-full">
          <FooterSection />
        </div>
      </div>
    </div>
  );
}
