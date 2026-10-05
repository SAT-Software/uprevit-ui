import type {
  WorkflowSearchField,
  WorkflowSearchOperator,
} from "@/types/workflow";
import {
  WORKFLOW_COMPLETION_MODE_OPTIONS,
  WORKFLOW_STATUS_LABELS,
} from "@/utils/workflow/workflow-labels";

type WorkflowSearchFieldType = "text" | "select" | "date";

export interface WorkflowSearchFieldConfig {
  key: WorkflowSearchField;
  label: string;
  type: WorkflowSearchFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const WORKFLOW_SEARCH_FIELDS: WorkflowSearchFieldConfig[] = [
  { key: "number", label: "Number", type: "text", placeholder: "e.g. AM-WF-000123" },
  { key: "name", label: "Name", type: "text" },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: Object.entries(WORKFLOW_STATUS_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  },
  { key: "product", label: "Product", type: "text", placeholder: "Name or plan number" },
  { key: "initiator", label: "Initiator", type: "text", placeholder: "Name or email" },
  { key: "approver", label: "Approver", type: "text", placeholder: "Name or email" },
  { key: "function", label: "Function", type: "text", placeholder: "e.g. Quality" },
  {
    key: "completionMode",
    label: "Completion mode",
    type: "select",
    options: WORKFLOW_COMPLETION_MODE_OPTIONS.map(({ value, label }) => ({
      value,
      label,
    })),
  },
  { key: "createdAt", label: "Created", type: "date" },
  { key: "startedAt", label: "Started", type: "date" },
  { key: "readyToCompleteAt", label: "Ready to complete", type: "date" },
  { key: "completedAt", label: "Completed", type: "date" },
  { key: "rejectedAt", label: "Rejected", type: "date" },
  { key: "cancelledAt", label: "Cancelled", type: "date" },
];

export const WORKFLOW_SEARCH_OPERATORS: Record<
  WorkflowSearchFieldType,
  { value: WorkflowSearchOperator; label: string }[]
> = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
  ],
  select: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
  ],
  date: [
    { value: "on", label: "On" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "exists", label: "Has a date" },
    { value: "not_exists", label: "Has no date" },
  ],
};

export const getWorkflowSearchField = (key: string) =>
  WORKFLOW_SEARCH_FIELDS.find((field) => field.key === key);
