"use client";

import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export function WorkspaceListToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      <Skeleton className="h-8 w-28 rounded-md" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-[230px] rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
    </div>
  );
}
