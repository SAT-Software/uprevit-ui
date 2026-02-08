"use client";

import ProductComponentDetailsTable from "@/features/workspace/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/workspace/products/product/component-details/AddComponentDialog";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import type { DiffItem } from "@/utils/deepDiff";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";

interface ComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
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
  label_type: string[];
  dimensions: string;
  component_type: string;
}

const mapComponentItem = (item: LabelComponentItem): ComponentItem => ({
  _id: item._id,
  component_number: item.component_number || "",
  image: item.image || "",
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

  // Only fetch redline data when compareVersion is in URL
  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    compareVersionId
  );

  const isSubmitted =
    componentsData?.result?.data?.product_data?.data?.status === "submitted";

  // Filter diffs for label_components only
  const allDiffs = diffData?.result?.diffs ?? [];
  const labelComponentDiffs = allDiffs.filter((d: DiffItem) =>
    d.path.startsWith("label_components.data")
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="p-6">
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (componentsError) {
    return (
      <div className="flex flex-col gap-4 p-4 text-destructive">
        Error loading label components: {componentsError.message}
      </div>
    );
  }

  const currentComponentsRaw =
    (componentsData?.result?.data?.data ?? []) as LabelComponentItem[];
  const currentComponents = currentComponentsRaw.map(mapComponentItem);
  const hasDiffVersions = Boolean(
    diffData?.result?.base_version && diffData?.result?.next_version
  );
  const baseComponents =
    hasDiffVersions
      ? ((diffData?.result?.base_version?.label_components?.data ??
          []) as LabelComponentItem[])
      : [];
  const nextComponents =
    hasDiffVersions
      ? ((diffData?.result?.next_version?.label_components?.data ??
          []) as LabelComponentItem[])
      : [];

  const components = (() => {
    if (!isRedlineView || !hasDiffVersions) return currentComponents;

    const redlineItems = buildRedlineArray(baseComponents, nextComponents, {
      getId: (item) => item._id,
      getParentId: (item) => {
        const parentId = (item as { parent_id?: string | null }).parent_id;
        return parentId ? String(parentId) : undefined;
      },
      getFallbackKey: (item) =>
        `${item.component_number}-${item.component_type}`,
    });

    return redlineItems
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
    <div className="flex flex-col gap-2 p-2 h-full">
      {/* Redline Mode Banner */}
      {isRedlineView && (
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${labelComponentDiffs.length} changes in Label Components`}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between border-b border-border p-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Label Components</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Manage label components for this product
              </p>
              <PageInfoDialog
                title="Label Components"
                content="Add and organize label components such as labels, tags, stickers, and packaging materials for your product."
              />
            </div>
            <AddComponentDialog
              productId={productId as string}
              isSubmitted={isSubmitted}
            />
          </div>
          <ProductComponentDetailsTable
            data={components}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
        </div>
      </div>
    </div>
  );
}
