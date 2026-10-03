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
}

export interface Workflow {
  _id: string;
  number: number;
  numberLabel: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  completionMode: WorkflowCompletionMode;
  initiator: { userId: string; name: string; email: string };
  products: WorkflowProduct[];
  assignments: WorkflowAssignment[];
  dates: { createdAt: string };
}

export interface WorkflowDetail extends Omit<Workflow, "products"> {
  products: WorkflowProductDetail[];
  canEdit: boolean;
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

export type WorkflowView = "all" | "created-by-me";

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
