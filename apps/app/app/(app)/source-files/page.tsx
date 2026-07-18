"use client";

import { UIEvent, useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import SourceFilesFoldersCard from "@/features/workspace/source-files/SourceFilesFoldersCard";
import ActivityLogsSheet from "@/features/workspace/common/ActivityLogsSheet";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { WorkspaceListControls } from "@/components/table/WorkspaceListControls";
import { useGetBookmarkedSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmarkedSourceFilesFoldersByUserId";
import { useGetSourceFileFoldersInfinite } from "@/hooks/source-files/useGetSourceFileFoldersInfinite";
import { SourceFilesFolder } from "@/types/source-files";
import { isAdminProfile } from "@/utils/isAdmin";
import { isRootSourceFolder } from "@/utils/source-files-list-response";
import {
  ListFilter,
  ListFilterColumn,
  ListOrder,
} from "@/lib/workspace-list-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";

import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

import {
  Folder01Icon,
  FolderAddIcon,
  ProfileIcon,
  SortingAZ01Icon,
  SortingAZ02Icon,
  SortingZA01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string | null;
}

const SOURCE_FILES_TABS = ["bookmarked", "all-folders"];
type SourceFilesTab = (typeof SOURCE_FILES_TABS)[number];
const DEFAULT_SOURCE_FILES_TAB: SourceFilesTab = "bookmarked";

const SOURCE_FILES_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "name", label: "Folder Name", type: "text" },
];

const SOURCE_FILES_SORT_OPTIONS = [
  { value: "name", label: "Folder Name" },
  { value: "_id", label: "Date Created" },
];

function isSourceFilesTab(value: string | null): value is SourceFilesTab {
  return SOURCE_FILES_TABS.includes(value as SourceFilesTab);
}

function SourceFilesFoldersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center px-3 pt-4">
          <Skeleton className="h-[78px] w-[92px] rounded-xl" />
          <Skeleton className="mt-3 h-4 w-20" />
          <Skeleton className="mt-1.5 h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

function SourceFilesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab: SourceFilesTab = isSourceFilesTab(tabParam)
    ? tabParam
    : DEFAULT_SOURCE_FILES_TAB;

  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState<ListOrder>("asc");
  const [filters, setFilters] = useState<ListFilter[]>([]);

  const handleTabChange = (value: string) => {
    if (!isSourceFilesTab(value)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", value);

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const userId = auth?.user?.profile?.userId as string | undefined;
  const workspaceId = auth?.user?.profile?.workspaceId as string | undefined;

  const {
    data: bookmarkedData,
    isLoading: bookmarkedLoading,
    isError: bookmarkedError,
  } = useGetBookmarkedSourceFilesFoldersByUserId(userId as string);

  const bookmarkedFolders = (
    (bookmarkedData?.result ?? []) as BookmarkedSourceFilesFolder[]
  ).filter(isRootSourceFolder);

  const {
    data: infiniteData,
    isLoading: foldersLoading,
    isError: foldersError,
    refetch: refetchFolders,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetSourceFileFoldersInfinite({
    sort,
    order,
    filters,
    enabled: activeTab === "all-folders",
  });

  const allFolders = useMemo(
    () =>
      infiniteData?.pages.flatMap((page) => page?.result?.folders ?? []) ?? [],
    [infiniteData],
  );

  const hasBookmarks = bookmarkedFolders.length > 0;

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (activeTab !== "all-folders") return;

    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Source Files</p>
          <InfoTooltip content="Source file folders let you organize reference documents, images, and assets used across your products." />
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <ActivityLogsSheet
              scopeType="source-files"
              scopeId={workspaceId ?? ""}
              title="Source Files Logs"
              tooltip="All the timeline logs for source files. When folders or files were created or updated. What was updated/created/deleted. The user/admin who took the action. Date and time"
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
          )}

          <DialogAddProductFolder />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex min-h-0 flex-1 flex-col overflow-hidden gap-0"
      >
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-2">
          <TabsList variant="line">
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
            <TabsTrigger value="all-folders">All Folders</TabsTrigger>
          </TabsList>

          {activeTab === "all-folders" && (
            <div className="flex flex-wrap items-center gap-2">
              <WorkspaceListControls
                filters={filters}
                filterColumns={SOURCE_FILES_FILTER_COLUMNS}
                onApplyFilters={setFilters}
                onClearFilters={() => setFilters([])}
              />
              <div className="flex items-center gap-2">
                <Select
                  value={sort}
                  onValueChange={(nextSort) => setSort(nextSort)}
                >
                  <SelectTrigger className="group w-auto truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={SortingAZ01Icon}
                            size={16}
                            strokeWidth={2}
                            className="text-muted-foreground/60 transition-colors delay-100 duration-200 ease-in-out group-hover:text-foreground"
                          />
                          <SelectValue />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>Sort by different fields</TooltipContent>
                    </Tooltip>
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_FILES_SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="text-muted-foreground/60">
                          Sort by:
                        </span>{" "}
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="h-7 px-2 text-xs text-muted-foreground/60 hover:text-muted-foreground"
                      onClick={() =>
                        setOrder((current) =>
                          current === "asc" ? "desc" : "asc",
                        )
                      }
                    >
                      {order === "asc" ? (
                        <Icon
                          icon={SortingAZ02Icon}
                          size={16}
                          strokeWidth={2}
                        />
                      ) : (
                        <Icon
                          icon={SortingZA01Icon}
                          size={16}
                          strokeWidth={2}
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle sort order</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto p-2"
          onScroll={handleScroll}
        >
          <TabsContent value="bookmarked" className="mt-0">
            {bookmarkedLoading ? (
              <SourceFilesFoldersGridSkeleton />
            ) : bookmarkedError ? (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                <span>Failed to load bookmarked folders.</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-destructive hover:text-destructive"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : hasBookmarks ? (
              <SourceFilesFoldersCard
                folders={bookmarkedFolders}
                variant="large"
                showAsBookmarked
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
                  <Icon
                    icon={FolderAddIcon}
                    size={28}
                    strokeWidth={1.75}
                    className="text-muted-foreground/70"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">No bookmarked folders</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Bookmark folders from the All Folders tab for quick access.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-folders" className="mt-0">
            {foldersLoading ? (
              <SourceFilesFoldersGridSkeleton />
            ) : foldersError ? (
              <>
                <DashboardErrorState
                  variant="panel"
                  icon={Folder01Icon}
                  title="Failed to load source files folders"
                  description="Please try again later"
                  className="min-h-[320px]"
                />
                <div className="mt-3 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchFolders()}
                  >
                    Try again
                  </Button>
                </div>
              </>
            ) : allFolders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60">
                  <Icon
                    icon={FolderAddIcon}
                    size={28}
                    strokeWidth={1.75}
                    className="text-muted-foreground/70"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">No folders yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Create your first folder to start organizing source files.
                  </p>
                </div>
                <div className="pt-1">
                  <DialogAddProductFolder />
                </div>
              </div>
            ) : (
              <>
                <SourceFilesFoldersCard
                  folders={allFolders}
                  variant="large"
                  bookmarkedFolderIds={
                    new Set(bookmarkedFolders.map((folder) => folder._id))
                  }
                />
                {isFetchingNextPage ? (
                  <div className="flex items-center justify-center py-6">
                    <Spinner className="size-5" />
                  </div>
                ) : null}
              </>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default SourceFilesPage;
