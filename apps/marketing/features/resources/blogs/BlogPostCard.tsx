import Link from "next/link";
import { TileRow } from "@/components/TileGrid";
import { BlogCover } from "./BlogCover";

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  formattedDate: string;
  author: string;
  category: string;
  cover: string;
}

function PostMeta({
  author,
  formattedDate,
  category,
}: Pick<BlogPostSummary, "author" | "formattedDate" | "category">) {
  return (
    <div className="flex flex-col gap-2">
      <div className="font-ui text-body-m font-medium leading-5 text-foreground">
        {author}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-ui text-body-m leading-5 text-muted-foreground">
          {formattedDate}
        </span>
        <span
          aria-hidden="true"
          className="h-4 w-px shrink-0 bg-border dark:bg-edge-3"
        />
        <span className="inline-flex h-6 items-center rounded-sm bg-muted px-2 font-ui text-body-s font-medium leading-4 text-foreground dark:bg-surface-4">
          {category}
        </span>
      </div>
    </div>
  );
}

export function BlogPostCard({
  post,
  featured,
}: {
  post: BlogPostSummary;
  featured?: boolean;
}) {
  if (featured) {
    return (
      <TileRow as="section" splitCenter aria-label={`Featured article: ${post.title}`}>
        <Link
          href={`/resources/blogs/${post.slug}`}
          className="group grid grid-cols-1 gap-px outline-none focus-visible:ring-2 focus-visible:ring-ring lg:grid-cols-[1fr_1.25fr]"
        >
          <div className="order-2 flex flex-col justify-between gap-7 rounded-tile bg-tile px-5 py-7 transition-colors duration-150 group-hover:bg-surface-hover/50 sm:px-10 sm:py-9 lg:order-1 lg:gap-10 lg:px-12 lg:py-10 dark:group-hover:bg-surface-2">
            <div className="flex flex-col gap-4">
              <h2 className="font-sans text-[22px] font-medium leading-[27px] tracking-[-0.03em] text-foreground sm:text-[30px] sm:leading-[36px] lg:text-[36px] lg:leading-[42px]">
                {post.title}
              </h2>
              <p className="font-ui text-body-m leading-[21px] text-muted-foreground sm:text-body-l sm:leading-[26px]">
                {post.description}
              </p>
            </div>
            <PostMeta
              author={post.author}
              formattedDate={post.formattedDate}
              category={post.category}
            />
          </div>

          <div className="order-1 flex overflow-hidden rounded-tile bg-tile lg:order-2">
            <BlogCover
              cover={post.cover}
              variant="tile"
              className="min-h-[240px] flex-1 sm:min-h-[320px] lg:min-h-[436px]"
            />
          </div>
        </Link>
      </TileRow>
    );
  }

  return (
    <Link
      href={`/resources/blogs/${post.slug}`}
      className="group flex flex-col gap-5 rounded-tile bg-tile px-4 pt-4 pb-6 outline-none transition-colors duration-150 hover:bg-surface-hover/50 focus-visible:ring-2 focus-visible:ring-ring dark:hover:bg-surface-2"
    >
      <BlogCover
        cover={post.cover}
        variant="tile"
        className="h-[216px] shrink-0"
      />
      <div className="flex grow flex-col gap-2.5 px-2">
        <h2 className="font-sans text-[22px] font-medium leading-[28px] tracking-[-0.02em] text-foreground">
          {post.title}
        </h2>
        <p className="line-clamp-3 font-ui text-[15px] leading-[22px] text-muted-foreground">
          {post.description}
        </p>
      </div>
      <div className="px-2">
        <PostMeta
          author={post.author}
          formattedDate={post.formattedDate}
          category={post.category}
        />
      </div>
    </Link>
  );
}
