"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@uprevit/ui/components/ui/card";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Input } from "@uprevit/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@uprevit/ui/components/ui/tabs";
import { TagInput, Tag } from "@uprevit/ui/components/ui/tag-input";
import Link from "next/link";
import { toast } from "sonner";
import {
  PiExportDuotone,
  PiMagnifyingGlassDuotone,
  PiFloppyDiskDuotone,
  PiFolderOpenDuotone,
  PiTrashDuotone,
  PiFunnelDuotone,
  PiTableDuotone,
  PiPlusCircleDuotone,
  PiXCircleDuotone,
  PiCaretDownDuotone,
} from "react-icons/pi";
import { cn } from "@uprevit/ui/lib/utils";

import { ExportButtons } from "@/features/workspace/reports/components/ExportButtons";
import { ReportExportsTable } from "@/features/workspace/reports/components/ReportExportsTable";
import {
  ExportFormat,
  ExportReportDialog,
} from "@/features/workspace/reports/components/ExportReportDialog";
import { LoadQueryDialog } from "@/features/workspace/reports/components/LoadQueryDialog";
import { SaveQueryDialog } from "@/features/workspace/reports/components/SaveQueryDialog";
import { useQueryBuilderState } from "@/features/workspace/reports/hooks/useQueryBuilderState";
import { useExportExcel, useExportPDF } from "@/hooks/reports/useExportReports";
import { useGetReportExportJobs } from "@/hooks/reports/useGetReportExportJobs";
import { useReportsQuery } from "@/hooks/reports/useReportsQuery";
import { useSavedQueries } from "@/hooks/reports/useSavedQueries";
import { ExportJobStatus } from "@/types/export-job";
import { ReportsProduct, SavedQuery, QueryCondition } from "@/types/reports";
import {
  QUERYABLE_TABS,
  OPERATORS,
  getFieldsForTab,
  Operator,
} from "@/data/reports-config";

const ACTIVE_EXPORT_JOB_STATUSES: ExportJobStatus[] = ["queued", "processing"];

function ConditionRow({
  condition,
  onUpdate,
  onRemove,
  isFirst,
  position,
}: {
  condition: QueryCondition;
  onUpdate: (updates: Partial<Omit<QueryCondition, "id">>) => void;
  onRemove: () => void;
  isFirst: boolean;
  position: number;
}) {
  const fields = getFieldsForTab(condition.tab);
  const selectedField = fields.find((f) => f.key === condition.field);
  const needsValue =
    condition.operator !== "exists" && condition.operator !== "not_exists";

  const [tags, setTags] = useState<Tag[]>(() => {
    if (Array.isArray(condition.value)) {
      return condition.value.map((text, index) => ({
        id: `tag-${index}-${text}`,
        text,
      }));
    }
    return [];
  });

  React.useEffect(() => {
    if (Array.isArray(condition.value)) {
      const newTags = condition.value.map((text, index) => ({
        id: `tag-${index}-${text}`,
        text,
      }));
      setTags(newTags);
    } else {
      setTags([]);
    }
  }, [condition.value]);

  const handleTagsChange = (newTags: Tag[]) => {
    setTags(newTags);
    const stringArray = newTags.map((tag) => tag.text);
    onUpdate({ value: stringArray });
  };

  const handleFieldChange = (value: string) => {
    const textOperators = [
      "equals",
      "not_equals",
      "contains",
      "not_contains",
      "exists",
      "not_exists",
    ];
    const currentOperator = condition.operator;
    const newOperator = textOperators.includes(currentOperator)
      ? currentOperator
      : "equals";
    setTags([]);
    onUpdate({ field: value, value: "", operator: newOperator });
  };

  return (
    <div className="relative">
      {!isFirst && (
        <div className="absolute -top-3 left-8 z-10">
          <Badge
            variant="outline"
            className="h-5 px-1.5 text-[10px] font-medium bg-background border-dashed"
          >
            {condition.logic || "AND"}
          </Badge>
        </div>
      )}
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg border bg-card transition-all",
          "hover:border-primary/30 hover:shadow-sm",
          isFirst && "mt-0",
        )}
      >
        <div className="flex items-center gap-2 shrink-0">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                "bg-primary/10 text-primary",
              )}
            >
              {position}
            </div>
          </div>

        <Select
          value={condition.tab}
          onValueChange={(value) =>
            onUpdate({ tab: value, field: "", value: "" })
          }
        >
          <SelectTrigger className="w-44 shrink-0 [&>span]:truncate">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {QUERYABLE_TABS.map((tab) => (
              <SelectItem key={tab.key} value={tab.key}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={condition.field}
          onValueChange={handleFieldChange}
          disabled={!condition.tab}
        >
          <SelectTrigger className="w-[220px] shrink-0 [&>span]:truncate">
            <SelectValue placeholder="Field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.key} value={field.key}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={condition.operator}
          onValueChange={(value) => onUpdate({ operator: value as Operator })}
          disabled={!condition.field}
        >
          <SelectTrigger className="w-[180px] shrink-0 [&>span]:truncate">
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            {OPERATORS.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {needsValue && (
          <>
            {selectedField?.type === "select" && selectedField.options ? (
              <Select
                value={(condition.value as string) || ""}
                onValueChange={(value) => onUpdate({ value })}
                disabled={!condition.field}
              >
                <SelectTrigger className="w-40 shrink-0">
                  <SelectValue placeholder="Value" />
                </SelectTrigger>
                <SelectContent>
                  {selectedField.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : selectedField?.type === "array" ? (
              <div className="flex-1 min-w-[200px]">
                <TagInput
                  tags={tags}
                  setTags={handleTagsChange}
                  placeholder="Add values..."
                  disabled={!condition.field}
                />
              </div>
            ) : (
              <Input
                placeholder="Enter value..."
                value={(condition.value as string) || ""}
                onChange={(e) => onUpdate({ value: e.target.value })}
                disabled={!condition.field}
                className="flex-1"
              />
            )}
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            >
              <PiXCircleDuotone size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove condition</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

function ResultsTable({
  products,
  isLoading,
  pagination,
  onPageChange,
}: {
  products: ReportsProduct[];
  isLoading?: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-blue-500";
      case "submitted":
        return "bg-green-500";
      case "archived":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-10 bg-muted/50 rounded-lg animate-pulse" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
          <PiMagnifyingGlassDuotone
            size={32}
            className="text-muted-foreground"
          />
        </div>
        <p className="text-sm font-medium text-foreground">No products found</p>
        <p className="text-xs text-muted-foreground mt-1">
          No products match this query. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">{products.length}</span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {pagination.total}
          </span>{" "}
          products
        </p>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  PPN
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Product Name
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Project
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Version
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const productHref = `/products/${product._id}/product-information`;
                return (
                  <tr
                    key={product._id}
                    className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-0">
                      <Link
                        href={productHref}
                        className="flex items-center py-3 px-4 font-medium text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {product.product_plan_number}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium text-sm">
                      {product.product_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {product.project_name || "—"}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {product.department_name || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-normal gap-1.5">
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            getStatusColor(product.status),
                          )}
                        />
                        <span className="capitalize">{product.status}</span>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="font-mono text-xs">
                        v{product.version || 1}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="gap-1.5"
          >
            <PiCaretDownDuotone size={14} className="rotate-90" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="gap-1.5"
          >
            Next
            <PiCaretDownDuotone size={14} className="-rotate-90" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const {
    conditions,
    conditionLogic,
    setConditionLogic,
    addCondition,
    updateCondition,
    removeCondition,
    clearConditions,
    loadConditions,
    validateConditions,
    getApiConditions,
  } = useQueryBuilderState();

  const reportsQuery = useReportsQuery();
  const exportPDF = useExportPDF();
  const exportExcel = useExportExcel();
  const { data: exportJobsData } = useGetReportExportJobs(
    { page: 1 },
    { enabled: true, pollWhenActive: true },
  );
  const { queries: savedQueries, saveQuery, deleteQuery } = useSavedQueries();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("pdf");
  const [activeTab, setActiveTab] = useState("builder");
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
      setActiveTab("results");
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
    setActiveTab("builder");
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
      setActiveTab("exports");
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
    setActiveTab("builder");
  };

  const isQueryValid = validateConditions();
  const hasExecutedResults = Boolean(results);
  const hasResultProducts = Boolean(results?.products.length);
  const reportExportJobs = exportJobsData?.result.jobs ?? [];
  const activeReportExportCount =
    typeof exportJobsData?.result.activeJobsCount === "number"
      ? exportJobsData.result.activeJobsCount
      : reportExportJobs.filter((job) =>
          ACTIVE_EXPORT_JOB_STATUSES.includes(job.status),
        ).length;
  const latestReportExportJob = reportExportJobs[0];

  const renderExportTabIndicator = () => {
    if (activeReportExportCount > 0) {
      return (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {activeReportExportCount}
        </span>
      );
    }

    if (latestReportExportJob?.status === "failed") {
      return <span className="h-2 w-2 rounded-full bg-destructive" />;
    }

    if (latestReportExportJob?.status === "completed") {
      return <span className="h-2 w-2 rounded-full bg-emerald-500" />;
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card/50">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold">Reports</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLoadDialogOpen(true)}
              className="gap-1.5"
            >
              <PiFolderOpenDuotone size={16} />
              Load Saved
            </Button>
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
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="w-full mx-auto space-y-2">
          <Card className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-2 px-2 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TabsList>
                      <TabsTrigger value="builder" className="gap-2">
                        <PiFunnelDuotone size={14} />
                        Query Builder
                      </TabsTrigger>
                      <TabsTrigger
                        value="results"
                        className="gap-1.5"
                        disabled={!hasExecutedResults}
                      >
                        <PiTableDuotone size={14} />
                        Results
                      </TabsTrigger>
                      <TabsTrigger value="exports" className="gap-1.5">
                        <PiExportDuotone size={14} />
                        Exports
                        {renderExportTabIndicator()}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="flex items-center gap-2">
                    {conditions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="gap-1.5 text-muted-foreground hover:text-destructive"
                      >
                        <PiTrashDuotone size={14} />
                        Clear All
                      </Button>
                    )}
                    <Button
                      onClick={() => handleExecuteQuery(1)}
                      disabled={!isQueryValid || reportsQuery.isPending}
                      className="gap-1.5"
                    >
                      {reportsQuery.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <PiMagnifyingGlassDuotone size={16} />
                          Run Query
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <TabsContent value="builder" className="mt-0 space-y-4">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-dashed">
                    <span className="text-sm font-medium text-muted-foreground">
                      Match conditions with:
                    </span>
                    <div className="flex items-center gap-1 bg-background rounded-lg p-1 border">
                      <Button
                        variant={
                          conditionLogic === "AND" ? "secondary" : "ghost"
                        }
                        size="sm"
                        onClick={() => setConditionLogic("AND")}
                        className={cn(
                          "h-7 text-xs",
                          conditionLogic === "AND" &&
                            "bg-primary/10 text-primary",
                        )}
                      >
                        AND
                      </Button>
                      <Button
                        variant={
                          conditionLogic === "OR" ? "secondary" : "ghost"
                        }
                        size="sm"
                        onClick={() => setConditionLogic("OR")}
                        className={cn(
                          "h-7 text-xs",
                          conditionLogic === "OR" &&
                            "bg-primary/10 text-primary",
                        )}
                      >
                        OR
                      </Button>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      (all conditions must match / any condition can match)
                    </span>
                  </div>

                  {/* Conditions List */}
                  <div className="space-y-2">
                    {conditions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border-2 border-dashed border-muted-foreground/20">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                          <PiFunnelDuotone
                            size={24}
                            className="text-muted-foreground"
                          />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          No conditions added yet
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add conditions to filter and search products
                        </p>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={addCondition}
                          className="mt-4 gap-1.5"
                        >
                          <PiPlusCircleDuotone size={16} />
                          Add First Condition
                        </Button>
                      </div>
                    ) : (
                      <>
                        {conditions.map((condition, index) => (
                          <ConditionRow
                            key={condition.id}
                            condition={condition}
                            onUpdate={(updates) =>
                              updateCondition(condition.id, updates)
                            }
                            onRemove={() => removeCondition(condition.id)}
                            isFirst={index === 0}
                            position={index + 1}
                          />
                        ))}

                        <div className="flex items-center justify-center py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addCondition}
                            disabled={conditions.length >= 10}
                            className="gap-1.5"
                          >
                            <PiPlusCircleDuotone size={14} />
                            Add Another Condition
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                  {results ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold">
                            Query Results
                          </h3>
                          <Badge variant="secondary">
                            {results.pagination.total} products found
                          </Badge>
                        </div>
                        {hasResultProducts && (
                          <ExportButtons
                            onExportPDF={() => handleOpenExportDialog("pdf")}
                            onExportExcel={() =>
                              handleOpenExportDialog("excel")
                            }
                            isExportingPDF={exportPDF.isPending}
                            isExportingExcel={exportExcel.isPending}
                          />
                        )}
                      </div>
                      <ResultsTable
                        products={results.products}
                        isLoading={reportsQuery.isPending}
                        pagination={results.pagination}
                        onPageChange={(page) => handleExecuteQuery(page)}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center">
                      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                        <PiTableDuotone
                          size={32}
                          className="text-muted-foreground"
                        />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        No query results yet
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Run a query to view matching products.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="exports" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold">Queued Exports</h3>
                      {activeReportExportCount > 0 ? (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                          {activeReportExportCount} active
                        </Badge>
                      ) : latestReportExportJob?.status === "failed" ? (
                        <Badge variant="destructive">Latest failed</Badge>
                      ) : latestReportExportJob?.status === "completed" ? (
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
                          Latest ready
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No active exports</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Start an export from the Results tab, then download it here
                      when it is ready.
                    </p>
                  </div>
                  <ReportExportsTable />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
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
