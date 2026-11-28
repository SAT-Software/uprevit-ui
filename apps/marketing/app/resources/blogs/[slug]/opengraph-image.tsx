import { notFound } from "next/navigation";
import { BlogOgImage } from "@/features/resources/blogs/BlogOgImage";
import { blogPosts, getBlogPost } from "@/lib/blog";

export const alt = "Uprevit blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogPosts.map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = getBlogPost((await params).slug);
  if (!post) notFound();
  return BlogOgImage(post);
}
