"use client";

import {
  Frame,
  FrameHeader,
  FramePanel,
} from "@uprevit/ui/components/ui/frame";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@uprevit/ui/components/ui/timeline";
import { cn } from "@uprevit/ui/lib/utils";

type ActivityLogsTimelineSkeletonProps = {
  className?: string;
  itemCount?: number;
};

function ActivityLogTimelineItemSkeleton() {
  return (
    <TimelineItem className="ms-10 pb-10">
      <TimelineHeader>
        <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.5rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
        <Skeleton className="h-4 w-4/5 max-w-sm" />
        <TimelineIndicator
          className={cn(
            "flex size-6 items-center justify-center border-none bg-transparent ring-0",
            "group-data-[orientation=vertical]/timeline:-left-7",
          )}
        >
          <Skeleton className="size-6 rounded-full" />
        </TimelineIndicator>
      </TimelineHeader>
      <TimelineContent className="mt-2">
        <Frame stacked dense spacing="sm">
          <FrameHeader className="flex grow flex-row items-center justify-between gap-2">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="size-4 rounded-sm" />
          </FrameHeader>
          <FramePanel>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          </FramePanel>
        </Frame>
      </TimelineContent>
    </TimelineItem>
  );
}

export function ActivityLogsTimelineSkeleton({
  className,
  itemCount = 3,
}: ActivityLogsTimelineSkeletonProps) {
  return (
    <div className={cn(className)}>
      <Timeline defaultValue={itemCount}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <ActivityLogTimelineItemSkeleton key={index} />
        ))}
      </Timeline>
    </div>
  );
}
