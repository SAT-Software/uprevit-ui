import { TileRow, TileSpacerRow } from "@/components/TileGrid";
import { blogPosts, formatBlogDate } from "@/lib/blog";
import { BlogNewsletterSection } from "./BlogNewsletterSection";
import type { BlogPostSummary } from "./BlogPostCard";
import { BlogsFeed } from "./BlogsFeed";

export default function BlogsSection() {
  const summaries: BlogPostSummary[] = blogPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
    formattedDate: formatBlogDate(post.date),
    author: post.author,
    category: post.category,
    cover: post.cover,
  }));

  return (
    <>
      <TileRow
        as="section"
        aria-labelledby="blog-hero-heading"
        centerClassName="relative overflow-hidden px-5 pt-12 pb-9 sm:px-8 sm:pt-16 sm:pb-12 lg:px-10 lg:pt-[88px] lg:pb-16"
      >
        <div
          aria-hidden="true"
          className="tile-dots pointer-events-none absolute bottom-0 right-0 h-[280px] w-full overflow-hidden sm:h-[360px] lg:h-[420px]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 90% 85% at 100% 100%, transparent 0%, color-mix(in srgb, var(--tile-surface-solid) 70%, transparent) 55%, var(--tile-surface-solid) 100%)",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-4 sm:gap-5">
          <h1
            id="blog-hero-heading"
            className="text-balance font-sans text-[30px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground sm:text-[46px] lg:text-[60px] lg:leading-[1.07]"
          >
            The Uprevit blog
            <br />
            <span className="text-foreground/55">
              Insights for labeling teams
            </span>
          </h1>
          <p className="max-w-[560px] text-pretty font-ui text-[15px] leading-[23px] text-muted-foreground sm:text-[17px] sm:leading-[27px] lg:text-lead lg:leading-[30px]">
            Regulatory updates, practical guides and product news for medical
            device labeling teams.
          </p>
        </div>
      </TileRow>

      <BlogsFeed posts={summaries} />

      <TileSpacerRow />
      <BlogNewsletterSection latestPost={summaries[0]} />
      <TileSpacerRow />
    </>
  );
}
