"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";

const tabs = [
  { value: "overview", href: "/platform-admin", label: "Overview", exact: true },
  { value: "workspaces", href: "/platform-admin/workspaces", label: "Workspaces" },
  { value: "audit-logs", href: "/platform-admin/audit-logs", label: "Audit logs" },
];

export function PlatformAdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const onWorkspaceSubpage =
    pathname.startsWith("/platform-admin/workspaces/") &&
    pathname.split("/").length > 4;

  const activeTab = onWorkspaceSubpage
    ? ""
    : (tabs.find((tab) =>
        tab.exact
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(tab.href + "/"),
      )?.value ?? "overview");

  const handleTabChange = (value: string) => {
    const tab = tabs.find((t) => t.value === value);
    if (tab) router.push(tab.href);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
