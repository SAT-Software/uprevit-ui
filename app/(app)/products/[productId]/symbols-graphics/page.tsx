"use client";

import SchematicsSymbolsTabs from "@/features/workspace/products/product/graphics-other-components/SchematicsSymbolsTabs";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import {
  PiShapesDuotone,
} from "react-icons/pi";
import type { DiffItem } from "@/utils/deepDiff";

interface SymbolGraphicItem {
  _id: string;
  image: string;
  text: string;
  description: string;
  text_present: boolean;
  label_presence: string[];
  entity: string;
  count?: number;
  _isFromDiff?: boolean;
  _isRemovedFromDiff?: boolean;
  _originalIndex?: number;
}

export default function Page() {
  const { productId } = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  // Fetch all tabs to get both symbols-graphics data and product name
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "all-tabs"
  );

  // Only fetch redline data when compareVersion is in URL
  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    compareVersionId
  );

  console.log("graphics page diff data", diffData);

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    data?.result?.data?.product_information?.product_data?.data?.status ===
    "submitted";

  // Filter diffs for symbols_graphics only
  const allDiffs = diffData?.result?.diffs ?? [];
  const symbolsGraphicsDiffs = allDiffs.filter((d: DiffItem) =>
    d.path.startsWith("symbols_graphics.data")
  );

  console.log("graphics page diff data", symbolsGraphicsDiffs);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-2 items-start justify-between border-b px-3 py-2 border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="px-2">
            <div className="flex gap-0 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 w-32 bg-muted rounded-none first:rounded-l-lg last:rounded-r-lg border border-border animate-pulse"
                />
              ))}
            </div>
            {/* Table Skeleton */}
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 w-full bg-muted rounded-lg animate-pulse"
                />
              ))}
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
                <PiShapesDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Symbols & Graphics
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

  // Get the appropriate data source
  // In redline view, use next_version data for correct ordering (follows new version sequence)
  const symbolsGraphicsData: SymbolGraphicItem[] =
    isRedlineView && diffData?.result?.next_version
      ? (diffData.result.next_version.symbols_graphics?.data as
          | SymbolGraphicItem[]
          | undefined) || []
      : (data?.result?.data?.symbols_graphics?.data as SymbolGraphicItem[]) ||
        [];

  let symbolsGraphics = symbolsGraphicsData || [];

  // In redline view, mark added items and append removed items
  if (isRedlineView && symbolsGraphicsDiffs.length > 0) {
    // Get indices of whole-row additions to mark them
    const addedIndices = new Set(
      symbolsGraphicsDiffs
        .filter(
          (d) =>
            d.path.match(/^symbols_graphics\.data\[\d+\]$/) &&
            d.status === "added"
        )
        .map((d) => {
          const match = d.path.match(/\[(\d+)\]$/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((idx: number) => idx >= 0)
    );

    // Mark added items in the new version data
    symbolsGraphics = symbolsGraphics.map((item, index) => ({
      ...item,
      _isFromDiff: addedIndices.has(index),
    }));

    // Find whole-row removals (items that existed in old version but are deleted)
    // These need to be appended at the end since they don't exist in new version
    const removedItems = symbolsGraphicsDiffs
      .filter(
        (d) =>
          d.path.match(/^symbols_graphics\.data\[\d+\]$/) &&
          d.status === "removed" &&
          d.old_value
      )
      .map((d) => ({
        ...(d.old_value as SymbolGraphicItem),
        _isRemovedFromDiff: true,
      }));

    // Append removed items at the end
    symbolsGraphics = [...symbolsGraphics, ...removedItems];
  }

  // Group items by normalized entity (lowercase), preserving original index for diff lookups
  const entityGroups: Record<string, SymbolGraphicItem[]> = {};
  symbolsGraphics.forEach((item, index) => {
    const key = item.entity.toLowerCase();
    if (!entityGroups[key]) {
      entityGroups[key] = [];
    }
    // Preserve original index for correct diff path matching
    entityGroups[key].push({
      ...item,
      _originalIndex: item._originalIndex ?? index,
    });
  });

  // Map grouped data to expected prop names for SchematicsSymbolsTabs
  const schematicsData = (entityGroups["schematics"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    presentOnLabels: item.label_presence,
    _isFromDiff: item._isFromDiff,
    _isRemovedFromDiff: item._isRemovedFromDiff,
    _originalIndex: item._originalIndex,
  }));

  const barcodesData = (entityGroups["barcodes"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    presentOnLabels: item.label_presence,
    count: item.count,
    _isFromDiff: item._isFromDiff,
    _isRemovedFromDiff: item._isRemovedFromDiff,
    _originalIndex: item._originalIndex,
  }));

  const otherComponentsData = (entityGroups["other components"] || []).map(
    (item) => ({
      id: item._id,
      componentName: item.text,
      componentDescription: item.description,
      componentImage: item.image,
      presentOnLabels: item.label_presence,
      _isFromDiff: item._isFromDiff,
      _isRemovedFromDiff: item._isRemovedFromDiff,
      _originalIndex: item._originalIndex,
    })
  );

  // Merge "symbol" and "graphics" entities into symbolsData
  const symbolsData = [...(entityGroups["symbols"] || [])].map((item) => ({
    id: item._id,
    componentName: item.text,
    componentImage: item.image,
    symbolsTextPresent: item.label_presence,
    textPresent: item.text_present,
    _isFromDiff: item._isFromDiff,
    _isRemovedFromDiff: item._isRemovedFromDiff,
    _originalIndex: item._originalIndex,
  }));

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {isRedlineView && (
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${symbolsGraphicsDiffs.length} changes in Symbols & Graphics`}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-0 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        <SchematicsSymbolsTabs
          schematicsData={schematicsData}
          barcodesData={barcodesData}
          otherComponentsData={otherComponentsData}
          symbolsData={symbolsData}
          productId={productId as string}
          isSubmitted={isSubmitted}
          isRedlineView={isRedlineView}
          diffs={symbolsGraphicsDiffs}
        />
      </div>
    </div>
  );
}
