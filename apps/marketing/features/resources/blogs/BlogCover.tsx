import { cn } from "@uprevit/ui/lib/utils";
import { DotsBackdrop } from "@/features/marketing/landing-page/DotsBackdrop";
import { blogCovers } from "./covers";

export function BlogCover({
  cover,
  variant = "default",
  className,
}: {
  cover: string;
  variant?: "default" | "tile";
  className?: string;
}) {
  const Cover = blogCovers[cover];

  if (variant === "tile") {
    return (
      <div
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden",
          className,
        )}
      >
        <DotsBackdrop
          className="opacity-45"
          dotsClassName="[mask-image:radial-gradient(ellipse_74%_70%_at_50%_50%,transparent_36%,#000_68%,transparent_98%)]"
        />
        {Cover && (
          <div className="relative z-10 size-full">
            <Cover />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "aspect-video w-full overflow-hidden rounded-xl border border-border bg-background",
        className,
      )}
    >
      {Cover && <Cover />}
    </div>
  );
}
