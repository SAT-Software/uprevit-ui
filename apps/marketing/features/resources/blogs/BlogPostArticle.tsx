import { ArrowLeft02Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import Link from "next/link";
import { formatBlogDate, type BlogPost } from "@/lib/blog";
import { BlogCover } from "./BlogCover";
import { blogMdxComponents } from "./BlogMdxComponents";

export function BlogPostArticle({ post }: { post: BlogPost }) {
  const Body = post.body;

  return (
    <article className="w-full mt-16 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <header className="max-w-3xl mx-auto mb-12 px-4 lg:px-0">
        <Link
          href="/resources/blogs"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon icon={ArrowLeft02Icon} size={16} strokeWidth={2} />
          All articles
        </Link>
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="outline">{post.category}</Badge>
          <span className="flex items-center gap-1.5">
            <Icon icon={Calendar03Icon} size={14} strokeWidth={2} />
            {formatBlogDate(post.date)}
          </span>
          <span>{post.author}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-medium leading-tight text-balance">
          {post.title}
        </h1>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          {post.description}
        </p>
      </header>

      <div className="relative w-full">
        <div className="max-w-5xl mx-auto relative px-2 lg:px-0">
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={270}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -right-15"
            rotation={180}
          />
          <div className="p-1 bg-muted rounded-2xl border border-border shadow-bottom-lg">
            <BlogCover cover={post.cover} />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-0 pt-12">
        <Body components={blogMdxComponents} />
      </div>
    </article>
  );
}
