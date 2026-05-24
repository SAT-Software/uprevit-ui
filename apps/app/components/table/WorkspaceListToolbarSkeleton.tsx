"use client";

export function WorkspaceListToolbarSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2 w-full">
      <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
      <div className="flex items-center gap-2">
        <div className="h-8 w-[230px] rounded-md bg-muted animate-pulse" />
        <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}
