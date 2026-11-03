"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDistanceToNowStrict } from "date-fns";
import { ArrowRight01Icon, BellIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { cn } from "@uprevit/ui/lib/utils";
import { GuardedLink } from "@/components/common/GuardedLink";
import { NotificationTypeIcon } from "@/components/common/NotificationTypeIcon";
import {
  useMarkNotificationsRead,
  useNotificationsInfinite,
} from "@/hooks/notifications/useNotifications";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import type { AppNotification } from "@/types/notification";

function NotificationsListItem({
  notification,
  onOpen,
}: {
  notification: AppNotification;
  onOpen: (notification: AppNotification) => void;
}) {
  const isUnread = !notification.readAt;
  const className = cn(
    "group flex w-full items-start gap-3 px-4 py-3.5 text-start transition-colors hover:bg-accent/40",
    isUnread && "bg-accent/20",
  );
  const content = (
    <>
      <NotificationTypeIcon type={notification.type} className="mt-0.5 size-8" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={cn(
            "text-sm leading-snug",
            isUnread ? "font-medium text-foreground" : "text-foreground/80",
          )}
        >
          {notification.title}
        </span>
        {notification.body ? (
          <span className="text-sm leading-snug text-muted-foreground">
            {notification.body}
          </span>
        ) : null}
        <time
          dateTime={notification.createdAt}
          title={formatToLocalDateTime(notification.createdAt)}
          className="text-xs text-muted-foreground/80"
        >
          {formatDistanceToNowStrict(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </time>
      </span>
      <span className="flex h-8 shrink-0 items-center gap-2">
        {isUnread ? (
          <span className="size-2 rounded-full bg-primary">
            <span className="sr-only">Unread</span>
          </span>
        ) : null}
        {notification.link ? (
          <Icon
            icon={ArrowRight01Icon}
            size={16}
            className="text-muted-foreground/50 transition-colors group-hover:text-foreground"
          />
        ) : null}
      </span>
    </>
  );

  return notification.link ? (
    <GuardedLink
      href={notification.link}
      className={className}
      onNavigateAccepted={() => onOpen(notification)}
    >
      {content}
    </GuardedLink>
  ) : (
    <button
      type="button"
      className={className}
      onClick={() => onOpen(notification)}
    >
      {content}
    </button>
  );
}

export function NotificationsList({ unread }: { unread: boolean }) {
  const {
    data,
    isPending,
    isError,
    isFetchNextPageError,
    isRefetchError,
    hasNextPage,
    fetchNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
  } = useNotificationsInfinite({ unread });
  const { mutate: markRead } = useMarkNotificationsRead();

  const notifications = data?.pages.flatMap((page) => page.result.notifications) ?? [];

  const handleOpen = (notification: AppNotification) => {
    if (!notification.readAt) markRead({ ids: [notification._id] });
  };

  const retryButton = (onRetry: () => void) => (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isFetching}
      onClick={onRetry}
    >
      {isFetching ? <Spinner /> : null}
      Retry
    </Button>
  );

  if (isPending) {
    return (
      <div className="divide-y overflow-hidden rounded-xl border bg-background">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="flex items-start gap-3 px-4 py-3.5">
            <Skeleton className="size-8 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-3/5" />
              <Skeleton className="h-3 w-2/5" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if ((isError && !data) || (notifications.length === 0 && isRefetchError)) {
    return (
      <ErrorState
        variant="panel"
        icon={BellIcon}
        title="Failed to load notifications"
        onRetry={() => refetch()}
        className="min-h-[17.5rem]"
      />
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={BellIcon}
        title={unread ? "No unread notifications" : "No notifications yet"}
        description={
          unread
            ? "You're all caught up"
            : "Product team changes and reviews will show up here"
        }
        className="min-h-[17.5rem]"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="divide-y overflow-hidden rounded-xl border bg-background">
        {notifications.map((notification) => (
          <NotificationsListItem
            key={notification._id}
            notification={notification}
            onOpen={handleOpen}
          />
        ))}
      </div>
      {isFetchNextPageError || isRefetchError ? (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>
            {isFetchNextPageError
              ? "Couldn't load more notifications."
              : "Couldn't refresh notifications."}
          </span>
          {retryButton(() =>
            isFetchNextPageError ? fetchNextPage() : refetch(),
          )}
        </div>
      ) : hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-center"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? <Spinner /> : null}
          Load more
        </Button>
      ) : null}
    </div>
  );
}
