"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { CountryFlag } from "@/components/common/CountryFlag";
import AddStandardDialog from "@/features/workspace/products/product/compliance-information/AddStandardDialog";
import DeleteStandardDialog from "@/features/workspace/products/product/compliance-information/DeleteStandardDialog";
import EditStandardDialog from "@/features/workspace/products/product/compliance-information/EditStandardDialog";
import ManageLanguagesDialog from "@/features/workspace/products/product/compliance-information/ManageLanguagesDialog";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { cn } from "@/lib/utils";
import type { DiffItem } from "@/utils/deepDiff";
import { countChangedRedlineItems } from "@/utils/redlineCounts";
import { buildRedlineArray, type RedlineStatus } from "@/utils/redlineArray";
import {
  PiArrowRightBold,
  PiCaretRightDuotone,
  PiCertificateDuotone,
  PiGlobeDuotone,
  PiHouseDuotone,
  PiShieldCheckDuotone,
} from "react-icons/pi";

interface ComplianceItem {
  _id: string;
  standard: string;
  standard_description: string;
}

interface LanguageItem {
  code: string;
  name: string;
  country?: string;
}

type ComplianceItemWithDiff = ComplianceItem & {
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
};

type LanguageItemWithDiff = LanguageItem & {
  _redlineStatus?: RedlineStatus;
  _redlineDiffs?: DiffItem[];
  _redlineId?: string;
};

type ComplianceTabsData = {
  compliance_information?: { data?: ComplianceItem[] };
  languages_information?: { data?: LanguageItem[] };
  product_information?: {
    product_data?: { data?: { status?: "draft" | "submitted" | "archived" } };
  };
};

const createSyntheticDiff = (
  path: string,
  status: "added" | "removed",
  value: unknown
): DiffItem => ({
  path,
  status,
  old_value: status === "removed" ? value : null,
  new_value: status === "added" ? value : null,
});

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;

  const { data, isLoading, error } = useGetProductTabData(productId, "all-tabs");
  const { data: diffRedlineData, isLoading: diffRedlineLoading } =
    useGetProductDiffRedline(productId, compareVersionId);

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
    const oldValue = format(diff.old_value);
    const newValue = format(diff.new_value);
    const hasOldValue = oldValue.trim() !== "";
    const hasNewValue = newValue.trim() !== "";

    if (!hasOldValue && !hasNewValue) {
      return null;
    }

    return (
      <span className="inline-flex max-w-full flex-wrap items-center gap-2 whitespace-normal break-words">
        {(diff.old_value !== null || isRemoved) && hasOldValue && (
          <span className="relative group/old max-w-full">
            <span className="max-w-full whitespace-pre-wrap rounded border border-red-200/50 bg-red-100/50 px-1.5 py-0.5 text-sm text-red-600/70 line-through break-words dark:border-red-800/20 dark:bg-red-900/10">
              {oldValue}
            </span>
          </span>
        )}

        {diff.old_value !== null &&
          diff.new_value !== null &&
          !isRemoved &&
          !isAdded &&
          hasOldValue &&
          hasNewValue && (
          <PiArrowRightBold className="shrink-0 text-xs text-muted-foreground/50" />
        )}

        {(diff.new_value !== null || isAdded) && !isRemoved && hasNewValue && (
          <span className="max-w-full whitespace-pre-wrap rounded border border-blue-200 bg-blue-100 px-1.5 py-0.5 text-sm font-semibold text-blue-700 break-words shadow-sm dark:border-blue-800/30 dark:bg-blue-900/30">
            {newValue}
          </span>
        )}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-2 p-2">
        <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl border border-border bg-background">
          {[0, 1].map((section) => (
            <div key={section} className={cn(section === 0 && "border-b border-border")}>
              <div className="flex flex-col items-start justify-between gap-4 border-b border-border p-6 md:flex-row">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-48 animate-pulse rounded bg-muted" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={`${section}-${item}`}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
                        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                      </div>
                      <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col gap-2 p-2">
        <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="flex items-center transition-colors hover:text-foreground">
            <PiHouseDuotone className="h-4 w-4" />
          </Link>
          <PiCaretRightDuotone className="h-3 w-3 text-muted-foreground/50" />
          <Link href="/products" className="transition-colors hover:text-foreground">
            Products
          </Link>
          <PiCaretRightDuotone className="h-3 w-3 text-muted-foreground/50" />
          <span className="font-medium text-foreground">Compliance Information</span>
        </div>

        <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl border border-border bg-background">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <PiShieldCheckDuotone className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Compliance Details
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allTabsData = (data as { result?: { data?: ComplianceTabsData } })?.result?.data;
  const currentStandards =
    (allTabsData?.compliance_information?.data ?? []) as unknown as ComplianceItem[];
  const currentLanguages =
    (allTabsData?.languages_information?.data ?? []) as unknown as LanguageItem[];
  const hasDiffVersions = Boolean(
    diffRedlineData?.result?.base_version && diffRedlineData?.result?.next_version
  );

  const baseStandards = hasDiffVersions
    ? ((diffRedlineData?.result?.base_version?.compliance_information?.data ??
        []) as unknown as ComplianceItem[])
    : [];
  const nextStandards = hasDiffVersions
    ? ((diffRedlineData?.result?.next_version?.compliance_information?.data ??
        []) as unknown as ComplianceItem[])
    : [];
  const baseLanguages = hasDiffVersions
    ? ((diffRedlineData?.result?.base_version?.languages_information?.data ??
        []) as unknown as LanguageItem[])
    : [];
  const nextLanguages = hasDiffVersions
    ? ((diffRedlineData?.result?.next_version?.languages_information?.data ??
        []) as unknown as LanguageItem[])
    : [];
  const standardRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseStandards, nextStandards, {
          getId: (item) => item._id,
          getFallbackKey: (item) => `${item.standard}-${item.standard_description}`,
        })
      : [];
  const languageRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseLanguages, nextLanguages, {
          getId: (item) => item.code,
          getFallbackKey: (item) => `${item.code}-${item.name}-${item.country || ""}`,
        })
      : [];
  const complianceChangeCount =
    countChangedRedlineItems(standardRedlineItems) +
    countChangedRedlineItems(languageRedlineItems);

  const standards = (() => {
    if (!isRedlineView || !hasDiffVersions) {
      return currentStandards as ComplianceItemWithDiff[];
    }

    return standardRedlineItems
      .map((item) => {
        const itemData = item.next ?? item.base;
        if (!itemData) return null;

        return {
          ...(itemData as ComplianceItem),
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
        };
      })
      .filter(Boolean) as ComplianceItemWithDiff[];
  })();

  const languages = (() => {
    if (!isRedlineView || !hasDiffVersions) {
      return currentLanguages as LanguageItemWithDiff[];
    }

    return languageRedlineItems
      .map((item) => {
        const itemData = item.next ?? item.base;
        if (!itemData) return null;

        return {
          ...(itemData as LanguageItem),
          _redlineStatus: item.status,
          _redlineDiffs: item.diffs,
          _redlineId: item.id,
        };
      })
      .filter(Boolean) as LanguageItemWithDiff[];
  })();

  const isSubmitted =
    allTabsData?.product_information?.product_data?.data?.status === "submitted";

  return (
    <div className="flex h-full flex-col gap-2 p-2">
      {isRedlineView && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-2 text-sm">
          <span className="font-medium text-amber-600">
            {diffRedlineLoading
              ? "Loading changes..."
              : `Redline View: ${complianceChangeCount} changes in Compliance Information`}
          </span>
          <span className="text-xs text-muted-foreground">(comparing with previous version)</span>
        </div>
      )}

      <div className="flex h-full w-full flex-col overflow-y-auto rounded-xl border border-border bg-background">
        <section className="flex flex-col border-b border-border">
          <div className="flex items-center justify-between border-b border-border p-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Compliance Standards</p>
              <div className="h-1 w-1 rounded-full border border-border bg-border" />
              <p className="text-xs font-medium text-muted-foreground">
                Regulatory standards and certifications for this product
              </p>
              <PageInfoDialog
                title="Compliance Standards"
                content="Add and manage regulatory compliance standards, certifications, and safety documents for your product."
              />
            </div>
            <AddStandardDialog productId={productId} isSubmitted={isSubmitted} />
          </div>

          <div className="px-2 py-2">
            {standards.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <div className="rounded-full bg-muted p-4">
                  <PiCertificateDuotone className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-semibold text-foreground">No Standards Added</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Add compliance standards and certifications to track regulatory requirements for this product.
                  </p>
                </div>
                <AddStandardDialog productId={productId} isSubmitted={isSubmitted} />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {standards.map((item) => {
                  const itemStatus = item._redlineStatus;
                  const hasAnyDiff = Boolean(itemStatus) && itemStatus !== "unchanged";
                  const isAdded = itemStatus === "added";
                  const isRemoved = itemStatus === "removed";
                  const isModified = itemStatus === "modified";

                  const standardDiff: DiffItem | null = isRedlineView
                    ? itemStatus === "added"
                      ? createSyntheticDiff("standard", "added", item.standard)
                      : itemStatus === "removed"
                        ? createSyntheticDiff("standard", "removed", item.standard)
                        : item._redlineDiffs?.find((diff) => diff.path === "standard") ?? null
                    : null;

                  const descriptionDiff: DiffItem | null = isRedlineView
                    ? itemStatus === "added"
                      ? createSyntheticDiff(
                          "standard_description",
                          "added",
                          item.standard_description
                        )
                      : itemStatus === "removed"
                        ? createSyntheticDiff(
                            "standard_description",
                            "removed",
                            item.standard_description
                          )
                        : item._redlineDiffs?.find(
                            (diff) => diff.path === "standard_description"
                          ) ?? null
                    : null;

                  return (
                    <div
                      key={item._redlineId ?? item._id}
                      className={cn(
                        "group flex flex-col gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:bg-accent/5",
                        isRedlineView && isRemoved && "border-red-500/50 bg-red-100/5 opacity-60",
                        isRedlineView && isAdded && "border-blue-500/50 bg-blue-100/5",
                        isRedlineView && isModified && "border-amber-500/50 bg-amber-100/10",
                        (!isRedlineView || !hasAnyDiff) && "border-border"
                      )}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-start gap-3">
                          <div
                            className={cn(
                              "rounded-lg bg-green-500/10 p-2 text-green-600 transition-colors group-hover:bg-green-500/20",
                              isRedlineView && isRemoved && "bg-red-200/40 text-destructive",
                              isRedlineView && isAdded && "bg-blue-200/40 text-blue-500",
                              isRedlineView && isModified && "bg-amber-200/40 text-amber-500"
                            )}
                          >
                            <PiShieldCheckDuotone className="h-4 w-4" />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col gap-2">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "min-w-0 break-words text-base font-semibold text-foreground",
                                  isRedlineView && isRemoved && "text-red-500/70 line-through"
                                )}
                              >
                                <RedlineValue value={item.standard} diff={standardDiff} />
                              </span>
                              {isRedlineView && isAdded && (
                                <span className="rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 shadow-sm">
                                  NEW
                                </span>
                              )}
                              {isRedlineView && isRemoved && (
                                <span className="rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-700 shadow-sm">
                                  REMOVED
                                </span>
                              )}
                              {isRedlineView && isModified && (
                                <span className="rounded-full border border-amber-200 bg-amber-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 shadow-sm">
                                  MODIFIED
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!isRemoved && (
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
                        )}
                      </div>
                      <p
                        className={cn(
                          "line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground",
                          isRedlineView && isRemoved && "text-red-500/70 line-through"
                        )}
                      >
                        <RedlineValue
                          value={item.standard_description || "No description provided."}
                          diff={descriptionDiff}
                        />
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col">
          <div className="flex items-center justify-between border-b border-border p-2">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">Languages</p>
              <div className="h-1 w-1 rounded-full border border-border bg-border" />
              <p className="text-xs font-medium text-muted-foreground">
                Packaging and labeling languages selected for this product
              </p>
              <PageInfoDialog
                title="Languages"
                content="Manage individual product languages and apply preset market language groups for labeling and packaging workflows."
              />
            </div>
            <ManageLanguagesDialog
              productId={productId}
              selectedLanguages={currentLanguages}
              isSubmitted={isSubmitted}
            />
          </div>

          <div className="px-2 py-2">
            {languages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-16">
                <div className="rounded-full bg-muted p-4">
                  <PiGlobeDuotone className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-semibold text-foreground">No Languages Selected</h3>
                  <p className="max-w-md text-sm text-muted-foreground">
                    Add required market languages individually or use language groups to build your labeling set faster.
                  </p>
                </div>
                <ManageLanguagesDialog
                  productId={productId}
                  selectedLanguages={currentLanguages}
                  isSubmitted={isSubmitted}
                />
              </div>
            ) : (
              <div className="grid overflow-hidden rounded-lg border border-border bg-background lg:grid-cols-3">
                {languages.map((item, index) => {
                  const itemStatus = item._redlineStatus;
                  const hasAnyDiff = Boolean(itemStatus) && itemStatus !== "unchanged";
                  const isAdded = itemStatus === "added";
                  const isRemoved = itemStatus === "removed";
                  const isModified = itemStatus === "modified";
                  const isLastItem = index === languages.length - 1;
                  const lastDesktopRowStart =
                    languages.length <= 3
                      ? 0
                      : languages.length - ((languages.length % 3) || 3);
                  const isInLastDesktopRow = index >= lastDesktopRowStart;
                  const hasDesktopItemToTheRight =
                    index + 1 < languages.length && index % 3 !== 2;
                  const statusLabel = isAdded
                    ? "Added"
                    : isRemoved
                      ? "Removed"
                      : isModified
                        ? "Modified"
                        : null;
                  const countryValue = item.country?.trim() || "";

                  const codeDiff: DiffItem | null = isRedlineView
                    ? itemStatus === "added"
                      ? createSyntheticDiff("code", "added", item.code)
                      : itemStatus === "removed"
                        ? createSyntheticDiff("code", "removed", item.code)
                        : item._redlineDiffs?.find((diff) => diff.path === "code") ?? null
                    : null;

                  const nameDiff: DiffItem | null = isRedlineView
                    ? itemStatus === "added"
                      ? createSyntheticDiff("name", "added", item.name)
                      : itemStatus === "removed"
                        ? createSyntheticDiff("name", "removed", item.name)
                        : item._redlineDiffs?.find((diff) => diff.path === "name") ?? null
                    : null;

                  const countryDiff: DiffItem | null = isRedlineView
                    ? itemStatus === "added"
                      ? countryValue
                        ? createSyntheticDiff("country", "added", countryValue)
                        : null
                      : itemStatus === "removed"
                        ? countryValue
                          ? createSyntheticDiff("country", "removed", countryValue)
                          : null
                        : item._redlineDiffs?.find((diff) => diff.path === "country") ?? null
                    : null;

                  return (
                    <div
                      key={item._redlineId ?? item.code}
                      className={cn(
                        "flex flex-col gap-2 px-3 py-3 transition-colors sm:flex-row sm:items-start sm:justify-between",
                        !isLastItem && "border-b border-border",
                        isInLastDesktopRow && "lg:border-b-0",
                        !isInLastDesktopRow && "lg:border-b lg:border-border",
                        hasDesktopItemToTheRight && "lg:border-r lg:border-border",
                        isRedlineView && isRemoved && "bg-red-100/5 opacity-60",
                        isRedlineView && isAdded && "bg-blue-100/5",
                        isRedlineView && isModified && "bg-amber-100/10",
                        (!isRedlineView || !hasAnyDiff) && "hover:bg-accent/30"
                      )}
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <CountryFlag country={item.country} className="mt-0.5" />
                        <div className="min-w-0 flex w-full items-start gap-3">
                          <div className="min-w-[2.75rem] shrink-0 pt-0.5 text-xs font-medium tracking-wide text-muted-foreground">
                            <RedlineValue value={item.code} diff={codeDiff} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm font-medium text-foreground",
                                isRedlineView && isRemoved && "text-red-500/70 line-through"
                              )}
                            >
                              <RedlineValue value={item.name} diff={nameDiff} />
                            </p>
                            {(countryValue || countryDiff) && (
                              <p
                                className={cn(
                                  "mt-0.5 text-xs text-muted-foreground",
                                  isRedlineView && isRemoved && "text-red-500/70 line-through"
                                )}
                              >
                                <RedlineValue value={countryValue} diff={countryDiff} />
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {statusLabel && (
                        <div
                          className={cn(
                            "shrink-0 pl-8 text-[11px] font-medium sm:pl-0",
                            isAdded && "text-blue-700 dark:text-blue-300",
                            isRemoved && "text-red-700 dark:text-red-300",
                            isModified && "text-amber-700 dark:text-amber-300"
                          )}
                        >
                          {statusLabel}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
