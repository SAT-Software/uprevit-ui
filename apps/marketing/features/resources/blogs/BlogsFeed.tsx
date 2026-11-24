"use client";

import * as React from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { TileRow } from "@/components/TileGrid";
import { BlogPostCard, type BlogPostSummary } from "./BlogPostCard";

const ALL_CATEGORY = "All posts";
const PAGE_SIZE = 6;

export function BlogsFeed({ posts }: { posts: BlogPostSummary[] }) {
  const [activeCategory, setActiveCategory] = React.useState(ALL_CATEGORY);
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const categories = React.useMemo(() => {
    const unique = Array.from(new Set(posts.map((post) => post.category)));
    return [ALL_CATEGORY, ...unique];
  }, [posts]);

  const featuredPost = posts[0];

  const matchingPosts = React.useMemo(() => {
    if (activeCategory === ALL_CATEGORY) return posts;
    return posts.filter((post) => post.category === activeCategory);
  }, [posts, activeCategory]);

  const gridPosts = React.useMemo(() => {
    return matchingPosts.filter((post) => post.slug !== featuredPost?.slug);
  }, [featuredPost, matchingPosts]);

  const visibleGridPosts = gridPosts.slice(0, visibleCount);
  const hasMore = visibleCount < gridPosts.length;
  const trailingPlaceholders =
    visibleGridPosts.length > 0 && visibleGridPosts.length % 3 !== 0
      ? 3 - (visibleGridPosts.length % 3)
      : 0;

  const countLabel = `${matchingPosts.length} ${matchingPosts.length === 1 ? "post" : "posts"}`;

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      {featuredPost && <BlogPostCard post={featuredPost} featured />}

      <TileRow
        as="div"
        centerClassName="flex flex-col gap-3 overflow-hidden py-3.5 pl-5 sm:flex-row sm:items-center sm:justify-between sm:overflow-visible sm:px-8 sm:py-3.5"
      >
        <div className="flex items-center justify-between pr-5 sm:hidden">
          <span className="font-ui text-label font-medium leading-4 text-foreground">
            Latest posts
          </span>
          <span className="font-ui text-label leading-4 text-faint-foreground">
            {countLabel}
          </span>
        </div>

        <div
          role="group"
          aria-label="Filter articles by category"
          className="flex items-center gap-1.5 overflow-x-auto pr-5 sm:flex-wrap sm:overflow-visible sm:pr-0"
        >
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleSelectCategory(category)}
                className={cn(
                  "inline-flex h-7 shrink-0 cursor-pointer items-center rounded-md px-2.5 font-ui text-[12px] font-medium leading-4 outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border border-primary-700 bg-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
                    : "border border-border bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-surface-hover dark:border-edge-2 dark:bg-surface-2 dark:hover:bg-surface-3",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="hidden shrink-0 font-ui text-label leading-4 text-faint-foreground sm:block">
          {countLabel}
        </div>
      </TileRow>

      {visibleGridPosts.length > 0 && (
        <TileRow
          as="section"
          aria-label="Articles"
          splitCenter
          centerClassName="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3"
        >
          {visibleGridPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
          {Array.from({ length: trailingPlaceholders }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              aria-hidden="true"
              className="hidden rounded-tile bg-tile lg:block"
            />
          ))}
        </TileRow>
      )}

      {hasMore && (
        <TileRow
          as="div"
          centerClassName="flex items-center justify-center p-7"
        >
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-stroke-strong bg-card px-4 font-ui text-body-m font-medium leading-[18px] text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-colors duration-150 hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-ring dark:border-edge-3 dark:bg-surface-2 dark:hover:bg-surface-3"
          >
            <span>Load more posts</span>
            <Icon icon={ArrowDown01Icon} size={14} strokeWidth={1.8} />
          </button>
        </TileRow>
      )}
    </>
  );
}
