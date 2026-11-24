import { readFileSync } from "node:fs";
import path from "node:path";
import { blog } from "collections/server";

export type BlogPost = (typeof blog)[number] & {
  slug: string;
  readTime: string;
};

export interface BlogTocItem {
  id: string;
  title: string;
  depth: number;
}

function estimateReadTime(relativePath: string): string {
  try {
    const filePath = path.join(process.cwd(), "content", "blog", relativePath);
    const raw = readFileSync(filePath, "utf8");
    const content = raw.replace(/^---[\s\S]*?---/, "");
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  } catch {
    return "4 min read";
  }
}

export const blogPosts: BlogPost[] = blog
  .map((post) => ({
    ...post,
    slug: post.info.path.replace(/\.mdx$/, ""),
    readTime: estimateReadTime(post.info.path),
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug);

function extractText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return extractText(props?.children);
  }
  return "";
}

export const getBlogToc = (post: BlogPost): BlogTocItem[] =>
  (post.toc ?? [])
    .filter((item) => item.depth === 2)
    .map((item) => ({
      id: item.url.replace(/^#/, ""),
      title: extractText(item.title).trim(),
      depth: item.depth,
    }))
    .filter((item) => item.id && item.title);

export const formatBlogDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
