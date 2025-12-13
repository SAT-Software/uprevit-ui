"use client";

import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { notFound, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  PiHouseDuotone,
  PiCaretRightDuotone,
  PiCalendarDuotone,
  PiGlobeDuotone,
  PiFlagDuotone,
  PiBuildingsDuotone,
  PiFlaskDuotone,
  PiTagDuotone,
  PiArrowRightBold,
} from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ProductInformationCustomFieldEditDialog from "@/features/workspace/products/product/product-information/ProductInfoCustomFieldEditDialog";
import EditProductDialog from "@/features/workspace/products/product/product-information/ProductInfoEditProductDialog";
import { AuditLog } from "@/types/audit-log";
import { useMemo } from "react";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const isRedlineView = searchParams.get("view") === "redline";

  const { data, isLoading, isError } = useGetProductTabData(
    productId,
    "product-information"
  );

  // Only fetch redline data when ?view=redline is in the URL
  const { data: diffRedlineData, isLoading: diffRedlineLoading } =
    useGetProductDiffRedline(productId, isRedlineView);

  const diffs = diffRedlineData?.result?.diffs || [];

  // Helper to find a diff by exact path (checks multiple possible paths)
  const getDiff = (...paths: string[]) => {
    return diffs.find((d: any) => paths.includes(d.path));
  };

  // Helper to find all diffs that start with a base path (for custom fields)
  const getFieldDiffs = (basePath: string) => {
    return diffs.filter(
      (d: any) => d.path === basePath || d.path.startsWith(basePath + ".")
    );
  };

  // Helper to get overall status for a field (checks any nested diffs)
  const getFieldStatus = (
    basePath: string
  ): "added" | "removed" | "modified" | null => {
    const fieldDiffs = getFieldDiffs(basePath);
    if (fieldDiffs.length === 0) return null;

    // If the whole field was added/removed
    const wholeDiff = fieldDiffs.find((d: any) => d.path === basePath);
    if (wholeDiff) return wholeDiff.status;

    // If any property was changed, it's modified
    return "modified";
  };

  // Get the value diff specifically for custom fields
  const getCustomFieldValueDiff = (basePath: string) => {
    return diffs.find(
      (d: any) => d.path === `${basePath}.value` || d.path === basePath
    );
  };

  // Simple inline component for redline display
  const RedlineValue = ({
    value,
    diff,
    formatFn,
  }: {
    value: string;
    diff: any;
    formatFn?: (v: any) => string;
  }) => {
    if (!isRedlineView || !diff) return <>{value}</>;
    // Default format: if value is an object (like custom field), extract .value property
    const format =
      formatFn ||
      ((v: any) => {
        if (v && typeof v === "object") return v.value?.toString() || "";
        return v?.toString() || "";
      });

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

  const productData = { ...data?.result?.data?.data, id: productId };
  const customFieldsData = data?.result?.data?.custom_fields;
  const productMetadata = data?.result?.data?.product_data?.data;
  const productAuditLog = data?.result?.data?.auditLogs;

  const auditLogs = (productAuditLog as AuditLog[]) || [];
  const creationLog = auditLogs.find((log) => log.action === "create");
  const latestUpdateLog = auditLogs
    .filter((log) => log.action === "update")
    .sort(
      (a, b) => new Date(b.actionAt).getTime() - new Date(a.actionAt).getTime()
    )[0];

  const formatAuditDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  const fields = useMemo(() => {
    if (!productData) return [];
    const baseFields = [
      {
        label: "Market / Geography",
        value: productData.market_geography || "N/A",
        icon: PiGlobeDuotone,
        diffPath: "product_information.data.market_geography",
      },
      {
        label: "Country of Origin",
        value: productData.country_of_origin || "N/A",
        icon: PiFlagDuotone,
        diffPath: "product_information.data.country_of_origin",
      },
      {
        label: "OEM / Contract manufactured",
        value: productData.oem_contract_manufacturer || "N/A",
        icon: PiBuildingsDuotone,
        diffPath: "product_information.data.oem_contract_manufacturer",
      },
      {
        label: "Commercial / Clinical",
        value: productData.commercial_clinical || "N/A",
        icon: PiFlaskDuotone,
        diffPath: "product_information.data.commercial_clinical",
      },
    ];

    if (customFieldsData && customFieldsData.length > 0) {
      const customFieldsWithIcons = customFieldsData.map(
        (field: any, idx: number) => ({
          ...field,
          icon: PiTagDuotone,
          diffPath: `product_information.custom_fields[${idx}]`,
        })
      );
      return [...baseFields, ...customFieldsWithIcons];
    }

    return baseFields;
  }, [productData, customFieldsData]);

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
          {/* Header Section Skeleton */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b p-6 border-border">
            <div className="flex flex-col gap-3 w-full min-w-0">
              <div className="flex flex-col gap-1">
                <div className="h-8 w-1/3 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-12 w-full max-w-2xl bg-muted rounded animate-pulse" />
            </div>

            {/* Actions & Meta Skeleton */}
            <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
                <div className="h-9 w-24 bg-muted rounded-md animate-pulse" />
              </div>
              <div className="flex flex-col items-start md:items-end gap-2 w-full">
                <div className="h-7 w-48 bg-muted rounded-lg animate-pulse" />
                <div className="h-7 w-52 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !productData) return notFound();

  console.log("diff product Data", diffRedlineData);

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      {/* Breadcrumbs */}
      {/* <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
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
        <span className="truncate max-w-[200px]">
          {productMetadata?.product_name || "Product Details"}
        </span>
        <PiCaretRightDuotone className="w-3 h-3 text-muted-foreground/50" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          Product Information
        </span>
      </div> */}

      {/* Redline Mode Banner */}
      {isRedlineView && (
        <div className=" px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
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

      <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 justify-between border-b p-6 border-border">
          <div className="flex flex-col gap-3 w-full min-w-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {productMetadata?.product_name || "N/A"}
                </h1>
                <Badge variant="outline" className="font-normal">
                  <div
                    className={cn("w-2 h-2 rounded-full mr-1", {
                      "bg-green-500": productMetadata?.status === "submitted",
                      "bg-blue-500": productMetadata?.status === "draft",
                      "bg-gray-500": productMetadata?.status === "archived",
                    })}
                  />
                  {productMetadata?.status || "N/A"}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-none">
              <RedlineValue
                value={
                  productData.product_description || "No description available."
                }
                diff={getDiff(
                  "product_description",
                  "product_information.data.product_description"
                )}
              />
            </p>
            <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground w-full mt-auto">
              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start ">
                <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Target:{" "}
                  <span className="font-semibold">
                    {productData?.target_date
                      ? productData?.target_date.slice(0, 10)
                      : "N/A"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start ">
                <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Actual:{" "}
                  <span className="font-semibold">
                    <RedlineValue
                      value={
                        productData?.actual_completion_date?.slice(0, 10) ||
                        "N/A"
                      }
                      diff={getDiff(
                        "actual_completion_date",
                        "product_information.data.actual_completion_date"
                      )}
                      formatFn={(v) => v?.slice?.(0, 10) || "N/A"}
                    />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Meta */}
          <div className="flex flex-col items-start md:items-end gap-4 shrink-0 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <EditProductDialog
                product={productData!}
                productMetadata={productMetadata!}
              />
              <ProductInformationCustomFieldEditDialog
                product={productData!}
                productMetadata={productMetadata!}
                customFieldsData={customFieldsData!}
              />
            </div>

            {/* Audit Badges */}
            <div className="flex flex-col items-start md:items-end gap-2 text-xs text-muted-foreground w-full mt-auto">
              {creationLog && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                  <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Created {formatAuditDate(creationLog.actionAt)} -{" "}
                    <span className="font-semibold">
                      {creationLog.actionBy}
                    </span>
                  </span>
                </div>
              )}
              {latestUpdateLog && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border/50 w-full md:w-auto justify-start md:justify-end">
                  <PiCalendarDuotone className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    Updated {formatAuditDate(latestUpdateLog.actionAt)} -{" "}
                    <span className="font-semibold">
                      {latestUpdateLog.actionBy}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Section */}
        <div className="flex flex-col gap-2 px-6 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Product Information</p>
              <div className="w-1 h-1 bg-border border border-border rounded-full" />
              <p className="text-xs text-muted-foreground font-medium">
                Key product details and custom fields
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {fields.map((field, idx) => {
              // For custom fields (with array index), check for nested diffs
              const isCustomField = field.diffPath.includes("custom_fields[");

              // Get status using appropriate method
              const fieldStatus = isCustomField
                ? getFieldStatus(field.diffPath)
                : getDiff(field.diffPath)?.status || null;

              // Get value diff for RedlineValue component
              const valueDiff = isCustomField
                ? getCustomFieldValueDiff(field.diffPath)
                : getDiff(field.diffPath);

              const isRemoved = fieldStatus === "removed";
              const isAdded = fieldStatus === "added";
              const isModified = fieldStatus === "modified";

              return (
                <div
                  key={idx}
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
                    !isRedlineView || !fieldStatus ? "border-border" : ""
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "p-2 rounded-lg bg-accent text-foreground group-hover:bg-accent/60 transition-colors",
                        isRedlineView &&
                          isRemoved &&
                          "bg-red-200/40 text-destructive",
                        isRedlineView &&
                          isAdded &&
                          "bg-blue-200/40 text-blue-500",
                        isRedlineView &&
                          isModified &&
                          "bg-amber-200/40 text-amber-500",
                        !isRedlineView || !fieldStatus ? "border-border" : ""
                      )}
                    >
                      <field.icon className="w-4 h-4" />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium text-muted-foreground truncate",
                        isRedlineView &&
                          isRemoved &&
                          "line-through text-red-500/70"
                      )}
                    >
                      {field.label}
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
                  <div
                    className={cn(
                      "font-semibold text-lg text-foreground pl-1",
                      isRedlineView &&
                        isRemoved &&
                        "line-through text-red-500/70"
                    )}
                    title={field.value}
                  >
                    <RedlineValue value={field.value} diff={valueDiff} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
