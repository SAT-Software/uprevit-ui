"use client";

import AddStandardDialog from "@/features/workspace/products/product/compliance-information/AddStandardDialog";
import { useParams, useSearchParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
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
import type { DiffItem } from "@/utils/deepDiff";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";

interface ComplianceItem {
  _id: string;
  standard: string;
  standard_description: string;
}

type ComplianceItemWithDiff = ComplianceItem & {
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
};

type ComplianceTabsData = {
  compliance_information?: { data?: ComplianceItem[] };
  product_information?: {
    product_data?: { data?: { status?: "draft" | "submitted" | "archived" } };
  };
};

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "all-tabs"
  );

  // Only fetch redline data when compareVersion is in the URL
  const { data: diffRedlineData, isLoading: diffRedlineLoading } =
    useGetProductDiffRedline(productId, compareVersionId);

  const diffs = diffRedlineData?.result?.diffs ?? [];

  const RedlineValue = ({
    value,
    diff,
    formatFn,
  }: {
    value: string;
    diff?: DiffItem | null;
    formatFn?: (v: unknown) => string;
  }) => {
    if (!isRedlineView || !diff) return <>{value}</>;
    const format =
      formatFn ||
      ((v: unknown) => (typeof v === "string" ? v : v != null ? String(v) : ""));

    const isRemoved = diff.status === "removed";
    const isAdded = diff.status === "added";

    return (
      <span className="inline-flex max-w-full flex-wrap items-center gap-2 whitespace-normal break-words">
        {/* Old value - show for modified and removed */}
        {(diff.old_value !== null || isRemoved) && (
          <span className="relative group/old max-w-full">
            <span className="line-through text-sm text-red-600/70 bg-red-100/50 dark:bg-red-900/10 px-1.5 py-0.5 rounded border border-red-200/50 dark:border-red-800/20 max-w-full whitespace-pre-wrap break-words">
              {format(diff.old_value) || ""}
            </span>
          </span>
        )}

        {/* Arrow separator for modified */}
        {diff.old_value !== null &&
          diff.new_value !== null &&
          !isRemoved &&
          !isAdded && (
            <PiArrowRightBold className="text-muted-foreground/50 text-xs shrink-0" />
          )}

        {/* New value - show for modified and added */}
        {(diff.new_value !== null || isAdded) && !isRemoved && (
          <span className="text-sm text-blue-700 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-semibold border border-blue-200 dark:border-blue-800/30 shadow-sm max-w-full whitespace-pre-wrap break-words">
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

  const allTabsData = (data as { result?: { data?: ComplianceTabsData } })
    ?.result?.data;
  const currentStandards =
    (allTabsData?.compliance_information?.data ?? []) as unknown as ComplianceItem[];
  const baseStandards =
    (diffRedlineData?.result?.base_version?.compliance_information?.data ??
      []) as unknown as ComplianceItem[];
  const nextStandards =
    (diffRedlineData?.result?.next_version?.compliance_information?.data ??
      currentStandards) as unknown as ComplianceItem[];

  const standards = (() => {
    if (!isRedlineView) return currentStandards as ComplianceItemWithDiff[];

    const redlineItems = buildRedlineArray(baseStandards, nextStandards, {
      getId: (item) => item._id,
      getParentId: (item) =>
        "parent_id" in item && item.parent_id ? String(item.parent_id) : undefined,
      getFallbackKey: (item) => `${item.standard}-${item.standard_description}`,
    });

    return redlineItems
      .map((item) => {
        const data = item.next ?? item.base;
        if (!data) return null;
        return {
          ...(data as ComplianceItem),
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
        };
      })
      .filter(Boolean) as ComplianceItemWithDiff[];
  })();

  // Check if product is submitted - disable editing buttons
  const isSubmitted =
    allTabsData?.product_information?.product_data?.data?.status ===
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
            <PageInfoDialog
              title="Compliance Standards"
              content="Add and manage regulatory compliance standards, certifications, and safety documents for your product."
            />
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
              {standards.map((item: ComplianceItemWithDiff) => {
                const itemStatus = item._redlineStatus;
                const hasAnyDiff =
                  Boolean(itemStatus) && itemStatus !== "unchanged";
                const isAdded = itemStatus === "added";
                const isRemoved = itemStatus === "removed";
                const isModified = itemStatus === "modified";

                const standardDiff: DiffItem | null = isRedlineView
                  ? itemStatus === "added"
                    ? {
                        path: "standard",
                        status: "added" as const,
                        old_value: null,
                        new_value: item.standard,
                      }
                    : itemStatus === "removed"
                      ? {
                          path: "standard",
                          status: "removed" as const,
                          old_value: item.standard,
                          new_value: null,
                        }
                      : item._redlineDiffs?.find((d) => d.path === "standard") ??
                        null
                  : null;

                const descDiff: DiffItem | null = isRedlineView
                  ? itemStatus === "added"
                    ? {
                        path: "standard_description",
                        status: "added" as const,
                        old_value: null,
                        new_value: item.standard_description,
                      }
                    : itemStatus === "removed"
                      ? {
                          path: "standard_description",
                          status: "removed" as const,
                          old_value: item.standard_description,
                          new_value: null,
                        }
                      : item._redlineDiffs?.find(
                          (d) => d.path === "standard_description"
                        ) ?? null
                  : null;

                return (
                  <div
                    key={item._redlineId ?? item._id}
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
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
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
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <span
                              className={cn(
                                "font-semibold text-base text-foreground break-words min-w-0",
                                isRedlineView &&
                                  isRemoved &&
                                  "line-through text-red-500/70"
                              )}
                            >
                              <RedlineValue
                                value={item.standard}
                                diff={standardDiff}
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
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 self-start">
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
                        "text-sm text-muted-foreground leading-relaxed line-clamp-3 break-words",
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
                        diff={descDiff}
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
