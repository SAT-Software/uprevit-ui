"use client";

import ProductComponentDetailsTable from "@/features/workspace/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/workspace/products/product/component-details/AddComponentDialog";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";

interface ComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
  _isFromDiff?: boolean;
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

export default function Page() {
  const { productId } = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const isRedlineView = searchParams.get("view") === "redline";

  const {
    data: componentsData,
    isLoading,
    error: componentsError,
  } = useGetProductTabData(productId as string, "label-components");

  // Only fetch redline data when in redline view
  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    isRedlineView
  );

  const isSubmitted =
    componentsData?.result?.data?.product_data?.data?.status === "submitted";

  // Filter diffs for label_components only
  const allDiffs = diffData?.result?.diffs || [];
  const labelComponentDiffs = allDiffs.filter((d: any) =>
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

  const currentComponents = (componentsData?.result?.data?.data || []).map(
    (item: LabelComponentItem) => ({
      _id: item._id,
      component_number: item.component_number || "",
      image: item.image || "",
      component_description: item.component_description || "",
      label_type: item.label_type || [],
      dimensions: item.dimensions || "",
      component_type: item.component_type || "",
    })
  ) as ComponentItem[];

  // Merge with added items from diffs for redline view
  const components = (() => {
    if (!isRedlineView) return currentComponents;

    // Find whole-item additions (e.g., label_components.data[1] added)
    const addedItems = labelComponentDiffs
      .filter(
        (d: any) =>
          d.path.match(/^label_components\.data\[\d+\]$/) &&
          d.status === "added" &&
          d.new_value
      )
      .map((d: any) => ({
        _id: d.new_value._id || `diff-${d.path}`,
        component_number: d.new_value.component_number || "",
        image: d.new_value.image || "",
        component_description: d.new_value.component_description || "",
        label_type: d.new_value.label_type || [],
        dimensions: d.new_value.dimensions || "",
        component_type: d.new_value.component_type || "",
        _isFromDiff: true,
      }));

    return [...currentComponents, ...addedItems];
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
          <div className="flex items-center justify-between border-b border-border py-2 px-3">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Label Components</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Manage label components for this product
              </p>
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
            diffs={labelComponentDiffs}
          />
        </div>
      </div>
    </div>
  );
}
