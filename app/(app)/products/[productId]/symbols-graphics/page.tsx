"use client";

import SchematicsSymbolsTabs from "@/features/workspace/products/product/graphics-other-components/SchematicsSymbolsTabs";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import Link from "next/link";
import {
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiShapesDuotone,
} from "react-icons/pi";

interface SymbolGraphicItem {
  _id: string;
  image: string;
  text: string;
  description: string;
  text_present: boolean;
  label_presence: string[];
  entity: string;
}

export default function Page() {
  const { productId } = useParams<{ productId: string }>();

  // Fetch all tabs to get both symbols-graphics data and product name
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "all-tabs"
  );

  const productName =
    data?.result?.data?.product_information?.data?.product_name || "Product";

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
          <div className="h-4 w-36 bg-background rounded animate-pulse" />
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b p-4 border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="px-4">
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
          <span className="text-foreground font-medium">
            Symbols & Graphics
          </span>
        </div>

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

  const symbolsGraphicsData = data?.result?.data?.symbols_graphics?.data || [];
  const symbolsGraphics = (symbolsGraphicsData as SymbolGraphicItem[]) || [];

  // Group items by normalized entity (lowercase)
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
    presentOnLabels: item.label_presence,
  }));

  const barcodesData = (entityGroups["barcodes"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    presentOnLabels: item.label_presence,
  }));

  const otherComponentsData = (entityGroups["other components"] || []).map(
    (item) => ({
      id: item._id,
      componentName: item.text,
      componentDescription: item.description,
      componentImage: item.image,
      presentOnLabels: item.label_presence,
    })
  );

  // Merge "symbol" and "graphics" entities into symbolsData
  const symbolsData = [...(entityGroups["symbols"] || [])].map((item) => ({
    id: item._id,
    componentName: item.text,
    componentImage: item.image,
    symbolsTextPresent: item.label_presence,
    textPresent: item.text_present,
  }));

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
          Symbols & Graphics
        </span>
      </div>

      <div className="flex flex-col gap-0 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        <SchematicsSymbolsTabs
          schematicsData={schematicsData}
          barcodesData={barcodesData}
          otherComponentsData={otherComponentsData}
          symbolsData={symbolsData}
          productId={productId as string}
        />
      </div>
    </div>
  );
}
