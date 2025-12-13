"use client";

import { Button } from "@/components/ui/button";
import ProductDataGrid, {
  ProductDataGridRef,
} from "@/features/workspace/products/product/product-data/ProductDataGrid";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiFloppyDiskDuotone,
  PiTableDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";
import dynamic from "next/dynamic";

// Dynamic import for read-only viewer (SSR disabled) - reusing from operational-parameters
const UniverReadOnlyViewer = dynamic(
  () =>
    import(
      "@/features/workspace/products/product/operational-parameters/UniverReadOnlyViewer"
    ),
  { ssr: false }
);

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const isRedlineView = searchParams.get("view") === "redline";

  const [isMounted] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const productDataGridRef = useRef<ProductDataGridRef>(null);

  const { mutate: updateProductDataTab } = useUpdateProductTabData();
  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "product-data"
  );

  // Fetch Product Information for breadcrumb
  const { data: productInfoData } = useGetProductTabData(
    productId,
    "product-information"
  );

  // Fetch redline diff data when in redline view
  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId,
    isRedlineView
  );

  const productName =
    productInfoData?.result?.data?.data?.product_name || "Product";

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    productInfoData?.result?.data?.product_data?.data?.status === "submitted";

  // Extract base and next version workbook data for redline view
  const baseVersionWorkbook =
    diffData?.result?.base_version?.product_data?.data?.workbook_data;
  const nextVersionWorkbook =
    diffData?.result?.next_version?.product_data?.data?.workbook_data;

  // Filter diffs for product_data only
  const allDiffs = diffData?.result?.diffs || [];
  const productDataDiffs = allDiffs.filter((d: any) =>
    d.path.startsWith("product_data")
  );

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
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-7 w-28 bg-muted rounded-lg animate-pulse" />
          </div>
          {/* Content Skeleton */}
          <div className="px-4 pb-4 flex-1">
            <div className="h-full w-full bg-muted rounded-xl animate-pulse" />
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
          <span className="text-foreground font-medium">Product Data</span>
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiWarningCircleDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Product Data
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

  const productTabData = data?.result?.data?.data;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const savedData = productDataGridRef.current?.saveData();

      const productTabDataData = {
        id: productId,
        action: "add_product_data",
        tab: "product-data",
        data: {
          workbook_data: savedData,
        },
      };

      updateProductDataTab(productTabDataData, {
        onSuccess: () => {
          setIsSaving(false);
          toast.success("Product Data saved successfully");
          console.log("Saved data:", savedData);
          console.log("Stringified data:", JSON.stringify(savedData, null, 2));
        },
        onError: (error) => {
          setIsSaving(false);
          console.error("Failed to update product information:", error);
          toast.error("Failed to save the product data");
        },
      });
    } catch (error) {
      setIsSaving(false);
      console.error("Save error:", error);
      toast.error("Failed to save the product data");
    }
  };

  // Render redline view with side-by-side comparison
  if (isRedlineView) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        {/* Redline Mode Banner */}
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {isLoadingDiff
              ? "Loading changes..."
              : `Redline View: ${productDataDiffs.length} changes in Product Data`}
          </span>
          <span className="text-muted-foreground text-xs">
            (comparing spreadsheet versions side by side)
          </span>
        </div>

        <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center justify-between border-b border-border p-4 shrink-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Product Data</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Side-by-side comparison view (read-only)
              </p>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="flex-1 overflow-hidden p-4">
            {isLoadingDiff ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 rounded-full bg-muted animate-pulse">
                    <PiTableDuotone className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Loading comparison data...
                  </p>
                </div>
              </div>
            ) : !baseVersionWorkbook && !nextVersionWorkbook ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="p-4 rounded-full bg-muted">
                    <PiTableDuotone className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      No Previous Version
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      This appears to be the first version or there is no
                      previous comparison data available.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Left: Previous Version */}
                <div className="flex flex-col h-full min-h-0">
                  <UniverReadOnlyViewer
                    workbookData={baseVersionWorkbook}
                    label="PREVIOUS VERSION"
                    variant="old"
                  />
                </div>

                {/* Right: New Version */}
                <div className="flex flex-col h-full min-h-0">
                  <UniverReadOnlyViewer
                    workbookData={nextVersionWorkbook}
                    label="NEW VERSION"
                    variant="new"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal edit view
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-4 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Product Data</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage product data in the spreadsheet below
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleSave}
            disabled={isSaving || isSubmitted}
          >
            <PiFloppyDiskDuotone />
            {isSaving ? "Saving..." : "Save Data"}
          </Button>
        </div>

        {/* Spreadsheet Content */}
        <div className="flex-1 overflow-hidden">
          {isMounted ? (
            <ProductDataGrid
              ref={productDataGridRef}
              productTabData={productTabData}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <PiTableDuotone className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Loading spreadsheet...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
