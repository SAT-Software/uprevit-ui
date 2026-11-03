"use client";

import { useMemo, useRef, useState } from "react";
import {
  FolderAddIcon,
  InformationCircleIcon,
  MinusSignCircleIcon,
  PlusSignSquareIcon,
  RefreshIcon,
  Xls02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import type { ImportProjectChoice, ImportRowStatus } from "@/types/product-import";
import { planKey, type ImportRow } from "@/utils/product/product-import-review";
import { ProductImportAssignDialog } from "./ProductImportAssignDialog";
import { ProductImportDestination } from "./ProductImportDestination";
import { ProductImportDetailsSheet } from "./ProductImportDetailsSheet";
import { ProductImportStatusBadge } from "./ProductImportStatusBadge";

const PAGE_SIZE = 100;

type Filter = "all" | ImportRowStatus;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "ready", label: "Ready" },
  { value: "needs-project", label: "Needs project" },
  { value: "error", label: "Errors" },
  { value: "excluded", label: "Left out" },
];

const EMPTY_FILTER_TEXT: Record<Filter, string> = {
  all: "The file has no products.",
  ready: "No product is ready yet. Assign projects or fix errors in the file.",
  "needs-project": "Every product has a project.",
  error: "No product has errors.",
  excluded: "No product is left out.",
};

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

function contentsSummary(row: ImportRow) {
  const { product } = row;
  return [
    plural(product.compliance.length, "standard"),
    plural(product.languages.length, "language"),
    plural(product.label_components.length, "component"),
  ].join(" · ");
}

interface ProductImportReviewProps {
  fileName: string;
  rows: ImportRow[];
  notices: string[];
  customFieldColumns: string[];
  excludedColumns: Set<string>;
  onToggleColumn: (column: string) => void;
  onAssign: (planNumbers: string[], project: ImportProjectChoice) => void;
  onExclude: (planNumbers: string[], excluded: boolean) => void;
  onChooseAnotherFile: () => void;
  onCreate: () => void;
}

export function ProductImportReview({
  fileName,
  rows,
  notices,
  customFieldColumns,
  excludedColumns,
  onToggleColumn,
  onAssign,
  onExclude,
  onChooseAnotherFile,
  onCreate,
}: ProductImportReviewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [assignOpen, setAssignOpen] = useState(false);
  const [detailsRowNumber, setDetailsRowNumber] = useState<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openDetails = (rowNumber: number, trigger: HTMLElement) => {
    returnFocus.current = trigger;
    setDetailsRowNumber(rowNumber);
  };

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: rows.length, ready: 0, "needs-project": 0, error: 0, excluded: 0 };
    rows.forEach((row) => { result[row.status] += 1; });
    return result;
  }, [rows]);

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [rows, filter],
  );
  const shown = visible.slice(0, limit);
  const selectedRows = rows.filter((row) => selected.has(planKey(row.product.product_plan_number)));
  const visibleKeys = visible.map((row) => planKey(row.product.product_plan_number));
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selected.has(key));
  const someVisibleSelected = visibleKeys.some((key) => selected.has(key));
  const detailsRow = detailsRowNumber === null ? null : rows.find((row) => row.product.row === detailsRowNumber) ?? null;
  const selectedPlans = selectedRows.map((row) => row.product.product_plan_number);

  const toggle = (key: string, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const toggleAllVisible = (checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      visibleKeys.forEach((key) => (checked ? next.add(key) : next.delete(key)));
      return next;
    });
  };

  const changeFilter = (value: string) => {
    setFilter(value as Filter);
    setLimit(PAGE_SIZE);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-10 shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-2">
          <Icon icon={Xls02Icon} className="shrink-0 text-muted-foreground" />
          <p className="min-w-0 truncate text-sm font-medium" title={fileName}>{fileName}</p>
          <Button type="button" variant="ghost" size="sm" onClick={onChooseAnotherFile}>
            <Icon icon={RefreshIcon} />
            Choose another file
          </Button>
        </div>
        <Button type="button" size="sm" onClick={onCreate} disabled={!counts.ready}>
          <Icon icon={PlusSignSquareIcon} className="text-primary-foreground/60" />
          {counts.ready ? `Create ${plural(counts.ready, "draft product")}` : "Create draft products"}
        </Button>
      </div>

      <div className="flex h-10 shrink-0 items-center overflow-x-auto border-b border-border px-2">
        <Tabs value={filter} onValueChange={changeFilter} className="w-max shrink-0">
          <TabsList variant="line" aria-label="Filter products">
            {FILTERS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
                <span className="text-muted-foreground tabular-nums">{counts[item.value]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {(notices.length > 0 || customFieldColumns.length > 0) && (
          <div className="space-y-3 border-b border-border px-4 py-3">
            {notices.map((notice) => (
              <p key={notice} className="flex gap-2 text-sm text-pretty">
                <Icon icon={InformationCircleIcon} className="mt-0.5 shrink-0 text-muted-foreground" />
                {notice}
              </p>
            ))}
            {customFieldColumns.length > 0 && (
              <fieldset className="space-y-2">
                <legend className="flex gap-2 text-sm text-pretty">
                  <Icon icon={InformationCircleIcon} className="mt-0.5 shrink-0 text-muted-foreground" />
                  These extra columns on Products become custom fields. Clear any you don&apos;t want to import.
                </legend>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pl-6">
                  {customFieldColumns.map((column) => (
                    <label key={column} className="flex min-h-6 items-center gap-2 text-sm">
                      <Checkbox
                        checked={!excludedColumns.has(column)}
                        onCheckedChange={() => onToggleColumn(column)}
                      />
                      {column}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}

        {selectedRows.length > 0 && (
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-background px-3 py-1.5" role="region" aria-label="Selected products">
            <p className="mr-auto text-sm tabular-nums">{plural(selectedRows.length, "product")} selected</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(event) => {
                returnFocus.current = event.currentTarget;
                setAssignOpen(true);
              }}
            >
              <Icon icon={FolderAddIcon} />
              Assign project
            </Button>
            {selectedRows.some((row) => row.status !== "excluded") ? (
              <Button type="button" variant="outline" size="sm" onClick={() => onExclude(selectedPlans, true)}>
                <Icon icon={MinusSignCircleIcon} />
                Leave out
              </Button>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => onExclude(selectedPlans, false)}>
                <Icon icon={PlusSignSquareIcon} />
                Include again
              </Button>
            )}
            <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
              Clear selection
            </Button>
          </div>
        )}

        {visible.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={InformationCircleIcon} title={EMPTY_FILTER_TEXT[filter]} />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 pl-3">
                  <Checkbox
                    aria-label="Select all products in this list"
                    checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                    onCheckedChange={(checked) => toggleAllVisible(checked === true)}
                  />
                </TableHead>
                <TableHead>Plan number</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Contents</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((row) => {
                const key = planKey(row.product.product_plan_number);
                const firstIssue = row.issues.find((issue) => issue.level === "error") ?? row.issues[0];
                return (
                  <TableRow key={`${key}-${row.product.row}`} data-state={selected.has(key) ? "selected" : undefined}>
                    <TableCell className="pl-3">
                      <Checkbox
                        aria-label={`Select ${row.product.product_plan_number}, row ${row.product.row}`}
                        checked={selected.has(key)}
                        onCheckedChange={(checked) => toggle(key, checked === true)}
                      />
                    </TableCell>
                    <TableCell className="max-w-40 truncate font-medium tabular-nums" title={row.product.product_plan_number}>
                      {row.product.product_plan_number}
                    </TableCell>
                    <TableCell className="max-w-72">
                      <button
                        type="button"
                        onClick={(event) => openDetails(row.product.row, event.currentTarget)}
                        className="block max-w-full truncate rounded-sm text-left text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                        title={row.product.product_name}
                      >
                        {row.product.product_name || "No product name"}
                      </button>
                    </TableCell>
                    <TableCell className="max-w-56">
                      <ProductImportDestination row={row} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground text-xs tabular-nums">
                      {contentsSummary(row)}
                    </TableCell>
                    <TableCell className="max-w-80">
                      <div className="space-y-1">
                        <ProductImportStatusBadge row={row} />
                        {firstIssue && row.status !== "excluded" && (
                          <p className="line-clamp-2 whitespace-normal text-muted-foreground text-xs text-pretty">
                            {firstIssue.message}
                          </p>
                        )}
                        {row.issues.length > 1 && row.status !== "excluded" && (
                          <button
                            type="button"
                            onClick={(event) => openDetails(row.product.row, event.currentTarget)}
                            className="rounded-sm text-xs font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                          >
                            View all {row.issues.length} problems
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {visible.length > shown.length && (
          <div className="flex justify-center p-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
              Show {Math.min(PAGE_SIZE, visible.length - shown.length)} more of {visible.length - shown.length}
            </Button>
          </div>
        )}
      </div>

      <ProductImportAssignDialog
        open={assignOpen}
        count={selectedRows.length}
        onOpenChange={setAssignOpen}
        onAssign={(project) => onAssign(selectedPlans, project)}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocus.current?.focus();
        }}
      />
      <ProductImportDetailsSheet
        row={detailsRow}
        excludedColumns={excludedColumns}
        onOpenChange={(open) => !open && setDetailsRowNumber(null)}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          returnFocus.current?.focus();
        }}
      />
    </div>
  );
}
