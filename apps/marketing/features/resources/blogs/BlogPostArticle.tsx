import Link from "next/link";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { BrandMark } from "@/components/BrandLogo";
import { TileRow, TileSpacerRow } from "@/components/TileGrid";
import { formatBlogDate, getBlogToc, type BlogPost } from "@/lib/blog";
import {
  BlogArticleMobileToc,
  BlogArticleSidebar,
  CopyArticleLinkButton,
} from "./BlogArticleSidebar";
import { BlogCover } from "./BlogCover";
import { blogMdxComponents } from "./BlogMdxComponents";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  const Body = post.body;
  const toc = getBlogToc(post);
  const formattedDate = formatBlogDate(post.date);

  return (
    <article className="contents">
      <TileRow
        as="header"
        centerClassName="relative overflow-hidden px-5 py-7 sm:px-10 sm:py-12 lg:px-12 lg:pt-[52px] lg:pb-[56px]"
      >
        <div
          aria-hidden="true"
          className="tile-dots pointer-events-none absolute bottom-0 right-0 h-[280px] w-full overflow-hidden sm:h-[340px] lg:h-[400px]"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 90% 85% at 100% 100%, transparent 0%, color-mix(in srgb, var(--tile-surface-solid) 70%, transparent) 55%, var(--tile-surface-solid) 100%)",
            }}
          />
        </div>

        <div className="relative flex flex-col gap-6 lg:gap-8">
          <Link
            href="/resources/blogs"
            className="inline-flex w-fit items-center gap-1.5 font-ui text-body-m font-medium leading-5 text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            <Icon icon={ArrowLeft02Icon} size={15} strokeWidth={1.8} />
            All articles
          </Link>

          <div className="flex max-w-[820px] flex-col gap-4 lg:gap-5">
            <div className="flex flex-wrap items-center gap-3 font-ui text-body-m leading-5 text-muted-foreground">
              <span className="inline-flex h-6 items-center rounded-md bg-muted px-2.5 font-ui text-body-s font-medium leading-4 text-foreground dark:bg-surface-4">
                {post.category}
              </span>
              <span
                aria-hidden="true"
                className="h-3.5 w-px shrink-0 bg-border dark:bg-edge-3"
              />
              <span>{formattedDate}</span>
              <span
                aria-hidden="true"
                className="size-[3px] shrink-0 rounded-full bg-faint-foreground"
              />
              <span>{post.readTime}</span>
            </div>

            <h1 className="font-sans text-[30px] font-medium leading-[34px] tracking-[-0.04em] text-foreground text-balance sm:text-[40px] sm:leading-[46px] lg:text-[48px] lg:leading-[54px]">
              {post.title}
            </h1>

            <p className="max-w-[680px] font-ui text-[15px] leading-[23px] text-muted-foreground sm:text-lead sm:leading-[29px]">
              {post.description}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-black/80 bg-[linear-gradient(180deg,#2A2A2A_0%,#1A1A1A_55%,#111111_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_6px_rgba(0,0,0,0.14)] dark:border-edge-2"
            >
              <BrandMark
                className="h-[15px] w-[18px]"
                markColor="#FFFFFF"
                arrowColor="#A56BFF"
              />
            </span>
            <div className="flex flex-col">
              <span className="font-ui text-body-m font-medium leading-5 text-foreground">
                {post.author}
              </span>
              <span className="font-ui text-body-s leading-[18px] text-muted-foreground">
                Product &amp; Medical Device Labeling
              </span>
            </div>
          </div>
        </div>
      </TileRow>

      <TileRow as="div" centerClassName="overflow-hidden">
        <BlogCover
          cover={post.cover}
          variant="tile"
          className="h-[260px] sm:h-[360px] lg:h-[460px]"
        />
      </TileRow>

      <BlogArticleMobileToc items={toc} />

      <TileRow
        as="section"
        aria-label="Article content"
        splitCenter
        centerClassName="grid grid-cols-1 gap-px lg:grid-cols-[300px_minmax(0,1fr)]"
      >
        <div className="hidden rounded-tile bg-tile py-12 pl-9 pr-7 lg:block">
          <BlogArticleSidebar items={toc} />
        </div>

        <div className="rounded-tile bg-tile px-5 pt-7 pb-9 sm:px-10 sm:py-10 lg:py-12 lg:pb-16 lg:pl-[72px] lg:pr-16">
          <div className="max-w-[660px]">
            <div className="[&>*:first-child]:mt-0">
              <Body components={blogMdxComponents} />
            </div>

            <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-separator pt-7">
              <Link
                href="/resources/blogs"
                className="inline-flex items-center gap-1.5 font-ui text-body-m font-medium text-foreground transition-colors duration-150 hover:text-primary dark:hover:text-primary-text"
              >
                <Icon icon={ArrowLeft02Icon} size={15} strokeWidth={1.8} />
                Back to all articles
              </Link>

              <div className="hidden items-center gap-3 sm:flex">
                <span className="inline-flex h-6 items-center rounded-sm bg-muted px-2 font-ui text-body-s font-medium leading-4 text-foreground dark:bg-surface-4">
                  {post.category}
                </span>
                <span className="font-ui text-body-s text-muted-foreground">
                  {formattedDate}
                </span>
              </div>

              <CopyArticleLinkButton className="sm:hidden" />
            </footer>
          </div>
        </div>
      </TileRow>

      <TileSpacerRow />
    </article>
  );
}
