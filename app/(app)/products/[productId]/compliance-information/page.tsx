"use client";

import AddStandardDialog from "@/features/workspace/products/product/compliance-information/AddStandardDialog";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import {
  PiShieldCheckDuotone,
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiCertificateDuotone,
  PiArrowRightBold,
} from "react-icons/pi";
import EditStandardDialog from "@/features/workspace/products/product/compliance-information/EditStandardDialog";
import DeleteStandardDialog from "@/features/workspace/products/product/compliance-information/DeleteStandardDialog";
import Link from "next/link";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { cn } from "@/lib/utils";

interface ComplianceItem {
  _id: string;
  standard: string;
  standard_description: string;
}

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const isRedlineView = searchParams.get("view") === "redline";

  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "all-tabs"
  );

  // Only fetch redline data when ?view=redline is in the URL
  const { data: diffRedlineData, isLoading: diffRedlineLoading } =
    useGetProductDiffRedline(productId, isRedlineView);

  const diffs = diffRedlineData?.result?.diffs || [];

  console.log("Compliance Redline Debug:", {
    isRedlineView,
    diffRedlineLoading,
    diffs,
    diffRedlineData,
  });

  // Helper to find a diff by path (checks multiple possible paths)
  const getDiff = (...paths: string[]) => {
    return diffs.find((d: any) => paths.includes(d.path));
  };

  // Simple inline component for redline display - accepts path and looks up diff
  const RedlineValue = ({
    value,
    path,
    formatFn,
  }: {
    value: string;
    path: string;
    formatFn?: (v: any) => string;
  }) => {
    const diff = getDiff(path);
    if (!isRedlineView || !diff) return <>{value}</>;
    const format = formatFn || ((v: any) => v?.toString() || "");

    const isRemoved = diff.status === "removed";
    const isAdded = diff.status === "added";

    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        {/* Old value - show for modified and removed */}
        {(diff.old_value !== null || isRemoved) && (
          <span className="relative group/old">
            <span className="line-through text-sm text-red-600/70 bg-red-100/50 dark:bg-red-900/10 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-800/20">
              {format(diff.old_value) || ""}
            </span>
          </span>
        )}

        {/* Arrow separator for modified */}
        {diff.old_value !== null &&
          diff.new_value !== null &&
          !isRemoved &&
          !isAdded && (
            <PiArrowRightBold className="text-muted-foreground/50 text-xs" />
          )}

        {/* New value - show for modified and added */}
        {(diff.new_value !== null || isAdded) && !isRemoved && (
          <span className="text-sm text-blue-700 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-semibold border border-blue-200 dark:border-blue-800/30 shadow-sm">
            {format(diff.new_value) || ""}
          </span>
        )}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between border-b p-6 border-border">
            <div className="flex items-center gap-2">
              <div className="h-5 w-48 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>

          {/* Content Skeleton */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 p-4 border border-border rounded-xl bg-card"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
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
            Compliance Information
          </span>
        </div>

        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiShieldCheckDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Standards
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

  const currentStandards =
    (data?.result?.data?.compliance_information?.data as ComplianceItem[]) ||
    [];

  // Merge current standards with added items from diffs (for redline view)
  const standards = (() => {
    if (!isRedlineView) return currentStandards;

    // Find all added items from diffs
    const addedItems = diffs
      .filter(
        (d: any) =>
          d.path.startsWith("compliance_information.data[") &&
          d.status === "added" &&
          d.new_value
      )
      .map((d: any) => ({
        ...d.new_value,
        _isFromDiff: true, // Mark as added from diff
        _diffPath: d.path,
      }));

    // Combine current standards with added items
    return [...currentStandards, ...addedItems];
  })();

  const productName =
    data?.result?.data?.product_information?.data?.product_name || "Product";

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    data?.result?.data?.product_information?.product_data?.data?.status ===
    "submitted";

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {/* Redline Mode Banner */}
      {isRedlineView && (
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {diffRedlineLoading
              ? "Loading changes..."
              : `Redline View: Total ${diffs.length} changes detected`}
          </span>
          <span className="text-muted-foreground text-xs">
            (comparing with previous version)
          </span>
        </div>
      )}

      <div className="flex flex-col gap-2 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-border p-2">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Compliance Standards</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Regulatory standards and certifications for this product
            </p>
          </div>
          <AddStandardDialog productId={productId} isSubmitted={isSubmitted} />
        </div>

        {/* Standards Content */}
        <div className="px-2">
          {standards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="p-4 rounded-full bg-muted">
                <PiCertificateDuotone className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  No Standards Added
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Add compliance standards and certifications to track
                  regulatory requirements for this product.
                </p>
              </div>
              <AddStandardDialog
                productId={productId}
                isSubmitted={isSubmitted}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {standards.map((item: any, idx) => {
                // Check if this item came from diff (added in V2)
                const isFromDiff = item._isFromDiff === true;

                // Check for item-level diff (whole item added/removed)
                const itemDiff = isFromDiff
                  ? { status: "added" } // Items from diff are always "added"
                  : getDiff(`compliance_information.data[${idx}]`);

                // Check for field-level diffs (property modified)
                const standardDiff = getDiff(
                  `compliance_information.data[${idx}].standard`
                );
                const descDiff = getDiff(
                  `compliance_information.data[${idx}].standard_description`
                );

                // Determine card status based on diffs
                const isAdded = isFromDiff || itemDiff?.status === "added";
                const isRemoved = itemDiff?.status === "removed";
                const isModified =
                  !isAdded &&
                  !isRemoved &&
                  (standardDiff?.status === "modified" ||
                    descDiff?.status === "modified");
                const hasAnyDiff = isAdded || isRemoved || isModified;

                return (
                  <div
                    key={item._id}
                    className={cn(
                      "flex flex-col gap-3 p-4 border rounded-xl bg-card hover:bg-accent/5 transition-all duration-200 group",
                      isRedlineView &&
                        isRemoved &&
                        "border-red-500/50 bg-red-100/5 opacity-60",
                      isRedlineView &&
                        isAdded &&
                        "border-blue-500/50 bg-blue-100/5",
                      isRedlineView &&
                        isModified &&
                        "border-amber-500/50 bg-amber-100/10",
                      !isRedlineView || !hasAnyDiff ? "border-border" : ""
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg bg-green-500/10 text-green-600 group-hover:bg-green-500/20 transition-colors",
                            isRedlineView &&
                              isRemoved &&
                              "bg-red-200/40 text-destructive",
                            isRedlineView &&
                              isAdded &&
                              "bg-blue-200/40 text-blue-500",
                            isRedlineView &&
                              isModified &&
                              "bg-amber-200/40 text-amber-500"
                          )}
                        >
                          <PiShieldCheckDuotone className="w-4 h-4" />
                        </div>
                        <span
                          className={cn(
                            "font-semibold text-base text-foreground truncate",
                            isRedlineView &&
                              isRemoved &&
                              "line-through text-red-500/70"
                          )}
                        >
                          <RedlineValue
                            value={item.standard}
                            path={`compliance_information.data[${idx}].standard`}
                          />
                        </span>
                        {isRedlineView && isAdded && (
                          <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full shadow-sm">
                            NEW
                          </span>
                        )}
                        {isRedlineView && isRemoved && (
                          <span className="text-[10px] font-bold tracking-wider text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full shadow-sm">
                            REMOVED
                          </span>
                        )}
                        {isRedlineView && isModified && (
                          <span className="text-[10px] font-bold tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full shadow-sm">
                            MODIFIED
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <EditStandardDialog
                          productId={productId}
                          standards={item}
                          isSubmitted={isSubmitted}
                        />
                        <DeleteStandardDialog
                          productId={productId}
                          standardId={item._id}
                          standardName={item.standard}
                          isSubmitted={isSubmitted}
                        />
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-sm text-muted-foreground leading-relaxed line-clamp-3",
                        isRedlineView &&
                          isRemoved &&
                          "line-through text-red-500/70"
                      )}
                    >
                      <RedlineValue
                        value={
                          item.standard_description ||
                          "No description provided."
                        }
                        path={`compliance_information.data[${idx}].standard_description`}
                      />
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
