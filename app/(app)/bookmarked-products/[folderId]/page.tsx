"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { FolderIcon } from "lucide-react";
import DialogAddProductsToFolder from "@/features/workspace/bookmarks/DialogAddProductsToFolder";
import DialogEditBookmarkFolder from "@/features/workspace/bookmarks/DialogEditBookmarkFolder";
import DialogDeleteBookmarkFolder from "@/features/workspace/bookmarks/DialogDeleteBookmarkFolder";
import DialogRemoveProductBookmark from "@/features/workspace/bookmarks/DialogRemoveProductBookmark";
import { useGetProductsInABookmarkFolder } from "@/hooks/bookmark/useGetProductsInABookmarkFolder";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";

interface BookmarkProduct {
  _id: string;
  product_name: string;
  master_version: string;
  status: string;
}

export default function FolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId as string;

  const { data: foldersData } = useGetAllUserBookmarkFolders();
  const bookmarkFolderName =
    foldersData?.result?.bookmarked_product_folders?.filter(
      (folder: BookmarkProduct) => folder._id === folderId
    )?.[0]?.folder_name;

  const {
    data: folderData,
    isLoading,
    error,
  } = useGetProductsInABookmarkFolder(folderId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-4 h-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-4 w-64 ml-9" />
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex gap-4 mt-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 p-4 h-full">
        <div className="text-center text-red-600 py-8">
          <p>Error loading bookmarked products</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const products = folderData?.products || [];

  return (
    <div className="flex flex-col gap-8 p-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-semibold">{bookmarkFolderName}</h1>
            <div className="flex items-center gap-1">
              <DialogEditBookmarkFolder
                folderId={folderId}
                currentFolderName={bookmarkFolderName}
              />
              <DialogDeleteBookmarkFolder
                folderId={folderId}
                folderName={bookmarkFolderName}
              />
            </div>
          </div>
          <DialogAddProductsToFolder
            folderName={bookmarkFolderName}
            folderId={folderId}
          />
        </div>
        <p className="text-sm text-muted-foreground ml-9">
          Products saved in this bookmark folder
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {products.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No products in this folder yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((product: BookmarkProduct) => (
              <Card
                key={product._id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{product.product_name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          v{product.master_version}
                        </span>
                        <DialogRemoveProductBookmark
                          productId={product._id}
                          productName={product.product_name}
                          folderId={folderId}
                        />
                        <Button
                          onClick={() =>
                            router.push(
                              `/products/${product._id}/product-information`
                            )
                          }
                          variant="ghost"
                          size="icon"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Status: {product.status}</span>
                    </div>
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
