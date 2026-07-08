"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import ActivityLogsSheet from "@/features/workspace/common/ActivityLogsSheet";
import ArchivedDepartments from "@/features/workspace/archive/departments/ArchivedDepartments";
import ArchivedProjects from "@/features/workspace/archive/projects/ArchivedProjects";
import ArchivedProducts from "@/features/workspace/archive/products/ArchivedProducts";
import {
  Blockchain03Icon,
  KanbanIcon,
  NewOfficeIcon,
  ProfileIcon,
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
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";

const LIST_QUERY_PARAMS = ["page", "limit", "sort", "order", "filters"];

const ARCHIVE_TABS = ["department", "project", "product"] as const;
type ArchiveTab = (typeof ARCHIVE_TABS)[number];
const DEFAULT_ARCHIVE_TAB: ArchiveTab = "department";

const archiveTabTriggerClassName =
  "flex-none h-7 shrink-0 rounded-lg px-2 text-sm font-medium text-foreground/40 shadow-none transition-colors hover:text-foreground/60 data-[state=active]:bg-foreground/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:data-[state=active]:!bg-foreground/[0.08] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[9px] after:z-10 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100";

function isArchiveTab(value: string | null): value is ArchiveTab {
  return ARCHIVE_TABS.includes(value as ArchiveTab);
}

function ArchivePage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;

  const tabParam = searchParams.get("tab");
  const activeTab: ArchiveTab = isArchiveTab(tabParam)
    ? tabParam
    : DEFAULT_ARCHIVE_TAB;

  const handleTabChange = (value: string) => {
    if (!isArchiveTab(value)) return;

    const params = new URLSearchParams(searchParams.toString());
    for (const key of LIST_QUERY_PARAMS) {
      params.delete(key);
    }
    params.set("tab", value);

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Archive</p>
          <InfoTooltip content="Browse and restore archived departments, projects, and products from your workspace." />
        </div>

        {isAdmin ? (
          <ActivityLogsSheet
            scopeType="archive"
            scopeId={workspaceId ?? ""}
            title="Archive Logs"
            tooltip="All the timeline logs for archive activity. When departments, projects, or products were archived or restored. What was updated. The user/admin who took the action. Date and time"
            trigger={
              <Button type="button" variant="outline" size="sm">
                <Icon
                  className="transition-colors delay-100 duration-200 ease-in-out"
                  icon={ProfileIcon}
                  size={16}
                  strokeWidth={2}
                />
                Logs
              </Button>
            }
          />
        ) : null}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
      >
        <div className="flex shrink-0 items-end border-b border-border px-2 py-2">
          <TabsList
            variant="line"
            className="h-auto gap-0.5 bg-transparent p-0"
          >
            <TabsTrigger
              value="department"
              className={archiveTabTriggerClassName}
            >
              <Icon
                icon={NewOfficeIcon}
                size={14}
                strokeWidth={2}
              />
              Departments
            </TabsTrigger>
            <TabsTrigger value="project" className={archiveTabTriggerClassName}>
              <Icon
                icon={KanbanIcon}
                size={14}
                strokeWidth={2}
              />
              Projects
            </TabsTrigger>
            <TabsTrigger value="product" className={archiveTabTriggerClassName}>
              <Icon
                icon={Blockchain03Icon}
                size={14}
                strokeWidth={2}
           
              />
              Products
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <TabsContent value="department" className="mt-2 h-full">
            {activeTab === "department" ? <ArchivedDepartments /> : null}
          </TabsContent>
          <TabsContent value="project" className="mt-2 h-full">
            {activeTab === "project" ? <ArchivedProjects /> : null}
          </TabsContent>
          <TabsContent value="product" className="mt-2 h-full">
            {activeTab === "product" ? <ArchivedProducts /> : null}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default ArchivePage;
