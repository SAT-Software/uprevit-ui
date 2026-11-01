import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

export function FolderGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      <span role="status" className="sr-only">
        Loading…
      </span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex flex-col items-center px-2 pb-4 pt-4"
        >
          <Skeleton className="h-[78px] w-[92px] rounded-xl" />
          <div className="mt-3 flex h-5 items-center">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="mt-0.5 flex h-4 items-center">
            <Skeleton className="h-3 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
}
