import { Operator } from "@/data/reports-config";
import type { ProductStatus } from "@/types/product";

export interface QueryCondition {
  id: string;
  tab: string;
  field: string;
  operator: Operator;
  value?: string | string[];
  logic?: "AND" | "OR";
}

export interface ReportsQueryRequest {
  workspaceId: string;
  conditions: QueryCondition[];
  conditionLogic?: "AND" | "OR";
  pagination: {
    page: number;
    limit: number;
  };
  sort?: {
    field: string;
    order: "asc" | "desc";
  };
}

export interface ReportsProduct {
  _id: string;
  product_name: string;
  product_plan_number: string;
  department_id: string;
  department_name: string | null;
  project_id: string;
  project_name: string | null;
  status: ProductStatus;
  is_archived?: boolean;
  product_description?: string | null;
  target_date?: string | null;
  actual_completion_date?: string | null;
  released_at?: string | null;
  version?: number;
  owner_name?: string | null;
  market_geography?: string | null;
  country_of_origin?: string | null;
  commercial_clinical?: string | null;
  manufacturing_location?: string | null;
  oem_contract_manufacturer?: string | null;
  class_of_device?: string | null;
  basic_udi_di?: string | null;
  languages?: string[];
}

export interface SavedQuery<T = QueryCondition> {
  id: string;
  name: string;
  conditions: T[];
  conditionLogic?: "AND" | "OR";
  createdAt: string;
  updatedAt?: string;
  shared?: boolean;
  isOwner?: boolean;
}
