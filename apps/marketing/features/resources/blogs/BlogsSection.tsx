import { MarketingSectionBadge } from "@/components/MarketingSectionBadge";
import { DecorativeCornerCircleCustom } from "@uprevit/ui/components/ui/DecorativeCornerCircle";
import { News01Icon } from "@hugeicons/core-free-icons";
import { blogPosts } from "@/lib/blog";
import { BlogPostCard } from "./BlogPostCard";

export default function BlogsSection() {
  const [featuredPost, ...posts] = blogPosts;

  return (
    <div className="w-full mt-16 mb-24 pointer-events-auto relative">
      <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      <div className="max-w-6xl mx-auto mb-12 px-2 md:px-2 lg:px-0">
        <MarketingSectionBadge icon={News01Icon} label="Blogs" />
        <div className="w-full flex flex-col lg:flex-row items-start gap-8">
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-medium leading-tightest">
            Insights for labeling leaders who need clarity fast
          </h1>
          <div className="hidden lg:block h-24 w-px bg-border" />
          <p className="text-base md:text-lg font-normal text-muted-foreground max-w-md leading-relaxed">
            Clear, concise analysis of the regulatory shifts that matter most.
            Stay ahead of enforcement changes with practical guidance you can
            act on.
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative px-2 md:px-2 lg:px-0">
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -left-15"
            rotation={270}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-15 -right-15"
            rotation={180}
          />
          <DecorativeCornerCircleCustom
            positionClassName="-top-15 -right-15"
            rotation={90}
          />

          <div className="p-1 bg-muted rounded-2xl border border-border shadow-bottom-lg">
            <div className="grid gap-1">
              {featuredPost && <BlogPostCard post={featuredPost} featured />}
              {posts.length > 0 && (
                <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
        <div className="absolute bottom-0 left-0 w-full h-0 border-b border-dashed border-border/80" />
      </div>
    </div>
  );
}
