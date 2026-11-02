"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LockIcon } from "@hugeicons/core-free-icons";
import { useAuth } from "react-oidc-context";
import { EmptyState } from "@/components/common/EmptyState";
import { useCheckProductImport } from "@/hooks/product/useCheckProductImport";
import { IMPORT_BATCH_SIZE, useImportProducts } from "@/hooks/product/useImportProducts";
import { getErrorMessage } from "@/lib/api-error";
import type { ImportCheckResult, ImportCreateResult, ImportProjectChoice, ImportWorkbook } from "@/types/product-import";
import { isAdminProfile } from "@/utils/isAdmin";
import { parseImportWorkbook } from "@/utils/product/product-import-workbook";
import { buildImportRows, importCheckInput, planKey, toImportPayload } from "@/utils/product/product-import-review";
import { ProductImportProgress, ProductImportResult } from "./ProductImportResult";
import { ProductImportReview } from "./ProductImportReview";
import { ProductImportUpload } from "./ProductImportUpload";

type Loaded = { fileName: string; workbook: ImportWorkbook; check: ImportCheckResult };

export function ProductImportFlow() {
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);
  const { mutateAsync: checkImport } = useCheckProductImport();
  const { importBatch, refreshLists } = useImportProducts();

  const [busyLabel, setBusyLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [assignments, setAssignments] = useState<Map<string, ImportProjectChoice>>(new Map());
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [excludedColumns, setExcludedColumns] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [results, setResults] = useState<ImportCreateResult[] | null>(null);

  const rows = useMemo(
    () => (loaded ? buildImportRows(loaded.workbook.products, loaded.check, assignments, excluded) : []),
    [loaded, assignments, excluded],
  );

  const stopped = useRef(false);
  useEffect(() => {
    stopped.current = false;
    return () => {
      stopped.current = true;
    };
  }, []);

  useEffect(() => {
    if (!progress) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    const confirmLeave = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!link || link.getAttribute("target") === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) return;
      if (!window.confirm("Products are still being created. Leave this page? The import stops after the current batch.")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", confirmLeave, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", confirmLeave, true);
    };
  }, [progress]);

  const reset = () => {
    setLoaded(null);
    setAssignments(new Map());
    setExcluded(new Set());
    setExcludedColumns(new Set());
    setResults(null);
    setError(null);
  };

  const handleFile = async (file: File) => {
    if (busyLabel) return;
    reset();
    try {
      setBusyLabel("Reading the file…");
      const workbook = parseImportWorkbook(await file.arrayBuffer());
      setBusyLabel("Checking plan numbers and projects in your workspace…");
      const check = await checkImport(importCheckInput(workbook.products));
      setLoaded({ fileName: file.name, workbook, check });
    } catch (caught) {
      setError(getErrorMessage(caught, "The file couldn't be read. Check that it's the Uprevit import template and try again."));
    } finally {
      setBusyLabel(null);
    }
  };

  const runImport = async (planNumbers?: Set<string>) => {
    const ready = rows.filter(
      (row) => row.status === "ready" && (!planNumbers || planNumbers.has(planKey(row.product.product_plan_number))),
    );
    const previous = (results ?? []).filter((result) => result.status === "created");
    const collected: ImportCreateResult[] = [];
    setResults(null);
    setProgress({ done: 0, total: ready.length });
    for (let index = 0; index < ready.length; index += IMPORT_BATCH_SIZE) {
      if (stopped.current) return;
      const batch = ready.slice(index, index + IMPORT_BATCH_SIZE);
      try {
        collected.push(...(await importBatch(batch.map((row) => toImportPayload(row, excludedColumns)))));
      } catch (caught) {
        const message = getErrorMessage(caught, "The products couldn't be created");
        ready.slice(index).forEach((row) => collected.push({ plan_number: row.product.product_plan_number, status: "failed", error: message }));
        break;
      }
      setProgress({ done: Math.min(index + IMPORT_BATCH_SIZE, ready.length), total: ready.length });
    }
    refreshLists();
    setProgress(null);
    setResults([...previous, ...collected]);
  };

  const createdSummary = useMemo(() => {
    const created = new Set((results ?? []).filter((result) => result.status === "created").map((result) => planKey(result.plan_number)));
    const projects = new Set<string>();
    const departments = new Set<string>();
    for (const row of rows) {
      if (!created.has(planKey(row.product.product_plan_number)) || row.destination.kind !== "new") continue;
      projects.add(`${planKey(row.product.department_name)}\n${planKey(row.product.project_name)}`);
      if (row.destination.createsDepartment) departments.add(planKey(row.product.department_name));
    }
    return { projects: projects.size, departments: departments.size };
  }, [results, rows]);

  if (!isAdmin) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <EmptyState
          icon={LockIcon}
          title="Only workspace admins can import products"
          description="Ask a workspace admin to import the file, or to create the products for you."
        />
      </div>
    );
  }

  if (progress) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ProductImportProgress done={progress.done} total={progress.total} />
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
      <ProductImportResult
        results={results}
        createdProjects={createdSummary.projects}
        createdDepartments={createdSummary.departments}
        onRetry={() => runImport(new Set(results.filter((result) => result.status === "failed").map((result) => planKey(result.plan_number))))}
        onImportAnother={reset}
      />
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ProductImportUpload busyLabel={busyLabel} error={error} onFile={handleFile} />
      </div>
    );
  }

  return (
    <ProductImportReview
      fileName={loaded.fileName}
      rows={rows}
      notices={loaded.workbook.notices}
      customFieldColumns={loaded.workbook.customFieldColumns}
      excludedColumns={excludedColumns}
      onToggleColumn={(column) =>
        setExcludedColumns((current) => {
          const next = new Set(current);
          if (next.has(column)) next.delete(column);
          else next.add(column);
          return next;
        })
      }
      onAssign={(planNumbers, project) =>
        setAssignments((current) => {
          const next = new Map(current);
          planNumbers.forEach((planNumber) => next.set(planKey(planNumber), project));
          return next;
        })
      }
      onExclude={(planNumbers, value) =>
        setExcluded((current) => {
          const next = new Set(current);
          planNumbers.forEach((planNumber) => (value ? next.add(planKey(planNumber)) : next.delete(planKey(planNumber))));
          return next;
        })
      }
      onChooseAnotherFile={reset}
      onCreate={() => runImport()}
    />
  );
}
