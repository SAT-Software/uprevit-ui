import { blogCovers } from "./covers";

export function BlogCover({ cover }: { cover: string }) {
  const Cover = blogCovers[cover];

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-background">
      {Cover && <Cover />}
    </div>
  );
}
