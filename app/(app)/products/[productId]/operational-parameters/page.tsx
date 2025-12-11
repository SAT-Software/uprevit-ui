"use client";

import { Button } from "@/components/ui/button";
import OperationalParametersDataGridRef, {
  OperationalParametersDataGridRefRef,
} from "@/features/workspace/products/product/operational-parameters/OperationalParametersDataGrid";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiFloppyDiskDuotone,
  PiSlidersHorizontalDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const [isMounted] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const operationalParametersDataGridRef =
    useRef<OperationalParametersDataGridRefRef>(null);

  const { mutate: updateOpsParam } = useUpdateProductTabData();
  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "operational-parameters"
  );

  // Fetch Product Information for breadcrumb
  const { data: productInfoData } = useGetProductTabData(
    productId,
    "product-information"
  );

  const productName =
    productInfoData?.result?.data?.data?.product_name || "Product";

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    productInfoData?.result?.data?.product_data?.data?.status === "submitted";

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
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
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
          <span className="text-foreground font-medium">
            Operational Parameters
          </span>
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiWarningCircleDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Operational Parameters
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

  const operationalParametersData = data?.result?.data?.data;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const savedData = operationalParametersDataGridRef.current?.saveData();

      const updateOpsParamData = {
        id: productId,
        action: "add_operational_parameters",
        tab: "operational-parameters",
        data: {
          workbook_data: savedData,
        },
      };

      updateOpsParam(updateOpsParamData, {
        onSuccess: () => {
          setIsSaving(false);
          toast.success("Operational parameters saved successfully");
          console.log("Saved data:", savedData);
          console.log("Stringified data:", JSON.stringify(savedData, null, 2));
        },
        onError: (error) => {
          setIsSaving(false);
          console.error("Failed to update operational parameters:", error);
          toast.error("Failed to save the operational parameters");
        },
      });
    } catch (error) {
      setIsSaving(false);
      console.error("Save error:", error);
      toast.error("Failed to save the operational parameters");
    }
  };

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
          Operational Parameters
        </span>
      </div>

      <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full overflow-hidden">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-4 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Operational Parameters</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage operational parameters in the spreadsheet below
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
            <OperationalParametersDataGridRef
              ref={operationalParametersDataGridRef}
              operationalParametersData={operationalParametersData}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-muted">
                  <PiSlidersHorizontalDuotone className="w-10 h-10 text-muted-foreground" />
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
