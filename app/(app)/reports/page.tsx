"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  PiFloppyDiskDuotone,
  PiFolderOpenDuotone,
  PiMagnifyingGlassDuotone,
  PiTrashDuotone,
} from "react-icons/pi";
import { toast } from "sonner";

import { ExportButtons } from "@/features/workspace/reports/components/ExportButtons";
import {
  ExportFormat,
  ExportReportDialog,
} from "@/features/workspace/reports/components/ExportReportDialog";
import { LoadQueryDialog } from "@/features/workspace/reports/components/LoadQueryDialog";
import { ResultsTable } from "@/features/workspace/reports/components/ResultsTable";
import { SaveQueryDialog } from "@/features/workspace/reports/components/SaveQueryDialog";
import { useQueryBuilderState } from "@/features/workspace/reports/hooks/useQueryBuilderState";
import { useExportExcel, useExportPDF } from "@/hooks/reports/useExportReports";
import { useReportsQuery } from "@/hooks/reports/useReportsQuery";
import { useSavedQueries } from "@/hooks/reports/useSavedQueries";
import { ReportsProduct, SavedQuery } from "@/types/reports";
import { QueryBuilder } from "@/features/workspace/reports/components/QueryBuilder/QueryBuilder";

export default function Page() {
  const {
    conditions,
    conditionLogic,
    setConditionLogic,
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
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [currentPage, setCurrentPage] = useState(1);
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
      setCurrentPage(page);
    } catch (error) {
      toast.error("Failed to execute the query. Please try again.");
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

  const handleExport = async (header: string, format: ExportFormat) => {
    if (!validateConditions()) {
      toast.error("Please fill in all required fields for each condition.");
      return;
    }
    try {
      if (format === "pdf") {
        await exportPDF.mutateAsync({
          conditions: getApiConditions(),
          conditionLogic,
          reportHeader: header,
        });
        toast.success("PDF has been downloaded.");
      } else {
        await exportExcel.mutateAsync({
          conditions: getApiConditions(),
          conditionLogic,
          reportHeader: header,
        });
        toast.success("Excel file has been downloaded.");
      }
      setExportDialogOpen(false);
    } catch {
      toast.error(`Failed to export ${format.toUpperCase()}.`);
    }
  };

  const handleClear = () => {
    clearConditions();
    setResults(null);
    setCurrentPage(1);
  };

  const isQueryValid = validateConditions();
  const hasResults = results && results.products.length > 0;

  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-2 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">Reports</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Search and filter products across all data
            </p>
          </div>
        </div>

        <Card className="w-full h-auto">
          <CardContent className="p-2 space-y-2">
            <QueryBuilder
              conditions={conditions}
              conditionLogic={conditionLogic}
              onAddCondition={addCondition}
              onUpdateCondition={updateCondition}
              onRemoveCondition={removeCondition}
              onLogicChange={setConditionLogic}
              onConditionLogicChange={updateConditionLogic}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSaveDialogOpen(true)}
                  disabled={conditions.length === 0}
                  className="gap-1.5"
                >
                  <PiFloppyDiskDuotone size={16} />
                  Save Query
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setLoadDialogOpen(true)}
                  className="gap-1.5"
                >
                  <PiFolderOpenDuotone size={16} />
                  Load Saved
                </Button>
                {conditions.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="gap-1.5 text-muted-foreground"
                  >
                    <PiTrashDuotone size={16} />
                    Clear
                  </Button>
                )}
              </div>
              <Button
                onClick={() => handleExecuteQuery(1)}
                disabled={!isQueryValid || reportsQuery.isPending}
                className="gap-1.5"
              >
                <PiMagnifyingGlassDuotone size={16} />
                {reportsQuery.isPending ? "Searching..." : "Execute Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {(results || reportsQuery.isPending) && (
          <Card className="w-full h-auto">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Results</CardTitle>
                {hasResults && (
                  <ExportButtons
                    onExportPDF={() => handleOpenExportDialog("pdf")}
                    onExportExcel={() => handleOpenExportDialog("excel")}
                    isExportingPDF={exportPDF.isPending}
                    isExportingExcel={exportExcel.isPending}
                    disabled={!hasResults}
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ResultsTable
                products={results?.products || []}
                isLoading={reportsQuery.isPending}
                pagination={
                  results?.pagination || {
                    total: 0,
                    page: 1,
                    limit: 10,
                    totalPages: 0,
                  }
                }
                onPageChange={(page) => handleExecuteQuery(page)}
              />
            </CardContent>
          </Card>
        )}

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
    </div>
  );
}
