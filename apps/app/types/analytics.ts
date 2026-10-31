import type { ProductStatus } from "@/types/product";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  departmentId?: string;
  projectId?: string;
};

export type PipelineStatus = "draft" | "submitted" | "in_review" | "released";

export type CompletionTab =
  | "product_information"
  | "compliance_information"
  | "label_components"
  | "symbols_graphics"
  | "product_data"
  | "operational_parameters"
  | "label_tags";

export type AnalyticsData = {
  range: { from: string; to: string };
  tiles: {
    in_progress: number;
    released: number;
    on_time_rate: number | null;
    median_days_to_release: number | null;
    pending_approvals: number;
    overdue: number;
  };
  pipeline: Record<PipelineStatus, number>;
  due_calendar: {
    from: string;
    to: string;
    today: string;
    days: { date: string; count: number }[];
  };
  created_vs_released: { month: string; created: number; released: number }[];
  pending_by_approver: { user_id: string; name: string; count: number }[];
  incomplete_tabs: { tab: CompletionTab; count: number }[];
  draft_count: number;
  departments: ({
    department_id: string;
    name: string;
    total: number;
  } & Record<PipelineStatus, number>)[];
};

export type AnalyticsProduct = {
  _id: string;
  product_name: string;
  product_plan_number?: string;
  status: ProductStatus;
  version: number;
  is_latest: boolean;
  target_date?: string | null;
  released_at?: string | null;
  complete_count?: number;
  department_id?: string;
  project_id?: string;
  department_name?: string;
  project_name?: string;
};
