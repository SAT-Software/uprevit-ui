"use client";

import LabelTagsTabs from "@/features/workspace/products/product/label-tags/labelTagsTabs";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { LegendItem } from "@/features/workspace/products/product/label-tags/legendTypes";
import type { DiffItem } from "@/utils/deepDiff";
import { countChangedRedlineItems } from "@/utils/redlineCounts";
import type { GetSingleTabResponse, ProductDataContent } from "@/types/product";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";
import { cn } from "@uprevit/ui/lib/utils";
import { redlineBannerText } from "@/utils/redlineStyles";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

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
  parent_id?: string | null;
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
  _redlineBaseImage?: string;
  _redlineNextImage?: string;
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

  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "label-tags",
  );

  const { data: productInfoData } = useGetProductTabData(
    productId as string,
    "product-information",
  );

  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    compareVersionId,
  );

  const productInfo = (productInfoData as ProductInfoResponse | undefined)
    ?.result?.data;
  const isSubmitted = productInfo?.product_data?.data?.status === "submitted";

  if (isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="size-3 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-7 w-28 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="flex h-10 shrink-0 items-center border-b border-border px-2">
          <div className="flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-7 w-20 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-hidden p-2">
          <div className="h-full min-h-96 animate-pulse rounded-2xl border border-border bg-muted/30" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <p className="text-sm font-medium">Label Tags</p>
        </div>
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <Icon
                icon={Alert01Icon}
                size={32}
                strokeWidth={1.5}
                className="text-destructive"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-destructive">
                Error Loading Label Tags
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const labelTagsTabData = (data as LabelTagsResponse | undefined)?.result
    ?.data;
  const currentLabelTags = labelTagsTabData?.data ?? [];
  const hasDiffVersions = Boolean(
    diffData?.result?.base_version && diffData?.result?.next_version,
  );
  const baseLabelTags = hasDiffVersions
    ? ((diffData?.result?.base_version?.label_tags?.data ??
        []) as LabelTagItem[])
    : [];
  const nextLabelTags = hasDiffVersions
    ? ((diffData?.result?.next_version?.label_tags?.data ??
        []) as LabelTagItem[])
    : [];
  const labelTagRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseLabelTags, nextLabelTags, {
          getId: (item) => item._id,
          getParentId: (item) => {
            const parentId = (item as { parent_id?: string | null }).parent_id;
            return parentId ? String(parentId) : undefined;
          },
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
          _redlineBaseImage: item.base?.image,
          _redlineNextImage: item.next?.image,
        };
      })
      .filter(Boolean) as LabelTagItem[];
  })();

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {isRedlineView && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 p-2 text-sm">
          <span className={cn("font-medium", redlineBannerText)}>
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${labelTagsChangeCount} changes in Label Tags`}
          </span>
          <span className="text-xs text-muted-foreground">
            (comparing with previous version)
          </span>
        </div>
      )}

      <LabelTagsTabs
        labelTagsData={labelTagsData}
        productId={productId}
        isSubmitted={isSubmitted}
        isRedlineView={isRedlineView}
      />
    </div>
  );
}
