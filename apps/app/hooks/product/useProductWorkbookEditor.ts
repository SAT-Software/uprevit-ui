"use client";

import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { type ProductDataTableSchema } from "@/types/product-data-table";
import {
  normalizeWorkbookForComparison,
  serializeWorkbookForComparison,
} from "@/utils/product/product-spec";
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
  isContentLocked: boolean;
  serverWorkbookData: ProductDataTableSchema | undefined;
}

export function useProductWorkbookEditor({
  productId,
  tab,
  action,
  isContentLocked,
  serverWorkbookData,
}: UseProductWorkbookEditorOptions) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [tableResetKey, setTableResetKey] = useState(0);
  const pendingDataRef = useRef<ProductDataTableSchema | null>(null);
  const onSaveSuccessRef = useRef<() => void>(() => {});
  const savePromiseRef = useRef<Promise<void> | null>(null);

  const { mutate: updateTabData, isPending: isSaving } =
    useUpdateProductTabData();

  const serverBaseline = useMemo(
    () => normalizeWorkbookForComparison(serverWorkbookData),
    [serverWorkbookData],
  );

  const [savedBaseline, setSavedBaseline] = useState(serverBaseline);
  const [previousSource, setPreviousSource] = useState({
    productId,
    tab,
    serverBaseline,
  });
  if (
    previousSource.productId !== productId ||
    previousSource.tab !== tab ||
    previousSource.serverBaseline !== serverBaseline
  ) {
    setPreviousSource({ productId, tab, serverBaseline });
    setSavedBaseline(serverBaseline);
    setHasUnsavedChanges(false);
  }

  const hasEditableUnsavedChanges = hasUnsavedChanges && !isContentLocked;

  const registerClearHistoryOnSave = useCallback((clearHistory: () => void) => {
    onSaveSuccessRef.current = clearHistory;
  }, []);

  useEffect(() => {
    pendingDataRef.current = null;
  }, [productId, tab, tableResetKey, serverBaseline]);

  const saveDataToDB = useCallback(
    (data: ProductDataTableSchema): Promise<void> => {
      if (isContentLocked) return Promise.resolve();
      if (savePromiseRef.current) return savePromiseRef.current;

      const payload = {
        id: productId,
        tab,
        action,
        data: { workbook_data: data },
      };

      const savePromise = new Promise<void>((resolve, reject) => {
        updateTabData(payload, {
          onSuccess: () => {
            setSavedBaseline(serializeWorkbookForComparison(data));
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
      }).finally(() => {
        savePromiseRef.current = null;
      });
      savePromiseRef.current = savePromise;
      return savePromise;
    },
    [action, isContentLocked, productId, tab, updateTabData],
  );

  const isSavePending = useCallback(() => savePromiseRef.current !== null, []);

  const handleDataChange = useCallback(
    (data: ProductDataTableSchema) => {
      if (isContentLocked) return;

      pendingDataRef.current = data;
      setHasUnsavedChanges(
        serializeWorkbookForComparison(data) !== savedBaseline,
      );
    },
    [isContentLocked, savedBaseline],
  );

  const handleManualSave = useCallback(() => {
    if (isContentLocked || !pendingDataRef.current) return;
    void saveDataToDB(pendingDataRef.current);
  }, [isContentLocked, saveDataToDB]);

  const savePendingChanges = useCallback(async () => {
    if (!pendingDataRef.current) return;
    await saveDataToDB(pendingDataRef.current);
  }, [saveDataToDB]);

  const discardChanges = useCallback(() => {
    pendingDataRef.current = null;
    setSavedBaseline(serverBaseline);
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
    setTableResetKey((key) => key + 1);
  }, [serverBaseline]);

  useEffect(() => {
    if (!isContentLocked) return;
    pendingDataRef.current = null;
  }, [isContentLocked]);

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
    isSavePending,
    lastSavedAt,
    tableResetKey,
    handleDataChange,
    handleManualSave,
    savePendingChanges,
    discardChanges,
    registerClearHistoryOnSave,
  };
}
