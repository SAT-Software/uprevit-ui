"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@uprevit/ui/components/ui/card";
import DialogAddProductsToFolder from "@/features/workspace/bookmarks/DialogAddProductsToFolder";
import DialogEditBookmarkFolder from "@/features/workspace/bookmarks/DialogEditBookmarkFolder";
import DialogDeleteBookmarkFolder from "@/features/workspace/bookmarks/DialogDeleteBookmarkFolder";
import DialogRemoveProductBookmark from "@/features/workspace/bookmarks/DialogRemoveProductBookmark";
import { useGetProductsInABookmarkFolder } from "@/hooks/bookmark/useGetProductsInABookmarkFolder";
import { Skeleton } from "@uprevit/ui/components/ui/skeleton";
import { Button } from "@uprevit/ui/components/ui/button";
import { useGetAllUserBookmarkFolders } from "@/hooks/bookmark/useGetAllUserBookmarkFolders";
import {
  PiFolderOpenDuotone,
  PiPackageDuotone,
  PiTagDuotone,
  PiArrowSquareOutDuotone,
  PiBookmarksDuotone,
} from "react-icons/pi";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";

interface BookmarkProduct {
  _id: string;
  product_name: string;
  version: number;
  status: string;
}

export default function FolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderId = params.folderId as string;

  const { data: foldersData } = useGetAllUserBookmarkFolders();
  const bookmarkFolderName =
    foldersData?.result?.bookmarked_product_folders?.find(
      (folder) => folder._id === folderId
    )?.folder_name ?? "";

  const {
    data: folderData,
    isLoading,
    error,
  } = useGetProductsInABookmarkFolder(folderId);

  const products = folderData?.products || [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-md" />
              <Skeleton className="h-5 w-32 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
          <div className="grid gap-3 w-full">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col items-center justify-center gap-4 border border-border bg-background rounded-xl p-4 w-full h-full text-center">
          <div className="text-destructive bg-destructive/10 p-4 rounded-full">
            <PiFolderOpenDuotone className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-semibold">
              Error loading bookmarked products
            </p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/bookmarked-products")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full overflow-y-auto">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center">
              <PiFolderOpenDuotone className="w-4 h-4" />
            </div>
            <h1 className="text-base font-semibold">{bookmarkFolderName}</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Products saved in this bookmark folder
            </p>
          </div>
          <div className="flex items-center gap-1">
            <DialogEditBookmarkFolder
              folderId={folderId}
              currentFolderName={bookmarkFolderName}
            />
            <DialogDeleteBookmarkFolder
              folderId={folderId}
              folderName={bookmarkFolderName}
            />
            <div className="w-px h-6 bg-border mx-1" />
            <DialogAddProductsToFolder
              folderName={bookmarkFolderName}
              folderId={folderId}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] w-full gap-4 text-muted-foreground border border-dashed border-border rounded-xl bg-muted/5">
              <div className="p-4 rounded-full bg-muted/30">
                <PiPackageDuotone className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-lg font-medium text-foreground">
                  No products in this folder yet.
                </p>
                <p className="text-sm">
                  Add products to organize your collection.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 w-full">
              {products.map((product: BookmarkProduct) => (
                <Card
                  key={product._id}
                  className="group hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border-border"
                  onClick={() =>
                    router.push(`/products/${product._id}/product-information`)
                  }
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-secondary/50 flex items-center justify-center border border-border group-hover:border-primary/20 group-hover:bg-primary/5 transition-colors delay-200 duration-200 ease-in-out shrink-0">
                      <PiPackageDuotone className="w-6 h-6 text-foreground/70 group-hover:text-primary transition-colors delay-200 duration-200 ease-in-out" />
                    </div>

                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base truncate">
                          {product.product_name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-normal text-[10px] px-1.5 py-0 h-5",
                            {
                              "bg-green-500/10 text-green-700 border-green-500/20":
                                product.status?.toLowerCase() === "published",
                              "bg-blue-500/10 text-blue-700 border-blue-500/20":
                                product.status?.toLowerCase() === "draft",
                              "bg-gray-500/10 text-gray-700 border-gray-500/20":
                                product.status?.toLowerCase() === "archived",
                            }
                          )}
                        >
                          {product.status || "N/A"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <PiTagDuotone className="w-3.5 h-3.5" />v
                          {product.version}
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/products/${product._id}/product-information`
                          )
                        }
                      >
                        <PiArrowSquareOutDuotone className="w-5 h-5" />
                        View
                      </Button>
                      <DialogRemoveProductBookmark
                        productId={product._id}
                        productName={product.product_name}
                        folderId={folderId}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
