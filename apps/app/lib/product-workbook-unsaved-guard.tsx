"use client";

import { UnsavedWorkbookChangesDialog } from "@/features/workspace/products/product/product-data-table/UnsavedWorkbookChangesDialog";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ProductWorkbookGuard = {
  tabLabel: string;
  isDirty: () => boolean;
  save: () => Promise<void>;
  discard: () => void;
};

type ProductWorkbookUnsavedGuardContextValue = {
  setActiveGuard: (guard: ProductWorkbookGuard | null) => void;
  tryNavigate: (href: string) => boolean;
  isNavigationBlocked: () => boolean;
};

const ProductWorkbookUnsavedGuardContext =
  createContext<ProductWorkbookUnsavedGuardContextValue | null>(null);

function normalizeHref(href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const url = new URL(href);
      return `${url.pathname}${url.search}`;
    } catch {
      return href;
    }
  }
  return href.split("#")[0] ?? href;
}

function isSameLocation(href: string): boolean {
  if (typeof window === "undefined") return false;
  const current = `${window.location.pathname}${window.location.search}`;
  return normalizeHref(href) === current;
}

export function ProductWorkbookUnsavedGuardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const guardRef = useRef<ProductWorkbookGuard | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogTabLabel, setDialogTabLabel] = useState("this tab");

  const setActiveGuard = useCallback((guard: ProductWorkbookGuard | null) => {
    guardRef.current = guard;
  }, []);

  const isNavigationBlocked = useCallback(() => {
    return guardRef.current?.isDirty() ?? false;
  }, []);

  const completeNavigation = useCallback(
    (href: string) => {
      setDialogOpen(false);
      setPendingHref(null);
      if (!isSameLocation(href)) {
        router.push(href);
      }
    },
    [router],
  );

  const tryNavigate = useCallback(
    (href: string): boolean => {
      if (isSameLocation(href)) {
        return true;
      }

      const guard = guardRef.current;
      if (!guard?.isDirty()) {
        router.push(href);
        return true;
      }

      setDialogTabLabel(guard.tabLabel);
      setPendingHref(href);
      setDialogOpen(true);
      return false;
    },
    [router],
  );

  const handleDialogSave = useCallback(async () => {
    const guard = guardRef.current;
    const href = pendingHref;
    if (!guard || !href) return;

    setIsSaving(true);
    try {
      await guard.save();
      completeNavigation(href);
    } finally {
      setIsSaving(false);
    }
  }, [completeNavigation, pendingHref]);

  const handleDialogDiscard = useCallback(() => {
    const guard = guardRef.current;
    const href = pendingHref;
    if (!guard || !href) return;

    guard.discard();
    completeNavigation(href);
  }, [completeNavigation, pendingHref]);

  const handleDialogCancel = useCallback(() => {
    setDialogOpen(false);
    setPendingHref(null);
  }, []);

  const value = useMemo(
    () => ({
      setActiveGuard,
      tryNavigate,
      isNavigationBlocked,
    }),
    [isNavigationBlocked, setActiveGuard, tryNavigate],
  );

  return (
    <ProductWorkbookUnsavedGuardContext.Provider value={value}>
      {children}
      <UnsavedWorkbookChangesDialog
        open={dialogOpen}
        tabLabel={dialogTabLabel}
        onOpenChange={(open) => {
          if (!open) handleDialogCancel();
        }}
        onSave={handleDialogSave}
        onDiscard={handleDialogDiscard}
        onCancel={handleDialogCancel}
        isSaving={isSaving}
      />
    </ProductWorkbookUnsavedGuardContext.Provider>
  );
}

export function useProductWorkbookUnsavedGuard() {
  const context = useContext(ProductWorkbookUnsavedGuardContext);
  if (!context) {
    throw new Error(
      "useProductWorkbookUnsavedGuard must be used within ProductWorkbookUnsavedGuardProvider",
    );
  }
  return context;
}

export function useProductWorkbookUnsavedGuardOptional() {
  return useContext(ProductWorkbookUnsavedGuardContext);
}

/** Registers workbook dirty state while the page is mounted. */
export function useRegisterProductWorkbookGuard(
  guard: Omit<ProductWorkbookGuard, "isDirty"> & {
    isDirty: boolean;
  } | null,
  enabled: boolean,
) {
  const context = useProductWorkbookUnsavedGuardOptional();
  const setActiveGuard = context?.setActiveGuard;

  useEffect(() => {
    if (!setActiveGuard) return;

    if (!enabled || !guard) {
      setActiveGuard(null);
      return;
    }

    setActiveGuard({
      tabLabel: guard.tabLabel,
      isDirty: () => guard.isDirty,
      save: guard.save,
      discard: guard.discard,
    });

    return () => setActiveGuard(null);
  }, [enabled, guard, setActiveGuard]);
}
