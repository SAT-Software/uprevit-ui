"use client";

import Link from "next/link";
import { Blockchain03Icon } from "@hugeicons/core-free-icons";

import DialogRemoveProductBookmark from "@/features/workspace/bookmarks/DialogRemoveProductBookmark";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import type { ProductStatus } from "@/types/product";

export interface BookmarkedProduct {
  _id: string;
  product_name: string;
  version: number;
  status: ProductStatus;
}

interface BookmarkedProductListItemProps {
  product: BookmarkedProduct;
  folderId: string;
}

export function BookmarkedProductListItem({
  product,
  folderId,
}: BookmarkedProductListItemProps) {
  const productHref = `/products/${product._id}/product-information`;

  return (
    <>
      <div className="group relative w-full flex items-center justify-between rounded-xl border border-border/60 bg-background transition-colors hover:bg-muted/40 p-2 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted transition-colors delay-100 duration-200 ease-in-out group-hover:border-border group-hover:bg-muted/80 ">
            <Icon
              icon={Blockchain03Icon}
              className="text-muted-foreground/60 group-hover:text-foreground"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href={productHref}
                className="truncate text-sm font-medium text-foreground outline-none after:absolute after:inset-0 after:rounded-xl"
                title={product.product_name}
              >
                {product.product_name}
              </Link>
              <ProductStatusBadge status={product.status} className="shrink-0" />
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Version {product.version}
            </p>
          </div>
        </div>
        <div className="relative z-10 shrink-0">
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
