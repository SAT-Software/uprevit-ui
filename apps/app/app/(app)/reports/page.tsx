"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Delete02Icon,
  SaveIcon,
  InboxDownloadIcon,
  SearchSquareIcon,
  TableIcon,
} from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { ExportButtons } from "@/features/workspace/reports/components/ExportButtons";
import {
  ExportFormat,
  ExportReportDialog,
} from "@/features/workspace/reports/components/ExportReportDialog";
import { LoadQueryDialog } from "@/features/workspace/reports/components/LoadQueryDialog";
import { QueryBuilder } from "@/features/workspace/reports/components/QueryBuilder/QueryBuilder";
import ReportExportsSheet from "@/features/workspace/reports/components/ReportExportsSheet";
import { ResultsTable } from "@/features/workspace/reports/components/ResultsTable";
import { SaveQueryDialog } from "@/features/workspace/reports/components/SaveQueryDialog";
import { useQueryBuilderState } from "@/features/workspace/reports/hooks/useQueryBuilderState";
import { useExportExcel, useExportPDF } from "@/hooks/reports/useExportReports";
import { useReportsQuery } from "@/hooks/reports/useReportsQuery";
import { useSavedQueries } from "@/hooks/reports/useSavedQueries";
import { ReportsProduct, SavedQuery } from "@/types/reports";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

export default function Page() {
  const {
    conditions,
    conditionLogic,
    addCondition,
    updateCondition,
    updateConditionLogic,
    removeCondition,
    clearConditions,
    loadConditions,
    validateConditions,
    getApiConditions,
  } = useQueryBuilderState();

  const reportsQuery = useReportsQuery();
  const exportPDF = useExportPDF();
  const exportExcel = useExportExcel();
  const { queries: savedQueries, saveQuery, deleteQuery } = useSavedQueries();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportsSheetOpen, setExportsSheetOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [results, setResults] = useState<{
    products: ReportsProduct[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } | null>(null);

  const handleExecuteQuery = async (page: number = 1) => {
    if (!validateConditions()) {
      toast.error("Please fill in all required fields for each condition.");
      return;
    }

    try {
      const response = await reportsQuery.mutateAsync({
        conditions: getApiConditions(),
        conditionLogic,
        pagination: { page, limit: 10 },
      });

      setResults(response.result);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to execute the query. Please try again.",
      );
    }
  };

  const handleSaveQuery = (name: string) => {
    const result = saveQuery(name, conditions, conditionLogic);
    if (result.success) {
      toast.success(`"${name}" has been saved locally.`);
    } else {
      toast.error(result.error || "Failed to save query.");
    }
  };

  const handleLoadQuery = (query: SavedQuery) => {
    loadConditions(query.conditions, query.conditionLogic);
    setResults(null);
    toast.success(`Loaded "${query.name}"`);
  };

  const handleDeleteQuery = (id: string) => {
    deleteQuery(id);
    toast.success("The saved query has been deleted.");
  };

  const handleOpenExportDialog = (format: ExportFormat) => {
    setExportFormat(format);
    setExportDialogOpen(true);
  };

  const handleExport = async (format: ExportFormat) => {
    if (!validateConditions()) {
      toast.error("Please fill in all required fields for each condition.");
      return;
    }

    try {
      if (format === "pdf") {
        await exportPDF.mutateAsync({
          conditions: getApiConditions(),
          conditionLogic,
        });
        toast.success("PDF export started.");
      } else {
        await exportExcel.mutateAsync({
          conditions: getApiConditions(),
          conditionLogic,
        });
        toast.success("Excel export started.");
      }

      setExportDialogOpen(false);
      setExportsSheetOpen(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to start ${format.toUpperCase()} export.`,
      );
    }
  };

  const handleClear = () => {
    clearConditions();
    setResults(null);
  };

  const isQueryValid = validateConditions();
  const hasExecutedResults = Boolean(results);
  const hasResultProducts = Boolean(results?.products.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-background p-2 pl-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Reports</p>
          <InfoTooltip content="Build custom queries across product data, run searches, and export results as PDF or Excel." />
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={() => setLoadDialogOpen(true)}
              >
                <Icon icon={InboxDownloadIcon} size={14} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load a saved query</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={() => setSaveDialogOpen(true)}
                disabled={conditions.length === 0}
              >
                <Icon icon={SaveIcon} size={14} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save current query</TooltipContent>
          </Tooltip>
          {conditions.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  onClick={handleClear}
                >
                  <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear all conditions</TooltipContent>
            </Tooltip>
          )}
          <ReportExportsSheet
            open={exportsSheetOpen}
            onOpenChange={setExportsSheetOpen}
          />

          <Button
            type="button"
            size="sm"
            onClick={() => handleExecuteQuery(1)}
            disabled={!isQueryValid || reportsQuery.isPending}
            className="gap-1.5"
          >
            {reportsQuery.isPending ? (
              <Spinner className="size-3.5" />
            ) : (
              <Icon icon={SearchSquareIcon} size={14} strokeWidth={2} />
            )}
            Run Query
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        <div className="space-y-8 pt-2">
          <QueryBuilder
            conditions={conditions}
            conditionLogic={conditionLogic}
            onAddCondition={addCondition}
            onUpdateCondition={updateCondition}
            onRemoveCondition={removeCondition}
            onConditionLogicChange={updateConditionLogic}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Query Results</p>
            {hasExecutedResults && results ? (
              <ResultsTable
                products={results.products}
                isLoading={reportsQuery.isPending}
                pagination={results.pagination}
                onPageChange={(page) => handleExecuteQuery(page)}
                headerActions={
                  hasResultProducts ? (
                    <ExportButtons
                      onExportPDF={() => handleOpenExportDialog("pdf")}
                      onExportExcel={() => handleOpenExportDialog("excel")}
                      isExportingPDF={exportPDF.isPending}
                      isExportingExcel={exportExcel.isPending}
                    />
                  ) : null
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-14 text-center">
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                  <Icon
                    icon={TableIcon}
                    size={20}
                    strokeWidth={2}
                    className="text-muted-foreground/60"
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No query results yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Build your query above and run it to see matching products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <SaveQueryDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveQuery}
        isConditionsEmpty={conditions.length === 0}
      />
      <LoadQueryDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        queries={savedQueries}
        onLoad={handleLoadQuery}
        onDelete={handleDeleteQuery}
      />
      <ExportReportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
        isExporting={exportPDF.isPending || exportExcel.isPending}
        format={exportFormat}
      />
    </div>
  );
}
