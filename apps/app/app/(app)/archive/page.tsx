"use client";

import { ScrollArea, ScrollBar } from "@uprevit/ui/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import ArchivedDepartments from "@/features/workspace/archive/departments/ArchivedDepartments";
import ArchivedProjects from "@/features/workspace/archive/projects/ArchivedProjects";
import ArchivedProducts from "@/features/workspace/archive/products/ArchivedProducts";
import { useState } from "react";
import {
  PiBuildingsDuotone,
  PiClockCounterClockwiseDuotone,
  PiFolderDuotone,
  PiCubeDuotone,
} from "react-icons/pi";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { ActivityLogsPanel } from "@/features/workspace/logs/ActivityLogsPanel";

function ArchivePage() {
  const [activeTab, setActiveTab] = useState("department");
  const [showLogs, setShowLogs] = useState(false);
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const workspaceId = auth.user?.profile?.workspaceId as string | undefined;

  const getTabLabel = () => {
    if (showLogs) return "logs";

    switch (activeTab) {
      case "department":
        return "departments";
      case "project":
        return "projects";
      case "product":
        return "products";
      default:
        return "items";
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <Tabs
        defaultValue="department"
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-0 border border-border bg-background rounded-xl w-full h-full overflow-hidden"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Archive</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium">
              Browse archived {getTabLabel()}
            </p>
          </div>
          {isAdmin ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={showLogs ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setShowLogs((current) => !current)}
                  aria-label={showLogs ? "Show archived items" : "Show archive logs"}
                >
                  <PiClockCounterClockwiseDuotone className="h-4 w-4" />
                  Logs
                </Button>
              </TooltipTrigger>
              <TooltipContent>{showLogs ? "Show Archive" : "Show Logs"}</TooltipContent>
            </Tooltip>
          ) : null}
        </div>

        {!showLogs ? (
          <div className="px-4 py-2">
            <ScrollArea className="w-full">
              <TabsList>
                <TabsTrigger value="department">
                  <PiBuildingsDuotone className="me-1.5 h-4 w-4" />
                  Departments
                </TabsTrigger>
                <TabsTrigger value="project">
                  <PiFolderDuotone className="me-1.5 h-4 w-4" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="product">
                  <PiCubeDuotone className="me-1.5 h-4 w-4" />
                  Products
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ) : null}

        {/* Content */}
        <div className="flex-1 overflow-hidden px-4">
          {showLogs && isAdmin ? (
            <div className="h-full pb-4 pt-4 mt-1 border-t border-border">
              <ActivityLogsPanel
                scopeType="archive"
                scopeId={workspaceId}
                title="Archive Logs"
                description="Track archive and restore activity across departments, projects, and products."
                showHeader={false}
              />
            </div>
          ) : (
            <>
              <TabsContent value="department" className="h-full mt-0 pb-4">
                <ArchivedDepartments onRowClick={(_row: unknown) => undefined} />
              </TabsContent>
              <TabsContent value="project" className="h-full mt-0 pb-4">
                <ArchivedProjects onRowClick={(_row: unknown) => undefined} />
              </TabsContent>
              <TabsContent value="product" className="h-full mt-0 pb-4">
                <ArchivedProducts onRowClick={(_row: unknown) => undefined} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default ArchivePage;
