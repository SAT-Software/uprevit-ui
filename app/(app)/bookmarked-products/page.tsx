"use client";

import { BookmarkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import DialogCreateFolder from "@/features/bookmarks/DialogCreateFolder";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";

interface BookmarkFolder {
  _id: string;
  folder_name: string;
  products: string[];
}

function BookmarkedProductsPage() {
  const router = useRouter();
  const { data } = useGetAllUserBookmarkFolders();

  const allBookmarkFolders = data?.result?.bookmarked_product_folders;

  return (
    <div className="flex flex-col gap-8 p-4 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Bookmarked Products</h2>
          <DialogCreateFolder />
        </div>
        {allBookmarkFolders?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4 text-muted-foreground">
            <BookmarkIcon className="w-16 h-16" />
            <p className="text-lg">
              No bookmark folders yet. Create one to save products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {allBookmarkFolders?.map((folder: BookmarkFolder) => (
              <Card
                key={folder._id}
                className="cursor-pointer shadow-none hover:shadow-none transition-all duration-200 hover:bg-muted/50"
                onClick={() =>
                  router.push(`/bookmarked-products/${folder._id}`)
                }
              >
                <CardContent className="p-6 flex flex-row items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-input flex items-center justify-center">
                    <BookmarkIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="">
                    <p className="font-medium text-sm mb-1">
                      {folder.folder_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {folder.products.length} items
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
