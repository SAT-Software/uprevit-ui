"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DashboardBrowsingIcon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Tabs, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";

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
    <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <Icon icon={tab.icon} size={14} strokeWidth={2} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
