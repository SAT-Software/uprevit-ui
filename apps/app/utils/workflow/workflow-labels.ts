import type {
  WorkflowCompletionMode,
  WorkflowDecision,
  WorkflowRelationship,
  WorkflowStatus,
} from "@/types/workflow";

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: "Draft",
  in_review: "In Review",
  ready_to_complete: "Ready to Complete",
  completed: "Completed",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

export const WORKFLOW_DECISION_LABELS: Record<WorkflowDecision, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  changes_requested: "Changes Requested",
};

export const WORKFLOW_COMPLETION_MODE_OPTIONS: {
  value: WorkflowCompletionMode;
  label: string;
  description: string;
}[] = [
  {
    value: "automatic",
    label: "Automatic",
    description: "Releases the Products as soon as everyone approves.",
  },
  {
    value: "initiator_controlled",
    label: "Initiator-controlled",
    description: "Waits for the Initiator or an admin to complete it.",
  },
];

export const WORKFLOW_RELATIONSHIP_LABELS: Record<WorkflowRelationship, string> =
  {
    product_owner: "Product Owner",
    product_contributor: "Product Contributor",
  };
