"use client";

import { useDocumentationVideoUrl } from "@/hooks/docs/useDocumentationVideoUrl";
import { cn } from "@uprevit/ui/lib/utils";
import type { DocumentationVideoKey } from "@/types/documentation-video";
import Player from "next-video/player";

type DocsVideoProps = {
  videoKey: DocumentationVideoKey;
  title?: string;
  caption?: string;
  className?: string;
};

export function DocsVideo({
  videoKey,
  title,
  caption,
  className,
}: DocsVideoProps) {
  const { data, isLoading, isError, error, isFetching } =
    useDocumentationVideoUrl(videoKey);

  if (isLoading || (isFetching && !data?.url)) {
    return (
      <div
        className={cn(
          "my-6 aspect-video w-full animate-pulse rounded-lg bg-muted",
          className,
        )}
        aria-busy="true"
        aria-label={title ? `Loading video: ${title}` : "Loading video"}
      />
    );
  }

  if (isError || !data?.url) {
    return (
      <p className="my-6 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "This video could not be loaded."}
      </p>
    );
  }

  return (
    <figure className={cn("my-6", className)}>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black outline-1 outline-border outline-offset-0">
        <Player
          key={data.url}
          src={data.url}
          controls
          playsInline
          crossOrigin={undefined}
          title={title}
          aria-label={title}
          style={{
            width: "100%",
            height: "100%",
          }}
          className="h-full w-full scale-[1.08] object-cover [object-position:center_58%]"
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
