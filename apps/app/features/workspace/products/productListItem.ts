import type {
  AuditLog,
  ProductActiveWorkflow,
  ProductCapabilities,
  ProductReleasedVersion,
  ProductStatus,
  ProductTeam,
} from "@/types/product";
import type { ProductTabCompletion } from "@/lib/product-tabs";

export type ProductListItem = ProductTeam &
  ProductTabCompletion & {
  _id: string;
  productId?: string;
  product_description: string;
  action: string;
  action_at: string;
  action_by: string;
  department_id: string;
  version: number;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: ProductStatus;
  is_latest?: boolean;
  is_archived?: boolean;
  parent_id?: string | null;
  auditLogs?: Array<AuditLog>;
  createdBy?: string;
  createdOn?: string;
  modifiedBy?: string;
  modifiedOn?: string;
  department: Array<{
    _id: string;
    department_name: string;
  }>;
  project: Array<{
    _id: string;
    project_name: string;
  }>;
  complete_count: number;
  active_workflow?: ProductActiveWorkflow | null;
  released_version?: ProductReleasedVersion | null;
  capabilities?: ProductCapabilities;
};
