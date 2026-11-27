import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/metadata";

const paths = [
  "/",
  "/platform/overview",
  "/platform/products",
  "/platform/version-control",
  "/platform/redlining",
  "/platform/approval-workflows",
  "/platform/reports-exports",
  "/pricing",
  "/contact",
  "/resources",
  "/resources/blogs",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...paths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/resources/blogs/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
