import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/metadata";

const paths = ["/", "/pricing", "/contact", "/resources", "/resources/blogs"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...paths.map((path) => ({ url: `${siteUrl}${path}` })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/resources/blogs/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
