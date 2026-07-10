"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DashboardBrowsingIcon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Tabs, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";

const platformAdminTabTriggerClassName =
  "flex-none h-7 shrink-0 rounded-lg px-2 text-sm font-medium text-foreground/40 shadow-none transition-colors hover:text-foreground/60 data-[state=active]:bg-foreground/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:data-[state=active]:!bg-foreground/[0.08] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[9px] after:z-10 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100";

const tabs = [
  {
    value: "overview",
    href: "/platform-admin",
    label: "Overview",
    icon: DashboardBrowsingIcon,
    exact: true,
  },
  {
    value: "workspaces",
    href: "/platform-admin/workspaces",
    label: "Workspaces",
    icon: DashboardSquare01Icon,
  },
];

export function PlatformAdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    tabs.find((tab) =>
      tab.exact
        ? pathname === tab.href
        : pathname === tab.href || pathname.startsWith(`${tab.href}/`),
    )?.value ?? "overview";

  const handleTabChange = (value: string) => {
    const tab = tabs.find((item) => item.value === value);
    if (tab) router.push(tab.href);
  };

  return (
    <div className="flex shrink-0 items-end border-b border-border px-2 py-2">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line" className="h-auto gap-0.5 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={platformAdminTabTriggerClassName}
            >
              <Icon icon={tab.icon} size={14} strokeWidth={2} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
