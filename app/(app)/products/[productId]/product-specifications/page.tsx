"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { ProductSpecificationDataTable } from "@/features/workspace/products/product/product-data-table/ProductSpecificationDataTable";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import { parseProductSpecDataFromDatabase } from "@/utils/product/product-spec";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  PiCloudCheckDuotone,
  PiFloppyDiskDuotone,
  PiWarningCircleDuotone,
} from "react-icons/pi";

const AUTO_SAVE_STORAGE_KEY = "product-data-table-auto-save";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId ?? "";
  const [autoSave, setAutoSave] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(AUTO_SAVE_STORAGE_KEY);
      return stored !== "false";
    }
    return true;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<ProductDataTableSchema | null>(null);
  const isFirstRender = useRef(true);
  const onSaveSuccessRef = useRef<() => void>(() => {});

  const {
    data: productTabData,
    isLoading,
    error,
  } = useGetProductTabData(productId, "product-specifications");
  const { mutate: updateTabData, isPending: isSaving } =
    useUpdateProductTabData();

  const workbookData = productTabData?.result?.data?.data?.workbook_data;

  const initialData = useMemo(() => {
    return parseProductSpecDataFromDatabase(workbookData);
  }, [workbookData]);

  function handleAutoSaveToggle(checked: boolean) {
    setAutoSave(checked);
    localStorage.setItem(AUTO_SAVE_STORAGE_KEY, String(checked));
    if (!checked && debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }

  function saveDataToDB(data: ProductDataTableSchema) {
    const payload = {
      id: productId,
      tab: "product-specifications",
      action: "add_product_data",
      data: { workbook_data: data },
    };

    updateTabData(payload, {
      onSuccess: () => {
        setHasUnsavedChanges(false);
        setLastSavedAt(new Date());
        onSaveSuccessRef.current();
      },
    });
  }

  function handleAutoSave(data: ProductDataTableSchema) {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      pendingDataRef.current = data;
      return;
    }

    setHasUnsavedChanges(true);
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
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (pendingDataRef.current) {
      saveDataToDB(pendingDataRef.current);
    }
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !autoSave) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, autoSave]);

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
                  Error Loading Product Data
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
      <div className="flex flex-col border border-border bg-background rounded-xl w-full h-full min-h-0">
        <div className="flex items-center justify-between border-b border-border p-2 shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Product Specifications</p>
            <div className="w-1 h-1 bg-border border border-border rounded-full" />
            <p className="text-xs text-muted-foreground font-medium">
              Manage product data in the table below
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSaving ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Spinner className="w-4 h-4" />
                <span className="text-xs">Saving...</span>
              </div>
            ) : lastSavedAt ? (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiCloudCheckDuotone className="w-4 h-4 text-green-600" />
                <span className="text-xs">Saved</span>
              </div>
            ) : hasUnsavedChanges ? (
              <span className="text-xs text-amber-600">Unsaved changes</span>
            ) : null}

            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/50">
              <span className="text-xs text-muted-foreground">Auto-save</span>
              <Switch
                checked={autoSave}
                onCheckedChange={handleAutoSaveToggle}
                className="scale-75"
              />
            </div>

            <Button
              size="sm"
              variant={hasUnsavedChanges ? "default" : "outline"}
              onClick={handleManualSave}
              disabled={isSaving || !hasUnsavedChanges}
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
          onDataChange={handleAutoSave}
          onSaveSuccess={(clearHistory) => {
            onSaveSuccessRef.current = clearHistory;
          }}
        />
      </div>
    </div>
  );
}
