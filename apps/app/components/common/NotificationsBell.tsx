"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import {
  ArrowRight01Icon,
  BellIcon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { cn } from "@uprevit/ui/lib/utils";
import { GuardedLink } from "@/components/common/GuardedLink";
import { NotificationTypeIcon } from "@/components/common/NotificationTypeIcon";
import {
  NOTIFICATIONS_PREVIEW_LIMIT,
  useMarkNotificationsRead,
  useNotifications,
} from "@/hooks/notifications/useNotifications";
import type { AppNotification } from "@/types/notification";

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const { data, isPending, isError } = useNotifications();
  const { mutate: markRead, isPending: isMarking } = useMarkNotificationsRead();

  const notifications = data?.result.notifications ?? [];
  const unreadCount = data?.result.unreadCount ?? 0;

  const markOpened = (notification: AppNotification) => {
    if (!notification.readAt) markRead({ ids: [notification._id] });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Icon icon={BellIcon} size={18} />
          {unreadCount > 0 ? (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-white tabular-nums">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex max-h-(--radix-popover-content-available-height) w-[min(20rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-xl p-0"
        align="end"
        sideOffset={8}
        collisionPadding={8}
      >
        <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b ps-3 pe-1.5">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Notifications</p>
            {unreadCount > 0 ? (
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-medium leading-none text-muted-foreground tabular-nums">
                {unreadCount} new
              </span>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            disabled={unreadCount === 0 || isMarking}
            onClick={() => markRead({ all: true })}
          >
            <Icon icon={TickDouble02Icon} size={14} />
            Mark all read
          </Button>
        </div>

        <div className="min-h-0 max-h-[400px] overflow-y-auto p-1">
          {isPending ? (
            Array.from({ length: NOTIFICATIONS_PREVIEW_LIMIT }, (_, index) => (
              <div key={index} className="flex h-14 items-center gap-3 px-2">
                <Skeleton className="size-7 shrink-0 rounded-md" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-2.5 w-1/4" />
                </div>
              </div>
            ))
          ) : isError && !data ? (
            <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">
              Failed to load notifications.
            </p>
          ) : notifications.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2 text-center">
              <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <Icon icon={BellIcon} size={16} />
              </span>
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isUnread = !notification.readAt;
              return (
                <GuardedLink
                  key={notification._id}
                  href="/notifications"
                  title={[notification.title, notification.body]
                    .filter(Boolean)
                    .join("\n")}
                  onClick={() => setOpen(false)}
                  onNavigateAccepted={() => markOpened(notification)}
                  className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/60"
                >
                  <NotificationTypeIcon type={notification.type} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span
                      className={cn(
                        "line-clamp-2 text-[13px] leading-snug",
                        isUnread
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground/80">
                      {formatDistanceToNowStrict(
                        new Date(notification.createdAt),
                        { addSuffix: true },
                      )}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      isUnread ? "bg-primary" : "bg-transparent",
                    )}
                  />
                </GuardedLink>
              );
            })
          )}
        </div>

        <div className="shrink-0 border-t p-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-center text-xs"
          >
            <GuardedLink href="/notifications" onClick={() => setOpen(false)}>
              View all notifications
              <Icon icon={ArrowRight01Icon} size={14} />
            </GuardedLink>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
