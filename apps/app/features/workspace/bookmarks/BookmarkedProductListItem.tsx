"use client";

import { useRouter } from "next/navigation";
import { Blockchain03Icon } from "@hugeicons/core-free-icons";

import DialogRemoveProductBookmark from "@/features/workspace/bookmarks/DialogRemoveProductBookmark";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";

export interface BookmarkedProduct {
  _id: string;
  product_name: string;
  version: number;
  status: string;
}

function getStatusBadgeVariant(status: string | undefined) {
  const normalized = status?.toLowerCase();

  if (normalized === "submitted" || normalized === "published") {
    return "green" as const;
  }

  if (normalized === "draft") {
    return "blue" as const;
  }

  return "gray" as const;
}

function getStatusDotClass(status: string | undefined) {
  const normalized = status?.toLowerCase();

  if (normalized === "submitted" || normalized === "published") {
    return "bg-green-500 dark:bg-green-400";
  }

  if (normalized === "draft") {
    return "bg-blue-500 dark:bg-blue-400";
  }

  return "bg-gray-500 dark:bg-gray-400";
}

interface BookmarkedProductListItemProps {
  product: BookmarkedProduct;
  folderId: string;
}

export function BookmarkedProductListItem({
  product,
  folderId,
}: BookmarkedProductListItemProps) {
  const router = useRouter();
  const productHref = `/products/${product._id}/product-information`;

  return (
    <>
      <div
        className="group relative w-full flex items-center justify-between cursor-pointer rounded-xl border border-border/60 bg-background transition-colors hover:bg-muted/40 p-2"
        onClick={() => router.push(productHref)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted transition-colors delay-100 duration-200 ease-in-out group-hover:border-border group-hover:bg-muted/80 ">
            <Icon
              icon={Blockchain03Icon}
              className="text-muted-foreground/60 group-hover:text-foreground"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">
                {product.product_name}
              </p>
              <Badge
                variant={getStatusBadgeVariant(product.status)}
                className="shrink-0 font-normal capitalize"
              >
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    getStatusDotClass(product.status),
                  )}
                />
                {product.status || "N/A"}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Version {product.version}
            </p>
          </div>
        </div>
        <div
          className="shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          <DialogRemoveProductBookmark
            productId={product._id}
            productName={product.product_name}
            folderId={folderId}
          />
        </div>
      </div>
    </>
  );
}

export function BookmarkedProductListSkeleton({
  count = 4,
}: {
  count?: number;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-[68px] w-full animate-pulse rounded-xl border border-border/60 bg-muted/20"
        />
      ))}
    </div>
  );
}
