import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import Link from "next/link";
import { formatBlogDate, type BlogPost } from "@/lib/blog";
import { BlogCover } from "./BlogCover";

export function BlogPostCard({
  post,
  featured,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/resources/blogs/${post.slug}`}
      className={cn(
        "group grid gap-4 rounded-xl border border-border bg-background/80 p-2 transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 motion-reduce:transition-none",
        featured && "lg:grid-cols-[1.4fr_1fr] lg:gap-8",
      )}
    >
      <BlogCover cover={post.cover} />
      <div
        className={cn(
          "flex flex-col gap-3 px-2 pb-2",
          featured && "lg:justify-center lg:py-6 lg:pr-6",
        )}
      >
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="outline">{post.category}</Badge>
          <span className="flex items-center gap-1.5">
            <Icon icon={Calendar03Icon} size={14} strokeWidth={2} />
            {formatBlogDate(post.date)}
          </span>
        </div>
        <h2
          className={cn(
            "font-semibold leading-tight text-foreground",
            featured ? "text-2xl md:text-3xl" : "text-lg",
          )}
        >
          {post.title}
        </h2>
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground line-clamp-3">
          {post.description}
        </p>
        <span className="mt-2 text-sm font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors group-hover:decoration-primary">
          Read article
        </span>
      </div>
    </Link>
  );
}
