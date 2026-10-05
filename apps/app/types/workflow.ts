import type { ProductStatus, ProductTeamMember } from "@/types/product";

export type WorkflowStatus =
  | "draft"
  | "in_review"
  | "ready_to_complete"
  | "completed"
  | "rejected"
  | "cancelled";

export type WorkflowCompletionMode = "automatic" | "initiator_controlled";

export type WorkflowDecision =
  | "pending"
  | "approved"
  | "rejected"
  | "changes_requested";

export type WorkflowUnavailableCause =
  | "removed_from_workspace"
  | "left_product_team";

export type WorkflowRelationship = "product_owner" | "product_contributor";

export interface WorkflowProduct {
  lineageId: string;
  productVersionId: string;
  name: string;
  planNumber: string;
  version: number;
}

export interface WorkflowProductDetail extends WorkflowProduct {
  status: ProductStatus | null;
  completeCount: number | null;
  isLatest: boolean;
  isArchived: boolean;
  createdBy: string | null;
  createdOn: string | null;
  modifiedBy: string | null;
  modifiedOn: string | null;
  team: Array<ProductTeamMember & { relationship: WorkflowRelationship }>;
}

export interface WorkflowAssignment {
  _id: string;
  functionType: "product_team" | "function";
  functionLabel: string;
  lineageId?: string;
  userId: string;
  userSnapshot: { name: string; email: string };
  relationship?: WorkflowRelationship;
  decision: WorkflowDecision;
  decidedAt?: string;
  comment?: string;
  reason?: string;
  needsReplacement?: WorkflowUnavailableCause;
}

export interface WorkflowActor {
  userId: string;
  name: string;
  email: string;
}

export interface ReplacedWorkflowAssignment extends WorkflowAssignment {
  replacedAt: string;
  replacedBy: WorkflowActor;
  replacementReason: string;
  replacementAssignmentId: string;
}

export interface Workflow {
  _id: string;
  number: number;
  numberLabel: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  completionMode: WorkflowCompletionMode;
  initiator: WorkflowActor;
  products: WorkflowProduct[];
  assignments: WorkflowAssignment[];
  replacedAssignments?: ReplacedWorkflowAssignment[];
  dates: {
    createdAt: string;
    startedAt?: string;
    readyToCompleteAt?: string;
    completedAt?: string;
    rejectedAt?: string;
    cancelledAt?: string;
  };
  endReason?: string;
  endedBy?: WorkflowActor;
}

export interface WorkflowAssignmentDetail extends WorkflowAssignment {
  openChangeRequestCount?: number;
  contentChangedSinceDecision?: boolean;
}

export interface WorkflowDetail extends Omit<Workflow, "products" | "assignments"> {
  products: WorkflowProductDetail[];
  assignments: WorkflowAssignmentDetail[];
  canEdit: boolean;
  canCancel: boolean;
  canComplete: boolean;
  canReplace: boolean;
  canSendReminder: boolean;
}

export type WorkflowEventType =
  | "started"
  | "approved"
  | "approval_reconfirmed"
  | "content_changed"
  | "changes_requested"
  | "change_request_addressed"
  | "approver_replaced"
  | "approver_unavailable"
  | "reminder_sent"
  | "ready_to_complete"
  | "completed"
  | "rejected"
  | "cancelled";

type WorkflowUserSnapshot = { name: string; email: string };

export interface WorkflowEvent {
  _id: string;
  workflowId: string;
  type: WorkflowEventType;
  actorSnapshot: WorkflowActor;
  assignmentId?: string;
  lineageId?: string;
  reason?: string;
  comment?: string;
  data: {
    functionLabel?: string;
    productCount?: number;
    assignmentCount?: number;
    automatic?: boolean;
    reopened?: boolean;
    requestedBy?: string;
    productVersionId?: string;
    productName?: string;
    notified?: string[];
    from?: WorkflowUserSnapshot;
    to?: WorkflowUserSnapshot;
    approver?: WorkflowUserSnapshot;
    cause?: WorkflowUnavailableCause;
  };
  createdAt: string;
}

export interface WorkflowReadinessCheck {
  key: string;
  label: string;
  passed: boolean;
  message: string;
}

export interface GetWorkflowsResponse {
  result: {
    workflows: Workflow[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export type WorkflowView = "all" | "created-by-me" | "my-tasks";

export type UpdateWorkflowInput =
  | {
      action: "update-details";
      name?: string;
      description?: string;
      completionMode?: WorkflowCompletionMode;
    }
  | { action: "add-product"; productId: string }
  | { action: "remove-product"; lineageId: string }
  | {
      action: "add-assignment";
      functionType: "product_team";
      lineageId: string;
      userId: string;
    }
  | {
      action: "add-assignment";
      functionType: "function";
      functionLabel: string;
      userId: string;
    }
  | { action: "remove-assignment"; assignmentId: string };

export type WorkflowDiscussionScope =
  | { type: "package" }
  | { type: "product"; lineageId: string };

export type WorkflowDiscussionKind = "comment" | "change_request";

export interface WorkflowDiscussionItem {
  _id: string;
  workflowId: string;
  kind: WorkflowDiscussionKind;
  scope: WorkflowDiscussionScope;
  authorSnapshot: WorkflowActor;
  body: string;
  createdAt: string;
  assignmentId?: string;
  status?: "open" | "addressed";
  addressedBySnapshot?: WorkflowActor;
  addressNote?: string;
  addressedAt?: string;
  canAddress: boolean;
}

export type WorkflowDecisionInput =
  | { decision: "approve"; comment?: string }
  | { decision: "reject"; reason: string }
  | {
      decision: "request_changes";
      reason: string;
      scope: WorkflowDiscussionScope;
    };
