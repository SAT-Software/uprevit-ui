"use client";

import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export function WorkspaceListPaginationSkeleton() {
  return (
    <div className="flex w-full items-center justify-between gap-3 pl-3 pr-2">
      <Skeleton className="h-4 w-36" />
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="mx-2 h-4 w-12" />
        <Skeleton className="size-8 rounded-md" />
        <Skeleton className="size-8 rounded-md" />
      </div>
    </div>
  );
}
