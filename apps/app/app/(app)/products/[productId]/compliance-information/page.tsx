"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ComplianceLanguagesSection } from "@/features/workspace/products/product/compliance-information/ComplianceLanguagesSection";
import { ComplianceStandardsSection } from "@/features/workspace/products/product/compliance-information/ComplianceStandardsSection";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { cn } from "@uprevit/ui/lib/utils";
import { countChangedRedlineItems } from "@/utils/redlineCounts";
import { buildRedlineArray, type WithRedlineMeta } from "@/utils/redlineArray";
import { redlineBannerText } from "@/utils/redlineStyles";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { PiCaretRightDuotone, PiHouseDuotone } from "react-icons/pi";

type ComplianceItem = {
  _id: string;
  standard: string;
  standard_description: string;
};

type LanguageItem = {
  code: string;
  name: string;
  country?: string;
};

type ComplianceTabsData = {
  compliance_information?: { data?: ComplianceItem[] };
  languages_information?: { data?: LanguageItem[] };
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
    "all-tabs",
  );
  const { data: diffRedlineData, isLoading: diffRedlineLoading } =
    useGetProductDiffRedline(productId, compareVersionId);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-full w-full flex-col overflow-y-auto">
          <div className="flex h-10 items-center gap-2 border-b border-border px-3">
            <div className="h-4 w-44 animate-pulse rounded bg-muted" />
            <div className="size-3 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="flex flex-col gap-2 px-2 py-2">
            {[0, 1].map((section) => (
              <div
                key={section}
                className="overflow-hidden rounded-2xl border border-border"
              >
                <div className="flex h-10 items-center justify-between border-b border-border px-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-7 w-28 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={`${section}-${item}`}
                      className="flex min-h-22 items-start gap-3.5 border-b border-border px-4 py-4 last:border-b-0 lg:border-r lg:border-border lg:last:border-r-0"
                    >
                      <div className="mt-0.5 size-5 shrink-0 animate-pulse rounded bg-muted" />
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col gap-2">
        <div className="flex items-center gap-2 px-2 text-sm text-muted-foreground">
          <Link
            href="/dashboard"
            className="flex items-center transition-colors hover:text-foreground"
          >
            <PiHouseDuotone className="h-4 w-4" />
          </Link>
          <PiCaretRightDuotone className="h-3 w-3 text-muted-foreground/50" />
          <Link
            href="/products"
            className="transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <PiCaretRightDuotone className="h-3 w-3 text-muted-foreground/50" />
          <span className="font-medium text-foreground">
            Compliance Information
          </span>
        </div>

        <div className="flex h-full w-full flex-col overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-destructive/10 p-3">
                <Icon
                  icon={Alert01Icon}
                  size={32}
                  strokeWidth={1.5}
                  className="text-destructive"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  Error Loading Compliance Details
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
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
  const currentStandards = (allTabsData?.compliance_information?.data ??
    []) as unknown as ComplianceItem[];
  const currentLanguages = (allTabsData?.languages_information?.data ??
    []) as unknown as LanguageItem[];
  const hasDiffVersions = Boolean(
    diffRedlineData?.result?.base_version &&
    diffRedlineData?.result?.next_version,
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
          getFallbackKey: (item) =>
            `${item.standard}-${item.standard_description}`,
        })
      : [];
  const languageRedlineItems =
    isRedlineView && hasDiffVersions
      ? buildRedlineArray(baseLanguages, nextLanguages, {
          getId: (item) => item.code,
          getFallbackKey: (item) =>
            `${item.code}-${item.name}-${item.country || ""}`,
        })
      : [];
  const complianceChangeCount =
    countChangedRedlineItems(standardRedlineItems) +
    countChangedRedlineItems(languageRedlineItems);

  const standards = (() => {
    if (!isRedlineView || !hasDiffVersions) {
      return currentStandards as WithRedlineMeta<ComplianceItem>[];
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
      .filter(Boolean) as WithRedlineMeta<ComplianceItem>[];
  })();

  const languages = (() => {
    if (!isRedlineView || !hasDiffVersions) {
      return currentLanguages as WithRedlineMeta<LanguageItem>[];
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
      .filter(Boolean) as WithRedlineMeta<LanguageItem>[];
  })();

  const isSubmitted =
    allTabsData?.product_information?.product_data?.data?.status ===
    "submitted";

  return (
    <div className="flex h-full flex-col">
      {isRedlineView && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 p-2 text-sm">
          <span className={cn("font-medium", redlineBannerText)}>
            {diffRedlineLoading
              ? "Loading changes..."
              : `Redline View: ${complianceChangeCount} changes in Compliance Information`}
          </span>
          <span className="text-xs text-muted-foreground">
            (comparing with previous version)
          </span>
        </div>
      )}

      <div className="flex h-full w-full flex-col overflow-y-auto">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
          <p className="text-base font-semibold">Compliance Information</p>
          <InfoTooltip content="Document regulatory standards and packaging or labeling languages for this product." />
        </div>

        <div className="flex flex-col gap-2 px-2 py-2">
          <ComplianceStandardsSection
            productId={productId}
            standards={standards}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
          <ComplianceLanguagesSection
            productId={productId}
            languages={languages}
            currentLanguages={currentLanguages}
            isSubmitted={isSubmitted}
            isRedlineView={isRedlineView}
          />
        </div>
      </div>
    </div>
  );
}
