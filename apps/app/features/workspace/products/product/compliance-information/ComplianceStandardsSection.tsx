"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { RedlineStatusBadge } from "@/components/common/RedlineBadge";
import { RedlineValue } from "@/components/common/RedlineValue";
import AddStandardDialog from "@/features/workspace/products/product/compliance-information/AddStandardDialog";
import DeleteStandardDialog from "@/features/workspace/products/product/compliance-information/DeleteStandardDialog";
import EditStandardDialog from "@/features/workspace/products/product/compliance-information/EditStandardDialog";
import { createSyntheticDiff, type DiffItem } from "@/utils/deepDiff";
import { hasChangedRedlineStatus } from "@/utils/redlineCounts";
import type { WithRedlineMeta } from "@/utils/redlineArray";
import {
  redlineCardAdded,
  redlineCardModified,
  redlineCardRemoved,
  redlineFieldHighlightAdded,
  redlineFieldHighlightModified,
  redlineFieldHighlightRemoved,
} from "@/utils/redlineStyles";
import { Certificate01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";

type ComplianceStandard = {
  _id: string;
  standard: string;
  standard_description: string;
};

type ComplianceStandardsSectionProps = {
  productId: string;
  standards: WithRedlineMeta<ComplianceStandard>[];
  isSubmitted: boolean;
  isRedlineView: boolean;
};

export function ComplianceStandardsSection({
  productId,
  standards,
  isSubmitted,
  isRedlineView,
}: ComplianceStandardsSectionProps) {
  const desktopFillerCount = (3 - (standards.length % 3)) % 3;
  const desktopEntries = [
    ...standards.map((item, itemIndex) => ({
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
          <p className="text-sm font-medium">Compliance Standards</p>
          <InfoTooltip content="Add and manage regulatory compliance standards and certifications for this product." />
        </div>
        <AddStandardDialog productId={productId} isSubmitted={isSubmitted} />
      </div>

      {standards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-4 py-16">
          <Icon
            icon={Certificate01Icon}
            size={32}
            strokeWidth={1.5}
            className="text-muted-foreground/50"
          />
          <div className="space-y-1 text-center">
            <h3 className="text-sm font-medium text-foreground">
              No Standards Added
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Add compliance standards and certifications to track regulatory
              requirements for this product.
            </p>
          </div>
          <AddStandardDialog productId={productId} isSubmitted={isSubmitted} />
        </div>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden md:grid-cols-2 lg:grid-cols-3">
          {desktopEntries.map((entry, index) => {
            const isInLastDesktopRow = index >= desktopEntries.length - 3;
            const hasDesktopItemToTheRight = index % 3 !== 2;

            if (entry.type === "placeholder") {
              return (
                <div
                  key={`standard-placeholder-${entry.fillerIndex}`}
                  aria-hidden="true"
                  className={cn(
                    "hidden min-h-22 lg:block",
                    !isInLastDesktopRow && "lg:border-b lg:border-border",
                    hasDesktopItemToTheRight && "lg:border-r lg:border-border",
                  )}
                />
              );
            }

            const { item, itemIndex } = entry;
            const itemStatus = item._redlineStatus;
            const hasAnyDiff = Boolean(itemStatus) && itemStatus !== "unchanged";
            const isAdded = itemStatus === "added";
            const isRemoved = itemStatus === "removed";
            const isModified = itemStatus === "modified";
            const isLastItem = itemIndex === standards.length - 1;

            const standardDiff: DiffItem | null = isRedlineView
              ? itemStatus === "added"
                ? createSyntheticDiff("standard", "added", item.standard)
                : itemStatus === "removed"
                  ? createSyntheticDiff("standard", "removed", item.standard)
                  : (item._redlineDiffs?.find(
                      (diff) => diff.path === "standard",
                    ) ?? null)
              : null;

            const descriptionDiff: DiffItem | null = isRedlineView
              ? itemStatus === "added"
                ? createSyntheticDiff(
                    "standard_description",
                    "added",
                    item.standard_description,
                  )
                : itemStatus === "removed"
                  ? createSyntheticDiff(
                      "standard_description",
                      "removed",
                      item.standard_description,
                    )
                  : (item._redlineDiffs?.find(
                      (diff) => diff.path === "standard_description",
                    ) ?? null)
              : null;

            const showBadge = isRedlineView && hasChangedRedlineStatus(itemStatus);

            return (
              <div
                key={item._redlineId ?? item._id}
                className={cn(
                  "group relative flex min-h-22 flex-col gap-2 px-4 py-4 transition-colors",
                  !isLastItem && "border-b border-border",
                  isInLastDesktopRow && "lg:border-b-0",
                  !isInLastDesktopRow && "lg:border-b lg:border-border",
                  hasDesktopItemToTheRight && "lg:border-r lg:border-border",
                  isRedlineView && isRemoved && redlineCardRemoved,
                  isRedlineView && isAdded && redlineCardAdded,
                  isRedlineView && isModified && redlineCardModified,
                  (!isRedlineView || !hasAnyDiff) && "hover:bg-accent/40",
                )}
              >
                {showBadge && <RedlineStatusBadge status={itemStatus} />}

                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-3.5">
                    <Icon
                      icon={Certificate01Icon}
                      size={20}
                      strokeWidth={2}
                      className={cn(
                        "mt-0.5 shrink-0 text-muted-foreground/70",
                        isRedlineView &&
                          isRemoved &&
                          redlineFieldHighlightRemoved,
                        isRedlineView && isAdded && redlineFieldHighlightAdded,
                        isRedlineView &&
                          isModified &&
                          redlineFieldHighlightModified,
                      )}
                    />
                    <div className="min-w-0 flex-1 space-y-1.5 pr-2">
                      <p
                        className={cn(
                          "text-base font-semibold leading-snug break-words text-foreground",
                          isRedlineView &&
                            isRemoved &&
                            "text-red-500/70 line-through dark:text-red-400/80",
                        )}
                      >
                        <RedlineValue
                          value={item.standard}
                          diff={standardDiff}
                          isRedlineView={isRedlineView}
                        />
                      </p>
                      <p
                        className={cn(
                          "line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground",
                          isRedlineView &&
                            isRemoved &&
                            "text-red-500/70 line-through dark:text-red-400/80",
                        )}
                      >
                        <RedlineValue
                          value={
                            item.standard_description ||
                            "No description provided."
                          }
                          diff={descriptionDiff}
                          isRedlineView={isRedlineView}
                        />
                      </p>
                    </div>
                  </div>

                  {!isRemoved && (
                    <div className="flex shrink-0 items-center gap-1">
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
