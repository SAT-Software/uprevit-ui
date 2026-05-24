"use client";

import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Switch } from "@uprevit/ui/components/ui/switch";
import { PageInfoDialog } from "@/features/workspace/products/product/PageInfoDialog";
import { ProductSpecificationDataTable } from "@/features/workspace/products/product/product-data-table/ProductSpecificationDataTable";
import { useGetProductDiffRedline } from "@/hooks/product/getProductDiffRedline";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import { parseProductSpecDataFromDatabase } from "@/utils/product/product-spec";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PiCloudCheckDuotone,
  PiFloppyDiskDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";

const AUTO_SAVE_STORAGE_KEY_PREFIX = "operational-parameters-auto-save";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId ?? "";
  const autoSaveStorageKey = `${AUTO_SAVE_STORAGE_KEY_PREFIX}-${productId}`;
  const searchParams = useSearchParams();
  const compareVersionId = searchParams.get("compareVersion");
  const isRedlineView = !!compareVersionId;
  const [redlineMode, setRedlineMode] = useState<"highlight" | "inline">(
    "inline",
  );
  const [autoSave, setAutoSave] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(autoSaveStorageKey);
      return stored === "true";
    }
    return false;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<ProductDataTableSchema | null>(null);
  const isFirstRender = useRef(true);
  const onSaveSuccessRef = useRef<() => void>(() => {});
  const saveDataToDBRef = useRef<(data: ProductDataTableSchema) => void>(() => {
    // no-op
  });

  const {
    data: operationalTabData,
    isLoading,
    error,
  } = useGetProductTabData(productId, "operational-parameters");
  const { mutate: updateTabData, isPending: isSaving } =
    useUpdateProductTabData();

  const { data: diffData, isLoading: isLoadingDiff } = useGetProductDiffRedline(
    productId,
    compareVersionId,
  );

  const workbookData =
    operationalTabData?.result?.data?.data
      ?.workbook_data as ProductDataTableSchema | undefined;
  const isSubmitted =
    operationalTabData?.result?.data?.product_data?.data?.status ===
    "submitted";
  const hasEditableUnsavedChanges = hasUnsavedChanges && !isSubmitted;
  const baseVersionWorkbook =
    diffData?.result?.base_version?.operational_parameters?.data
      ?.workbook_data as ProductDataTableSchema | undefined;
  const nextVersionWorkbook =
    diffData?.result?.next_version?.operational_parameters?.data
      ?.workbook_data as ProductDataTableSchema | undefined;
  const resolvedWorkbookData =
    isRedlineView && nextVersionWorkbook ? nextVersionWorkbook : workbookData;

  const initialData = useMemo(() => {
    return parseProductSpecDataFromDatabase(resolvedWorkbookData);
  }, [resolvedWorkbookData]);

  const redlineBaseData = useMemo(() => {
    if (!isRedlineView || !baseVersionWorkbook) return undefined;
    return parseProductSpecDataFromDatabase(baseVersionWorkbook);
  }, [isRedlineView, baseVersionWorkbook]);

  function handleAutoSaveToggle(checked: boolean) {
    setAutoSave(checked);
    localStorage.setItem(autoSaveStorageKey, String(checked));
    if (!checked && debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }

  const saveDataToDB = useCallback(
    (data: ProductDataTableSchema) => {
      if (isSubmitted) return;

      const payload = {
        id: productId,
        tab: "operational-parameters",
        action: "add_operational_parameters",
        data: { workbook_data: data },
      };

      updateTabData(payload, {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          setLastSavedAt(new Date());
          onSaveSuccessRef.current();
        },
        onError: (error) => {
          console.error("Failed to save operational parameters:", error);
        },
      });
    },
    [isSubmitted, productId, updateTabData],
  );

  function handleAutoSave(data: ProductDataTableSchema) {
    if (isSubmitted) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      pendingDataRef.current = data;
      return;
    }

    setHasUnsavedChanges(true);
    setLastSavedAt(null);
    pendingDataRef.current = data;

    if (autoSave) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (pendingDataRef.current) {
          saveDataToDB(pendingDataRef.current);
        }
      }, 1500);
    }
  }

  function handleManualSave() {
    if (isSubmitted) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (pendingDataRef.current) {
      saveDataToDB(pendingDataRef.current);
    }
  }

  useEffect(() => {
    saveDataToDBRef.current = saveDataToDB;
  }, [saveDataToDB]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;

        if (pendingDataRef.current) {
          saveDataToDBRef.current(pendingDataRef.current);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isSubmitted) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    pendingDataRef.current = null;
  }, [isSubmitted]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasPendingAutoSave = !!debounceTimerRef.current;
      if (
        hasEditableUnsavedChanges &&
        (!autoSave || hasPendingAutoSave)
      ) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasEditableUnsavedChanges, autoSave]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex flex-col gap-6 border border-border bg-background rounded-xl w-full h-full overflow-y-auto">
          <div className="flex items-center justify-between border-b border-border py-2 px-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
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

  return (
    <div className="flex flex-1 flex-col gap-2 p-2 min-h-0 overflow-hidden">
      {isRedlineView && (
        <div className="px-2 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center gap-2 text-sm">
          <span className="text-amber-600 font-medium">
            {isLoadingDiff
              ? "Loading changes..."
              : "Redline View: Operational Parameters"}
          </span>
        </div>
      )}

      <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full min-h-0">
        <div className="flex items-center justify-between border-b border-border p-2 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Operational Parameters</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage operational parameters in the table below
            </p>
            <PageInfoDialog
              title="Keyboard Shortcuts"
              content={
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
              }
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

            {isSaving ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Spinner className="w-4 h-4" />
                <span className="text-xs">Saving...</span>
              </div>
            ) : hasEditableUnsavedChanges ? (
              <span className="text-xs text-amber-600">Unsaved changes</span>
            ) : lastSavedAt ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiCloudCheckDuotone className="w-4 h-4 text-green-600" />
                <span className="text-xs">Saved</span>
              </div>
            ) : null}

            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
              <span className="text-xs text-muted-foreground">Auto-save</span>
              <Switch
                checked={autoSave}
                onCheckedChange={handleAutoSaveToggle}
                className="scale-75"
                disabled={isSubmitted}
              />
            </div>

            <Button
              size="sm"
              variant={hasEditableUnsavedChanges ? "default" : "outline"}
              onClick={handleManualSave}
              disabled={
                isSaving ||
                !hasEditableUnsavedChanges ||
                isSubmitted
              }
              className="gap-1.5"
            >
              {isSaving ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <PiFloppyDiskDuotone className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <ProductSpecificationDataTable
          initialData={initialData}
          onDataChange={isSubmitted ? undefined : handleAutoSave}
          onSaveSuccess={(clearHistory) => {
            onSaveSuccessRef.current = clearHistory;
          }}
          isRedlineView={isRedlineView}
          isReadOnly={isSubmitted}
          redlineMode={redlineMode}
          redlineBaseData={redlineBaseData}
        />
      </div>
    </div>
  );
}
