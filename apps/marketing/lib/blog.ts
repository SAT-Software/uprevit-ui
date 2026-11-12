import { blog } from "collections/server";

export type BlogPost = (typeof blog)[number] & { slug: string };

export const blogPosts: BlogPost[] = blog
  .map((post) => ({ ...post, slug: post.info.path.replace(/\.mdx$/, "") }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

export const formatBlogDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
