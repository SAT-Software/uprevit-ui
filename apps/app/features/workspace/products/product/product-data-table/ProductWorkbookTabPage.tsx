"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
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
  PiCloudCheckDuotone,
  PiFloppyDiskDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";

const KEYBOARD_SHORTCUTS = (
  <div className="space-y-2">
    <p className="font-medium">Navigation</p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
      <li>Arrow keys - Move between cells</li>
    </ul>
    <p className="font-medium pt-2">Selection</p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
      <li>Click - Select single cell</li>
      <li>Shift + Click - Select range of cells</li>
      <li>Ctrl + Click - Add/remove cell from selection</li>
    </ul>
    <p className="font-medium pt-2">Actions</p>
    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
      <li>Ctrl + Z - Undo</li>
      <li>Ctrl + Y - Redo</li>
      <li>Ctrl + R - Find and replace</li>
    </ul>
  </div>
);

type ProductWorkbookAction =
  | "add_product_data"
  | "add_operational_parameters";

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
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>
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
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <PiWarningCircleDuotone className="w-8 h-8 text-destructive" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-destructive">
                  {errorTitle}
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

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 min-h-0 overflow-hidden">
      {isRedlineView && (
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            {isLoadingDiff ? "Loading changes..." : redlineBannerLabel}
          </span>
        </div>
      )}

      <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full min-h-0">
        <div className="flex items-center justify-between border-b border-border p-2 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">{title}</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              {subtitle}
            </p>
            <PageInfoDialog
              title="Keyboard Shortcuts"
              content={KEYBOARD_SHORTCUTS}
            />
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

            {editor.isSaving ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Spinner className="w-4 h-4" />
                <span className="text-xs">Saving</span>
              </div>
            ) : editor.hasEditableUnsavedChanges ? (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            ) : editor.lastSavedAt ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiCloudCheckDuotone className="w-4 h-4 text-green-600" />
                <span className="text-xs">Saved</span>
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
                <PiFloppyDiskDuotone className="w-4 h-4" />
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
    </div>
  );
}
