"use client";

import LabelTagsTabs from "@/features/workspace/products/product/label-tags/labelTagsTabs";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import Link from "next/link";
import {
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiTagDuotone,
} from "react-icons/pi";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
}

export default function Page() {
  const { productId } = useParams<{ productId: string }>();

  // Fetch label tags data
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "label-tags"
  );

  // Fetch Product Information for breadcrumb
  const { data: productInfoData } = useGetProductTabData(
    productId as string,
    "product-information"
  );

  const productName =
    productInfoData?.result?.data?.data?.product_name || "Product";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        {/* Breadcrumbs Skeleton */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
          <div className="h-4 w-4 bg-background rounded animate-pulse" />
          <div className="h-3 w-3 bg-background rounded animate-pulse" />
          <div className="h-4 w-20 bg-background rounded animate-pulse" />
          <div className="h-3 w-3 bg-background rounded animate-pulse" />
          <div className="h-4 w-32 bg-background rounded animate-pulse" />
          <div className="h-3 w-3 bg-background rounded animate-pulse" />
          <div className="h-4 w-24 bg-background rounded animate-pulse" />
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b p-4 border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="px-4">
            <div className="flex gap-0 mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-28 bg-muted rounded-none first:rounded-l-lg last:rounded-r-lg border border-border animate-pulse"
                />
              ))}
            </div>
            {/* Content Card Skeleton */}
            <div className="border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
              <div className="h-64 w-full max-w-md bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
          <Link
            href="/dashboard"
            className="hover:text-foreground transition-colors flex items-center"
          >
            <PiHouseDuotone className="w-4 h-4" />
          </Link>
          <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Products
          </Link>
          <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-foreground font-medium">Label Tags</span>
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiTagDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Label Tags
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const labelTagsData: LabelTagItem[] = data?.result?.data?.data || [];

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors flex items-center"
        >
          <PiHouseDuotone className="w-4 h-4" />
        </Link>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <Link
          href="/products"
          className="hover:text-foreground transition-colors"
        >
          Products
        </Link>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="truncate max-w-[200px]">{productName}</span>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          Label Tags
        </span>
      </div>

      <div className="flex flex-col gap-0 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        <LabelTagsTabs labelTagsData={labelTagsData} productId={productId} />
      </div>
    </div>
  );
}
