"use client";

import SchematicsSymbolsTabs from "@/features/workspace/products/product/graphics-other-components/SchematicsSymbolsTabs";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import type { DiffItem } from "@/utils/deepDiff";
import { countChangedRedlineItems } from "@/utils/redlineCounts";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";
import { redlineBannerText } from "@/utils/redlineStyles";
import { cn } from "@uprevit/ui/lib/utils";

interface SymbolGraphicItem {
  _id: string;
  image: string;
  key?: string;
  text: string;
  description: string;
  text_present: boolean;
  label_presence: string[];
  entity: string;
  count?: number;
  standard_symbol_id?: string;
  standard_ref_number?: string;
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
  _redlineBaseImage?: string;
}

export default function Page() {
  const { productId } = useParams<{ productId: string }>();
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  // Fetch all tabs to get both symbols-graphics data and product name
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "all-tabs",
  );

  // Only fetch redline data when compareVersion is in URL
  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId as string,
    compareVersionId,
  );

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    data?.result?.data?.product_information?.product_data?.data?.status ===
    "submitted";

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

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-destructive">
        Error loading symbols & graphics: {error.message}
      </div>
    );
  }

  const currentSymbolsGraphics =
    (data?.result?.data?.symbols_graphics?.data as SymbolGraphicItem[]) || [];
  const hasDiffVersions = Boolean(
    diffData?.result?.base_version && diffData?.result?.next_version,
  );
  const baseSymbolsGraphics = (
    hasDiffVersions
      ? (diffData?.result?.base_version?.symbols_graphics?.data ?? [])
      : []
  ) as SymbolGraphicItem[];
  const nextSymbolsGraphics = (
    hasDiffVersions
      ? (diffData?.result?.next_version?.symbols_graphics?.data ??
        currentSymbolsGraphics)
      : currentSymbolsGraphics
  ) as SymbolGraphicItem[];
  const symbolsGraphicsRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseSymbolsGraphics, nextSymbolsGraphics, {
          getId: (item) => item._id,
          getParentId: (item) => {
            const parentId = (item as { parent_id?: string | null }).parent_id;
            return parentId ? String(parentId) : undefined;
          },
        })
      : [];
  const symbolsGraphicsChangeCount = countChangedRedlineItems(
    symbolsGraphicsRedlineItems,
  );

  const symbolsGraphics = (() => {
    if (!isRedlineView || !hasDiffVersions) return currentSymbolsGraphics;

    return symbolsGraphicsRedlineItems
      .map((item) => {
        const dataItem = item.next ?? item.base;
        if (!dataItem) return null;
        return {
          ...dataItem,
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
          _redlineBaseImage: item.base?.image,
        };
      })
      .filter(Boolean) as SymbolGraphicItem[];
  })();

  const entityGroups: Record<string, SymbolGraphicItem[]> = {};
  symbolsGraphics.forEach((item) => {
    const key = item.entity.toLowerCase();
    if (!entityGroups[key]) {
      entityGroups[key] = [];
    }
    entityGroups[key].push(item);
  });

  // Map grouped data to expected prop names for SchematicsSymbolsTabs
  const schematicsData = (entityGroups["schematics"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    key: item.key,
    presentOnLabels: item.label_presence,
    _redlineStatus: item._redlineStatus,
    _redlineDiffs: item._redlineDiffs,
    _redlineId: item._redlineId,
    _redlineBaseImage: item._redlineBaseImage,
  }));

  const barcodesData = (entityGroups["barcodes"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    key: item.key,
    presentOnLabels: item.label_presence,
    count: item.count,
    _redlineStatus: item._redlineStatus,
    _redlineDiffs: item._redlineDiffs,
    _redlineId: item._redlineId,
    _redlineBaseImage: item._redlineBaseImage,
  }));

  const otherComponentsData = (entityGroups["other components"] || []).map(
    (item) => ({
      id: item._id,
      componentName: item.text,
      componentDescription: item.description,
      componentImage: item.image,
      key: item.key,
      presentOnLabels: item.label_presence,
      _redlineStatus: item._redlineStatus,
      _redlineDiffs: item._redlineDiffs,
      _redlineId: item._redlineId,
      _redlineBaseImage: item._redlineBaseImage,
    }),
  );

  // Merge "symbol" and "graphics" entities into symbolsData
  const symbolsData = [...(entityGroups["symbols"] || [])].map((item) => ({
    id: item._id,
    componentName: item.text,
    componentImage: item.image,
    key: item.key,
    symbolsTextPresent: item.label_presence,
    textPresent: item.text_present,
    standard_symbol_id: item.standard_symbol_id,
    standard_ref_number: item.standard_ref_number,
    _redlineStatus: item._redlineStatus,
    _redlineDiffs: item._redlineDiffs,
    _redlineId: item._redlineId,
    _redlineBaseImage: item._redlineBaseImage,
  }));

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {isRedlineView && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 p-2 text-sm">
          <span className={cn("font-medium", redlineBannerText)}>
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${symbolsGraphicsChangeCount} changes in Symbols & Graphics`}
          </span>
          <span className="text-xs text-muted-foreground">
            (comparing with previous version)
          </span>
        </div>
      )}

      <SchematicsSymbolsTabs
        schematicsData={schematicsData}
        barcodesData={barcodesData}
        otherComponentsData={otherComponentsData}
        symbolsData={symbolsData}
        productId={productId as string}
        isSubmitted={isSubmitted}
        isRedlineView={isRedlineView}
      />
    </div>
  );
}
