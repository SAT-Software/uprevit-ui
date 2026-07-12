"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { ProductSpecificationDataTable } from "@/features/workspace/products/product/product-data-table/ProductSpecificationDataTable";
import {
  useProductWorkbookEditor,
  type ProductWorkbookTab,
} from "@/hooks/product/useProductWorkbookEditor";
import { useRegisterProductWorkbookGuard } from "@/lib/product-workbook-unsaved-guard";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import { parseProductSpecDataFromDatabase } from "@/utils/product/product-spec";
import { useMemo, useState } from "react";
import {
  Alert01Icon,
  CloudAlertIcon,
  CloudSavingDone01Icon,
  SaveIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { cn } from "@uprevit/ui/lib/utils";
import { redlineBannerText } from "@/utils/redlineStyles";

type ProductWorkbookAction = "add_product_data" | "add_operational_parameters";

interface ProductWorkbookTabPageProps {
  productId: string;
  tab: ProductWorkbookTab;
  action: ProductWorkbookAction;
  title: string;
  subtitle: string;
  redlineBannerLabel: string;
  errorTitle: string;
  isLoading: boolean;
  error: Error | null;
  workbookData: ProductDataTableSchema | undefined;
  isSubmitted: boolean;
  isRedlineView: boolean;
  isLoadingDiff: boolean;
  baseVersionWorkbook?: ProductDataTableSchema;
  nextVersionWorkbook?: ProductDataTableSchema;
}

export function ProductWorkbookTabPage({
  productId,
  tab,
  action,
  title,
  subtitle,
  redlineBannerLabel,
  errorTitle,
  isLoading,
  error,
  workbookData,
  isSubmitted,
  isRedlineView,
  isLoadingDiff,
  baseVersionWorkbook,
  nextVersionWorkbook,
}: ProductWorkbookTabPageProps) {
  const [redlineMode, setRedlineMode] = useState<"highlight" | "inline">(
    "inline",
  );

  const editor = useProductWorkbookEditor({
    productId,
    tab,
    action,
    isSubmitted,
    serverWorkbookData: workbookData,
  });

  const resolvedWorkbookData =
    isRedlineView && nextVersionWorkbook ? nextVersionWorkbook : workbookData;

  const initialData = useMemo(() => {
    return parseProductSpecDataFromDatabase(resolvedWorkbookData);
  }, [resolvedWorkbookData]);

  const redlineBaseData = useMemo(() => {
    if (!isRedlineView || !baseVersionWorkbook) return undefined;
    return parseProductSpecDataFromDatabase(baseVersionWorkbook);
  }, [isRedlineView, baseVersionWorkbook]);

  const workbookGuardRegistration = useMemo(
    () => ({
      tabLabel: title,
      isDirty: editor.hasEditableUnsavedChanges,
      save: editor.savePendingChanges,
      discard: editor.discardChanges,
    }),
    [
      title,
      editor.hasEditableUnsavedChanges,
      editor.savePendingChanges,
      editor.discardChanges,
    ],
  );

  useRegisterProductWorkbookGuard(
    workbookGuardRegistration,
    !isRedlineView && !isSubmitted,
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            <div className="size-3 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-7 w-20 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full w-full animate-pulse bg-muted/40" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-background p-2 pl-3">
          <p className="text-base font-medium">{title}</p>
        </div>
        <div className="flex flex-1 items-center justify-center p-12">
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
                {errorTitle}
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
      {isRedlineView && (
        <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-500/10 p-2 text-sm">
          <span className={cn("font-medium", redlineBannerText)}>
            {isLoadingDiff ? "Loading changes..." : redlineBannerLabel}
          </span>
          <span className="text-xs text-muted-foreground">
            (comparing with previous version)
          </span>
        </div>
      )}

      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{title}</p>
          <InfoTooltip content={subtitle} />
        </div>

        <div className="flex items-center gap-3">
          {isRedlineView && (
            <div className="flex items-center gap-1 rounded-md bg-muted/60 p-1">
              <Button
                size="sm"
                variant={redlineMode === "highlight" ? "secondary" : "ghost"}
                onClick={() => setRedlineMode("highlight")}
                className="h-7 px-2 text-xs"
              >
                Highlight
              </Button>
              <Button
                size="sm"
                variant={redlineMode === "inline" ? "secondary" : "ghost"}
                onClick={() => setRedlineMode("inline")}
                className="h-7 px-2 text-xs"
              >
                Inline
              </Button>
            </div>
          )}

          {!editor.isSaving && editor.hasEditableUnsavedChanges ? (
            <span className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <Icon
                icon={CloudAlertIcon}
                size={16}
                strokeWidth={2}
                className="text-amber-600 dark:text-amber-400"
              />
              Unsaved changes
            </span>
          ) : editor.lastSavedAt ? (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Icon
                icon={CloudSavingDone01Icon}
                size={16}
                strokeWidth={2}
                className="text-green-600"
              />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Saved
              </span>
            </div>
          ) : null}

          <Button
            size="sm"
            variant={editor.hasEditableUnsavedChanges ? "default" : "outline"}
            onClick={editor.handleManualSave}
            disabled={
              editor.isSaving ||
              !editor.hasEditableUnsavedChanges ||
              isSubmitted
            }
            className="gap-1.5"
          >
            {editor.isSaving ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <Icon icon={SaveIcon} size={14} strokeWidth={2} />
            )}
            {editor.isSaving ? "Saving" : "Save"}
          </Button>
        </div>
      </div>

      <ProductSpecificationDataTable
        resetKey={editor.tableResetKey}
        initialData={initialData}
        onDataChange={
          isSubmitted || isRedlineView ? undefined : editor.handleDataChange
        }
        onSaveSuccess={editor.registerClearHistoryOnSave}
        isRedlineView={isRedlineView}
        isReadOnly={isSubmitted || isRedlineView}
        redlineMode={redlineMode}
        redlineBaseData={redlineBaseData}
      />
    </div>
  );
}
