"use client";

import LabelTagsTabs from "@/features/workspace/products/product/label-tags/labelTagsTabs";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import {
  PiTagDuotone,
} from "react-icons/pi";
import { LegendItem } from "@/features/workspace/products/product/label-tags/legendTypes";
import type { DiffItem } from "@/utils/deepDiff";
import { countChangedRedlineItems } from "@/utils/redlineCounts";
import type { GetSingleTabResponse, ProductDataContent } from "@/types/product";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";

interface LabelTagItem {
  _id: string;
  name?: string;
  description?: string;
  type?: string;
  image?: string;
  key?: string;
  tagged_image?: string;
  tagged_image_key?: string;
  legend_items?: LegendItem[];
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
}

type LabelTagsResponse = GetSingleTabResponse<LabelTagItem[]>;
type ProductInfoTabData = {
  product_data?: { data?: ProductDataContent };
};
type ProductInfoResponse = { result?: { data?: ProductInfoTabData } };

export default function Page() {
  const { productId } = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

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

  // Only fetch redline data when compareVersion is in URL
  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    compareVersionId
  );

  // Check if product is submitted - disable editing buttons
  const productInfo = (productInfoData as ProductInfoResponse | undefined)
    ?.result?.data;
  const isSubmitted = productInfo?.product_data?.data?.status === "submitted";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-2 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b p-2 border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="px-2">
            <div className="flex gap-0 mb-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-28 bg-muted rounded-none first:rounded-l-lg last:rounded-r-lg border border-border animate-pulse"
                />
              ))}
            </div>
            {/* Content Card Skeleton */}
            <div className="border border-border rounded-xl p-4 space-y-2">
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

  const labelTagsTabData = (data as LabelTagsResponse | undefined)?.result?.data;
  const currentLabelTags = labelTagsTabData?.data ?? [];
  const hasDiffVersions = Boolean(
    diffData?.result?.base_version && diffData?.result?.next_version
  );
  const baseLabelTags =
    hasDiffVersions
      ? ((diffData?.result?.base_version?.label_tags?.data ?? []) as LabelTagItem[])
      : [];
  const nextLabelTags =
    hasDiffVersions
      ? ((diffData?.result?.next_version?.label_tags?.data ?? []) as LabelTagItem[])
      : [];
  const labelTagRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseLabelTags, nextLabelTags, {
          getId: (item) => item._id,
          getParentId: (item) => {
            const parentId = (item as { parent_id?: string | null }).parent_id;
            return parentId ? String(parentId) : undefined;
          },
          getFallbackKey: (item) => `${item.name}-${item.type}`,
        })
      : [];
  const labelTagsChangeCount = countChangedRedlineItems(labelTagRedlineItems);

  const labelTagsData: LabelTagItem[] = (() => {
    if (!isRedlineView || !hasDiffVersions) return currentLabelTags;

    return labelTagRedlineItems
      .map((item) => {
        const dataItem = item.next ?? item.base;
        if (!dataItem) return null;
        return {
          ...dataItem,
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
        };
      })
      .filter(Boolean) as LabelTagItem[];
  })();

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {isRedlineView && (
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${labelTagsChangeCount} changes in Label Tags`}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-0 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        <LabelTagsTabs
          labelTagsData={labelTagsData}
          productId={productId}
          isSubmitted={isSubmitted}
          isRedlineView={isRedlineView}
        />
      </div>
    </div>
  );
}
