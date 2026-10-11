"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { NotificationsList } from "@/features/workspace/notifications/NotificationsList";
import {
  useMarkNotificationsRead,
  useNotifications,
} from "@/hooks/notifications/useNotifications";
import {
  MailOpen01Icon,
  Notification01Icon,
  TickDouble02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const NOTIFICATION_TABS = ["all", "unread"] as const;
type NotificationTab = (typeof NOTIFICATION_TABS)[number];

function NotificationsPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useNotifications();
  const { mutate: markRead, isPending: isMarking } = useMarkNotificationsRead();
  const unreadCount = data?.result.unreadCount ?? 0;

  const tabParam = searchParams.get("tab");
  const activeTab: NotificationTab = NOTIFICATION_TABS.includes(
    tabParam as NotificationTab,
  )
    ? (tabParam as NotificationTab)
    : "all";

  const handleTabChange = (value: string) => {
    router.replace(value === "all" ? pathname : `${pathname}?tab=${value}`);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Notifications</p>
          <InfoTooltip content="Updates about products you own or contribute to. Open one to go to its product." />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={unreadCount === 0 || isMarking}
          onClick={() => markRead({ all: true })}
        >
          <Icon icon={TickDouble02Icon} size={16} strokeWidth={2} />
          Mark all as read
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
      >
        <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
          <TabsList variant="line">
            <TabsTrigger value="all">
              <Icon icon={Notification01Icon} size={14} strokeWidth={2} />
              All
            </TabsTrigger>
            <TabsTrigger value="unread">
              <Icon icon={MailOpen01Icon} size={14} strokeWidth={2} />
              Unread
              {unreadCount > 0 ? (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-none tabular-nums text-muted-foreground">
                  {unreadCount}
                </span>
              ) : null}
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl p-4">
            <TabsContent value="all">
              {activeTab === "all" ? <NotificationsList unread={false} /> : null}
            </TabsContent>
            <TabsContent value="unread">
              {activeTab === "unread" ? <NotificationsList unread /> : null}
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

export default NotificationsPage;
