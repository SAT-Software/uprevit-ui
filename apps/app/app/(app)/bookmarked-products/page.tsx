"use client";

import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import { Button } from "@uprevit/ui/components/ui/button";
import { useRouter } from "next/navigation";
import DialogCreateFolder from "@/features/workspace/bookmarks/DialogCreateFolder";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import {
  PiFolderDuotone,
  PiBookmarkSimpleDuotone,
  PiWarningCircleDuotone,
  PiArrowClockwiseDuotone,
} from "react-icons/pi";

interface BookmarkFolder {
  _id: string;
  folder_name: string;
  products: string[];
}

function FolderLoadingCard() {
  return (
    <Card className="shadow-sm border-border">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center animate-pulse">
            <PiFolderDuotone className="w-6 h-6 text-muted-foreground/30" />
          </div>
          <div className="px-2.5 py-1 rounded-full bg-muted w-16 h-6 animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-5 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

function FolderErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-[300px] py-8 border border-dashed border-destructive/20 rounded-xl bg-destructive/5">
      <div className="flex items-center justify-center p-4 bg-background rounded-full shadow-sm border border-destructive/20">
        <PiWarningCircleDuotone className="w-10 h-10 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-base font-semibold text-foreground">
          Failed to load bookmark folders
        </p>
        <p className="text-sm text-muted-foreground">
          Something went wrong. Please try again.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
        <PiArrowClockwiseDuotone className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
}

function BookmarkedProductsPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetAllUserBookmarkFolders();

  const allBookmarkFolders = data?.result?.bookmarked_product_folders;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full overflow-y-auto">
          <div className="flex flex-wrap gap-2 items-center w-full justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">Bookmarked Products</h1>
              <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Manage your product collections and bookmarks
              </p>
            </div>
            <div className="h-8 w-28 bg-muted rounded-md animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {[...Array(8)].map((_, index) => (
              <FolderLoadingCard key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full overflow-y-auto">
          <div className="flex flex-wrap gap-2 items-center w-full justify-between shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold">Bookmarked Products</h1>
              <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
              <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                Manage your product collections and bookmarks
              </p>
            </div>
            <DialogCreateFolder />
          </div>

          <FolderErrorState onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full overflow-y-auto">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Bookmarked Products</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Manage your product collections and bookmarks
            </p>
          </div>
          <DialogCreateFolder />
        </div>

        {allBookmarkFolders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] w-full gap-4 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/5">
            <div className="p-4 rounded-full bg-muted/30">
              <PiBookmarkSimpleDuotone className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-lg font-medium text-foreground">
                No bookmark folders yet
              </p>
              <p className="text-sm">
                Create a folder to start saving products
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {allBookmarkFolders?.map((folder: BookmarkFolder) => (
              <Card
                key={folder._id}
                className="group cursor-pointer border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                onClick={() =>
                  router.push(`/bookmarked-products/${folder._id}`)
                }
              >
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-accent border border-border flex items-center justify-center group-hover:bg-accent/80 transition-colors">
                      <PiFolderDuotone className="w-6 h-6 group-hover:text-primary transition-colors delay-100 duration-200 ease-in-out" />
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground transition-colors border border-transparent group-hover:border-border">
                      {folder.products.length} items
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                      {folder.folder_name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Click to view products
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookmarkedProductsPage;
