import type {
  AuditLog,
  ProductActiveWorkflow,
  ProductReleasedVersion,
  ProductStatus,
  ProductTeam,
} from "@/types/product";

export type ProductListItem = ProductTeam & {
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
  parent_id?: string | null;
  product_information?: { tab_completed?: boolean };
  compliance_information?: { tab_completed?: boolean };
  label_components?: { tab_completed?: boolean };
  symbols_graphics?: { tab_completed?: boolean };
  product_data?: { tab_completed?: boolean };
  operational_parameters?: { tab_completed?: boolean };
  label_tags?: { tab_completed?: boolean };
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
};
