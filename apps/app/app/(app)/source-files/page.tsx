"use client";

import { useAuth } from "react-oidc-context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DialogAddProductFolder from "@/features/workspace/source-files/DialogAddProductFolder";
import SourceFilesFoldersCard from "@/features/workspace/source-files/SourceFilesFoldersCard";
import ActivityLogsSheet from "@/features/workspace/common/ActivityLogsSheet";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { useGetAllSourceFileFolders } from "@/hooks/source-files/useGetAllSourceFileFolders";
import { useGetBookmarkedSourceFilesFoldersByUserId } from "@/hooks/source-files/useGetBookmarkedSourceFilesFoldersByUserId";
import { SourceFilesFolder } from "@/types/source-files";
import { isAdminProfile } from "@/utils/isAdmin";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";

import { Button } from "@uprevit/ui/components/ui/button";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";

import {
  Folder01Icon,
  FolderAddIcon,
  ProfileIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

interface BookmarkedSourceFilesFolder extends SourceFilesFolder {
  isBookmarked?: boolean;
  parentId?: string | null;
}

const sourceFilesTabTriggerClassName =
  "flex-none h-7 shrink-0 rounded-lg px-2 text-sm font-medium text-foreground/40 shadow-none transition-colors hover:text-foreground/60 data-[state=active]:bg-foreground/[0.08] data-[state=active]:text-foreground data-[state=active]:shadow-none group-data-[variant=line]/tabs-list:data-[state=active]:!bg-foreground/[0.08] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[9px] after:z-10 after:h-0.5 after:rounded-full after:bg-foreground after:opacity-0 data-[state=active]:after:opacity-100";

const SOURCE_FILES_TABS = ["bookmarked", "all-folders"];
type SourceFilesTab = (typeof SOURCE_FILES_TABS)[number];
const DEFAULT_SOURCE_FILES_TAB: SourceFilesTab = "bookmarked";

function isSourceFilesTab(value: string | null): value is SourceFilesTab {
  return SOURCE_FILES_TABS.includes(value as SourceFilesTab);
}

function SourceFilesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab: SourceFilesTab = isSourceFilesTab(tabParam)
    ? tabParam
    : DEFAULT_SOURCE_FILES_TAB;

  const handleTabChange = (value: string) => {
    if (!isSourceFilesTab(value)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", value);

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  const {
    data: foldersData,
    isLoading: foldersLoading,
    isError: foldersError,
    refetch: refetchFolders,
  } = useGetAllSourceFileFolders();

  const allFolders: SourceFilesFolder[] = foldersData?.result ?? [];

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
  ).filter((f) => f.parentId === null);

  // Loading state — matches modern page skeletons
  if (foldersLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Source Files</p>
            <InfoTooltip content="Source file folders let you organize reference documents, images, and assets used across your products." />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center px-3 pt-4">
                  <Skeleton className="h-[78px] w-[92px] rounded-xl" />
                  <Skeleton className="mt-3 h-4 w-20" />
                  <Skeleton className="mt-1.5 h-3 w-14" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3">
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center px-3 pt-4">
                  <Skeleton className="h-[78px] w-[92px] rounded-xl" />
                  <Skeleton className="mt-3 h-4 w-20" />
                  <Skeleton className="mt-1.5 h-3 w-14" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (foldersError) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">Source Files</p>
            <InfoTooltip content="Source file folders let you organize reference documents, images, and assets used across your products." />
          </div>
          <DialogAddProductFolder />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
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
        </div>
      </div>
    );
  }

  const hasAnyFolders = allFolders.length > 0;
  const hasBookmarks = bookmarkedFolders.length > 0;

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {/* Header bar (matches products / departments pattern) */}
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
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
        <div className="flex shrink-0 items-end border-b border-border px-2 py-2">
          <TabsList
            variant="line"
            className="h-auto gap-0.5 bg-transparent p-0"
          >
            <TabsTrigger
              value="bookmarked"
              className={sourceFilesTabTriggerClassName}
            >
              Bookmarked
            </TabsTrigger>
            <TabsTrigger
              value="all-folders"
              className={sourceFilesTabTriggerClassName}
            >
              All Folders
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <TabsContent value="bookmarked" className="mt-0">
            {bookmarkedLoading ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center px-3 pt-4">
                    <Skeleton className="h-[78px] w-[92px] rounded-xl" />
                    <Skeleton className="mt-3 h-4 w-20" />
                    <Skeleton className="mt-1.5 h-3 w-14" />
                  </div>
                ))}
              </div>
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
            {!hasAnyFolders ? (
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
              <SourceFilesFoldersCard
                folders={allFolders}
                variant="large"
                bookmarkedFolderIds={
                  new Set(bookmarkedFolders.map((folder) => folder._id))
                }
              />
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default SourceFilesPage;
