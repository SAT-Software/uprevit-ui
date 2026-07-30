"use client";

import ProductComponentDetailsTable from "@/features/workspace/products/product/component-details/ProductComponentDetailsTable";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import type { DiffItem } from "@/utils/deepDiff";
import { countChangedRedlineItems } from "@/utils/redlineCounts";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";
import { redlineBannerText } from "@/utils/redlineStyles";
import { cn } from "@uprevit/ui/lib/utils";

interface ComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  key?: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
}

interface LabelComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  key?: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
}

const mapComponentItem = (item: LabelComponentItem): ComponentItem => ({
  _id: item._id,
  component_number: item.component_number || "",
  image: item.image || "",
  key: item.key,
  component_description: item.component_description || "",
  label_type: item.label_type || [],
  dimensions: item.dimensions || "",
  component_type: item.component_type || "",
});

export default function Page() {
  const { productId } = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  const {
    data: componentsData,
    isLoading,
    error: componentsError,
  } = useGetProductTabData(productId as string, "label-components");

  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    compareVersionId,
  );

  const isSubmitted =
    componentsData?.result?.data?.product_data?.data?.status === "submitted";

  if (isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-7 w-36 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-64 w-full animate-pulse bg-muted/40" />
        </div>
      </div>
    );
  }

  if (componentsError) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-destructive">
        Error loading label components: {componentsError.message}
      </div>
    );
  }

  const currentComponentsRaw = (componentsData?.result?.data?.data ??
    []) as LabelComponentItem[];
  const currentComponents = currentComponentsRaw.map(mapComponentItem);
  const hasDiffVersions = Boolean(
    diffData?.result?.base_version && diffData?.result?.next_version,
  );
  const baseComponents = hasDiffVersions
    ? ((diffData?.result?.base_version?.label_components?.data ??
        []) as LabelComponentItem[])
    : [];
  const nextComponents = hasDiffVersions
    ? ((diffData?.result?.next_version?.label_components?.data ??
        []) as LabelComponentItem[])
    : [];
  const componentRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseComponents, nextComponents, {
          getId: (item) => item._id,
          getParentId: (item) => {
            const parentId = (item as { parent_id?: string | null }).parent_id;
            return parentId ? String(parentId) : undefined;
          },
          getFallbackKey: (item) =>
            `${item.component_number}-${item.component_type}`,
        })
      : [];
  const labelComponentChangeCount =
    countChangedRedlineItems(componentRedlineItems);

  const components = (() => {
    if (!isRedlineView || !hasDiffVersions) return currentComponents;

    return componentRedlineItems
      .map((item) => {
        const data = item.next ?? item.base;
        if (!data) return null;
        return {
          ...mapComponentItem(data as LabelComponentItem),
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
        };
      })
      .filter(Boolean) as ComponentItem[];
  })();

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {isRedlineView && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 p-2 text-sm">
          <span className={cn("font-medium", redlineBannerText)}>
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${labelComponentChangeCount} changes in Label Components`}
          </span>
          <span className="text-xs text-muted-foreground">
            (comparing with previous version)
          </span>
        </div>
      )}

      <ProductComponentDetailsTable
        data={components}
        productId={productId as string}
        isSubmitted={isSubmitted}
        isRedlineView={isRedlineView}
      />
    </div>
  );
}
