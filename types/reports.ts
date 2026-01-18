import { Operator } from "@/data/reports-config";

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
  status: "draft" | "submitted" | "archived";
  target_date?: string | null;
  version?: number;
  market_geography?: string | null;
  product_information?: {
    market_geography?: string;
  };
}

export interface SavedQuery {
  id: string;
  name: string;
  conditions: QueryCondition[];
  conditionLogic?: "AND" | "OR";
  createdAt: string;
}
