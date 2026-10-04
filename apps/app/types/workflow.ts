import type { ProductStatus, ProductTeamMember } from "@/types/product";

export type WorkflowStatus =
  | "draft"
  | "in_review"
  | "ready_to_complete"
  | "completed"
  | "rejected"
  | "cancelled";

export type WorkflowCompletionMode = "automatic" | "initiator_controlled";

export type WorkflowDecision = "pending" | "approved" | "rejected";

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
}

export interface WorkflowActor {
  userId: string;
  name: string;
  email: string;
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

export interface WorkflowDetail extends Omit<Workflow, "products"> {
  products: WorkflowProductDetail[];
  canEdit: boolean;
  canCancel: boolean;
  canComplete: boolean;
}

export type WorkflowEventType =
  | "started"
  | "approved"
  | "ready_to_complete"
  | "completed"
  | "rejected"
  | "cancelled";

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

export type WorkflowDecisionInput =
  | { decision: "approve"; comment?: string }
  | { decision: "reject"; reason: string };
