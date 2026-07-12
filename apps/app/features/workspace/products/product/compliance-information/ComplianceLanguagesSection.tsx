"use client";

import { CountryFlag } from "@/components/common/CountryFlag";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { RedlineStatusBadge } from "@/components/common/RedlineBadge";
import { RedlineValue } from "@/components/common/RedlineValue";
import ManageLanguagesDialog from "@/features/workspace/products/product/compliance-information/ManageLanguagesDialog";
import { createSyntheticDiff, type DiffItem } from "@/utils/deepDiff";
import { hasChangedRedlineStatus } from "@/utils/redlineCounts";
import type { WithRedlineMeta } from "@/utils/redlineArray";
import {
  redlineCardAdded,
  redlineCardModified,
  redlineCardRemoved,
} from "@/utils/redlineStyles";
import { LanguageSquareIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

type Language = {
  code: string;
  name: string;
  country?: string;
};

type ComplianceLanguagesSectionProps = {
  productId: string;
  languages: WithRedlineMeta<Language>[];
  currentLanguages: Language[];
  isSubmitted: boolean;
  isRedlineView: boolean;
};

export function ComplianceLanguagesSection({
  productId,
  languages,
  currentLanguages,
  isSubmitted,
  isRedlineView,
}: ComplianceLanguagesSectionProps) {
  const desktopFillerCount = (4 - (languages.length % 4)) % 4;
  const desktopEntries = [
    ...languages.map((item, itemIndex) => ({
      type: "item" as const,
      item,
      itemIndex,
    })),
    ...Array.from({ length: desktopFillerCount }, (_, fillerIndex) => ({
      type: "placeholder" as const,
      fillerIndex,
    })),
  ];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border pl-3 pr-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Languages</p>
          <InfoTooltip content="Languages used on packaging and labeling for this product. Choose individually or apply a market language group." />
        </div>
        <ManageLanguagesDialog
          productId={productId}
          selectedLanguages={currentLanguages}
          isSubmitted={isSubmitted}
        />
      </div>

      {languages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
          <Icon
            icon={LanguageSquareIcon}
            size={32}
            strokeWidth={1.5}
            className="text-muted-foreground/50"
          />
          <div className="space-y-1 text-center">
            <h3 className="text-sm font-medium text-foreground">
              No Languages Selected
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Add required market languages individually or use language groups
              to build your labeling set faster.
            </p>
          </div>
          <ManageLanguagesDialog
            productId={productId}
            selectedLanguages={currentLanguages}
            isSubmitted={isSubmitted}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {desktopEntries.map((entry, index) => {
            const isInLastDesktopRow = index >= desktopEntries.length - 4;
            const hasDesktopItemToTheRight = index % 4 !== 3;

            if (entry.type === "placeholder") {
              return (
                <div
                  key={`language-placeholder-${entry.fillerIndex}`}
                  aria-hidden="true"
                  className={cn(
                    "hidden lg:block",
                    !isInLastDesktopRow && "lg:border-b lg:border-border",
                    hasDesktopItemToTheRight && "lg:border-r lg:border-border",
                  )}
                />
              );
            }

            const { item, itemIndex } = entry;
            const itemStatus = item._redlineStatus;
            const hasAnyDiff = Boolean(itemStatus) && itemStatus !== "unchanged";
            const isRemoved = itemStatus === "removed";
            const isLastItem = itemIndex === languages.length - 1;
            const showBadge = isRedlineView && hasChangedRedlineStatus(itemStatus);
            const countryValue = item.country?.trim() || "";

            const codeDiff: DiffItem | null = isRedlineView
              ? itemStatus === "added"
                ? createSyntheticDiff("code", "added", item.code)
                : itemStatus === "removed"
                  ? createSyntheticDiff("code", "removed", item.code)
                  : (item._redlineDiffs?.find((diff) => diff.path === "code") ??
                    null)
              : null;

            const nameDiff: DiffItem | null = isRedlineView
              ? itemStatus === "added"
                ? createSyntheticDiff("name", "added", item.name)
                : itemStatus === "removed"
                  ? createSyntheticDiff("name", "removed", item.name)
                  : (item._redlineDiffs?.find((diff) => diff.path === "name") ??
                    null)
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
                  : (item._redlineDiffs?.find(
                      (diff) => diff.path === "country",
                    ) ?? null)
              : null;

            return (
              <div
                key={item._redlineId ?? item.code}
                className={cn(
                  "relative flex flex-col gap-2 px-3 py-3 transition-colors",
                  !isLastItem && "border-b border-border",
                  isInLastDesktopRow && "lg:border-b-0",
                  !isInLastDesktopRow && "lg:border-b lg:border-border",
                  hasDesktopItemToTheRight && "lg:border-r lg:border-border",
                  isRedlineView && itemStatus === "removed" && redlineCardRemoved,
                  isRedlineView && itemStatus === "added" && redlineCardAdded,
                  isRedlineView && itemStatus === "modified" && redlineCardModified,
                  (!isRedlineView || !hasAnyDiff) && "hover:bg-accent/40",
                )}
              >
                {showBadge && <RedlineStatusBadge status={itemStatus} />}

                <div className="flex min-w-0 items-start gap-3">
                  <CountryFlag country={item.country} className="mt-1" />
                  <div className="flex w-full min-w-0 items-start gap-3">
                    <div className="min-w-11 shrink-0 pt-0.5 text-xs font-medium tracking-wide text-muted-foreground">
                      <RedlineValue
                        value={item.code}
                        diff={codeDiff}
                        isRedlineView={isRedlineView}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium text-foreground",
                          isRedlineView &&
                            isRemoved &&
                            "text-red-500/70 line-through dark:text-red-400/80",
                        )}
                      >
                        <RedlineValue
                          value={item.name}
                          diff={nameDiff}
                          isRedlineView={isRedlineView}
                        />
                      </p>
                      {(countryValue || countryDiff) && (
                        <p
                          className={cn(
                            "mt-0.5 text-xs text-muted-foreground",
                            isRedlineView &&
                              isRemoved &&
                              "text-red-500/70 line-through dark:text-red-400/80",
                          )}
                        >
                          <RedlineValue
                            value={countryValue}
                            diff={countryDiff}
                            isRedlineView={isRedlineView}
                          />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
