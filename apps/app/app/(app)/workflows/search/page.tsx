"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Delete02Icon,
  InboxDownloadIcon,
  SaveIcon,
  SearchSquareIcon,
  WorkflowIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { WorkspaceListPagination } from "@/components/table/WorkspaceListPagination";
import { getWorkflowSearchField } from "@/data/workflow-search-config";
import { DashboardErrorState } from "@/features/workspace/dashboard/DashboardErrorState";
import { LoadQueryDialog } from "@/features/workspace/reports/components/LoadQueryDialog";
import { QueryBuilder } from "@/features/workspace/reports/components/QueryBuilder/QueryBuilder";
import { SaveQueryDialog } from "@/features/workspace/reports/components/SaveQueryDialog";
import {
  type QueryBuilderOptions,
  useQueryBuilderState,
} from "@/features/workspace/reports/hooks/useQueryBuilderState";
import {
  NO_VALUE_OPERATORS,
  WorkflowSearchConditionRow,
} from "@/features/workspace/workflows/WorkflowSearchConditionRow";
import { WorkflowsTable } from "@/features/workspace/workflows/WorkflowsTable";
import { useSavedQueries } from "@/hooks/reports/useSavedQueries";
import {
  type WorkflowSearchRequest,
  useWorkflowSearch,
} from "@/hooks/workflow/useWorkflows";
import { WORKSPACE_LIST_LIMIT } from "@/lib/workspace-list-query";
import type { SavedQuery } from "@/types/reports";
import type { WorkflowSearchCondition } from "@/types/workflow";

const SAVED_SEARCHES_STORAGE_KEY = "uprevit_workflow_saved_searches";

const WORKFLOW_SEARCH_OPTIONS: QueryBuilderOptions<WorkflowSearchCondition> = {
  createCondition: () => ({ field: "", operator: "contains", value: "" }),
  isConditionComplete: (condition) =>
    !!condition.field &&
    (NO_VALUE_OPERATORS.includes(condition.operator) ||
      !!condition.value.trim()),
};

const toLocalDayInterval = (date: string) => {
  const start = new Date(`${date}T00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return `${start.toISOString()}/${end.toISOString()}`;
};

const toApiCondition = ({
  field,
  operator,
  value,
  logic,
}: WorkflowSearchCondition): WorkflowSearchRequest["conditions"][number] => {
  const apiValue = NO_VALUE_OPERATORS.includes(operator)
    ? ""
    : getWorkflowSearchField(field)?.type === "date"
      ? toLocalDayInterval(value)
      : value.trim();
  return { field, operator, value: apiValue, ...(logic ? { logic } : {}) };
};

export default function WorkflowSearchPage() {
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
  } = useQueryBuilderState(WORKFLOW_SEARCH_OPTIONS);
  const {
    queries: savedSearches,
    saveQuery,
    deleteQuery,
  } = useSavedQueries<WorkflowSearchCondition>(SAVED_SEARCHES_STORAGE_KEY);
  const [request, setRequest] = useState<WorkflowSearchRequest | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const { data, isPending, isFetching, isError, refetch } =
    useWorkflowSearch(request);
  const workflows = data?.result.workflows ?? [];
  const isSearchValid = validateConditions();

  const handleSearch = () => {
    if (!isSearchValid) {
      toast.error("Fill in every condition before searching.");
      return;
    }
    const next = {
      conditions: getApiConditions().map(toApiCondition),
      page: 1,
      limit: WORKSPACE_LIST_LIMIT,
    };
    if (JSON.stringify(next) === JSON.stringify(request)) void refetch();
    else setRequest(next);
  };

  const handleSave = (name: string) => {
    const result = saveQuery(name, conditions, conditionLogic);
    if (result.success) toast.success(`"${name}" has been saved locally.`);
    else toast.error(result.error || "Failed to save search.");
  };

  const handleLoad = (search: SavedQuery<WorkflowSearchCondition>) => {
    loadConditions(search.conditions, search.conditionLogic);
    setRequest(null);
    toast.success(`Loaded "${search.name}"`);
  };

  const handleClear = () => {
    clearConditions();
    setRequest(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border bg-muted/60 p-2 pl-3">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Advanced Search</p>
          <InfoTooltip content="Find workflows with up to 10 conditions joined with AND or OR. Saved searches stay in this browser." />
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Load a saved search"
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={() => setLoadDialogOpen(true)}
              >
                <Icon icon={InboxDownloadIcon} size={14} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Load a saved search</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label="Save current search"
                type="button"
                variant="outline"
                size="icon-xs"
                onClick={() => setSaveDialogOpen(true)}
                disabled={conditions.length === 0}
              >
                <Icon icon={SaveIcon} size={14} strokeWidth={2} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save current search</TooltipContent>
          </Tooltip>
          {conditions.length > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  aria-label="Clear all conditions"
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
          ) : null}
          <Button
            type="button"
            size="sm"
            onClick={handleSearch}
            disabled={!isSearchValid || (!!request && isFetching)}
            className="gap-1.5"
          >
            {request && isFetching ? (
              <Spinner className="size-3.5" />
            ) : (
              <Icon icon={SearchSquareIcon} size={14} strokeWidth={2} />
            )}
            Search
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
            emptyDescription="Add conditions to find workflows"
            renderCondition={(condition, rowProps) => (
              <WorkflowSearchConditionRow condition={condition} {...rowProps} />
            )}
          />

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-foreground">Results</p>
            {!request ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-14 text-center">
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                  <Icon
                    icon={WorkflowIcon}
                    size={20}
                    strokeWidth={2}
                    className="text-muted-foreground/60"
                  />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No search yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Build your search above and run it to see matching workflows
                </p>
              </div>
            ) : isError ? (
              <DashboardErrorState
                variant="panel"
                icon={WorkflowIcon}
                title="Failed to search workflows"
              />
            ) : !isPending && workflows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center text-sm text-muted-foreground">
                No workflows match this search.
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="overflow-x-auto">
                  <WorkflowsTable workflows={workflows} isPending={isPending} />
                </div>
                <div
                  className="flex h-10 w-full items-center border-t"
                  aria-busy={isFetching}
                >
                  <WorkspaceListPagination
                    pagination={data?.result.pagination}
                    onPageChange={(page) =>
                      setRequest((current) =>
                        current ? { ...current, page } : current,
                      )
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SaveQueryDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSave}
        isConditionsEmpty={conditions.length === 0}
        placeholder="e.g., Quality reviews in progress"
      />
      <LoadQueryDialog
        open={loadDialogOpen}
        onOpenChange={setLoadDialogOpen}
        queries={savedSearches}
        onLoad={handleLoad}
        onDelete={(id) => {
          const result = deleteQuery(id);
          if (result.success) toast.success("The saved search has been deleted.");
          else toast.error(result.error || "Failed to delete saved search.");
        }}
      />
    </div>
  );
}
