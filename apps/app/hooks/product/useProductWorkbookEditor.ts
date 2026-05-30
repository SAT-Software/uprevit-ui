"use client";

import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import { normalizeWorkbookForComparison } from "@/utils/product/product-spec";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type ProductWorkbookTab =
  | "product-specifications"
  | "operational-parameters";

type ProductWorkbookAction =
  | "add_product_data"
  | "add_operational_parameters";

interface UseProductWorkbookEditorOptions {
  productId: string;
  tab: ProductWorkbookTab;
  action: ProductWorkbookAction;
  isSubmitted: boolean;
  serverWorkbookData: ProductDataTableSchema | undefined;
}

function serializeWorkbookForComparison(
  data: ProductDataTableSchema,
): string {
  return JSON.stringify(data);
}

export function useProductWorkbookEditor({
  productId,
  tab,
  action,
  isSubmitted,
  serverWorkbookData,
}: UseProductWorkbookEditorOptions) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [tableResetKey, setTableResetKey] = useState(0);
  const pendingDataRef = useRef<ProductDataTableSchema | null>(null);
  const onSaveSuccessRef = useRef<() => void>(() => {});
  const savedBaselineRef = useRef<string | null>(null);

  const { mutate: updateTabData, isPending: isSaving } =
    useUpdateProductTabData();

  const serverBaseline = useMemo(
    () => normalizeWorkbookForComparison(serverWorkbookData),
    [serverWorkbookData],
  );

  const hasEditableUnsavedChanges = hasUnsavedChanges && !isSubmitted;

  const registerClearHistoryOnSave = useCallback((clearHistory: () => void) => {
    onSaveSuccessRef.current = clearHistory;
  }, []);

  useEffect(() => {
    savedBaselineRef.current = serverBaseline;
    pendingDataRef.current = null;
    setHasUnsavedChanges(false);
  }, [productId, tab, tableResetKey, serverBaseline]);

  const saveDataToDB = useCallback(
    (data: ProductDataTableSchema): Promise<void> => {
      if (isSubmitted) return Promise.resolve();

      const payload = {
        id: productId,
        tab,
        action,
        data: { workbook_data: data },
      };

      return new Promise((resolve, reject) => {
        updateTabData(payload, {
          onSuccess: () => {
            const savedSnapshot = serializeWorkbookForComparison(data);
            savedBaselineRef.current = savedSnapshot;
            setHasUnsavedChanges(false);
            setLastSavedAt(new Date());
            onSaveSuccessRef.current();
            resolve();
          },
          onError: (error) => {
            console.error(`Failed to save ${tab}:`, error);
            reject(error);
          },
        });
      });
    },
    [action, isSubmitted, productId, tab, updateTabData],
  );

  const handleDataChange = useCallback(
    (data: ProductDataTableSchema) => {
      if (isSubmitted) return;

      pendingDataRef.current = data;
      const currentSnapshot = serializeWorkbookForComparison(data);
      const baseline = savedBaselineRef.current ?? serverBaseline;
      setHasUnsavedChanges(currentSnapshot !== baseline);
    },
    [isSubmitted, serverBaseline],
  );

  const handleManualSave = useCallback(() => {
    if (isSubmitted || !pendingDataRef.current) return;
    void saveDataToDB(pendingDataRef.current);
  }, [isSubmitted, saveDataToDB]);

  const savePendingChanges = useCallback(async () => {
    if (!pendingDataRef.current) return;
    await saveDataToDB(pendingDataRef.current);
  }, [saveDataToDB]);

  const discardChanges = useCallback(() => {
    pendingDataRef.current = null;
    savedBaselineRef.current = serverBaseline;
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
    setTableResetKey((key) => key + 1);
  }, [serverBaseline]);

  useEffect(() => {
    if (!isSubmitted) return;
    pendingDataRef.current = null;
  }, [isSubmitted]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasEditableUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasEditableUnsavedChanges]);

  return {
    hasEditableUnsavedChanges,
    isSaving,
    lastSavedAt,
    tableResetKey,
    handleDataChange,
    handleManualSave,
    savePendingChanges,
    discardChanges,
    registerClearHistoryOnSave,
  };
}
