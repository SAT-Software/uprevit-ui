import type { ChartConfig } from "@/components/evilcharts/ui/echarts-chart";
import type { CompletionTab, PipelineStatus } from "@/types/analytics";

export const PIPELINE_STATUSES: PipelineStatus[] = [
  "draft",
  "submitted",
  "in_review",
  "released",
];

export const STAGE_CHART_CONFIG = {
  draft: { label: "Draft", colors: { light: ["#9ca3af"], dark: ["#6b7280"] } },
  submitted: {
    label: "Submitted",
    colors: { light: ["#3b82f6"], dark: ["#60a5fa"] },
  },
  in_review: {
    label: "In review",
    colors: { light: ["#f59e0b"], dark: ["#fbbf24"] },
  },
  released: {
    label: "Released",
    colors: { light: ["#22c55e"], dark: ["#4ade80"] },
  },
} satisfies ChartConfig;

export const TAB_LABELS: Record<CompletionTab, string> = {
  product_information: "Product information",
  compliance_information: "Compliance",
  label_components: "Label components",
  symbols_graphics: "Symbols & graphics",
  product_data: "Specifications",
  operational_parameters: "Operational parameters",
  label_tags: "Label tags",
};

export const TAB_COLORS: Record<CompletionTab, [string, string]> = {
  product_information: ["#3b82f6", "#60a5fa"],
  compliance_information: ["#14b8a6", "#2dd4bf"],
  label_components: ["#f59e0b", "#fbbf24"],
  symbols_graphics: ["#8b5cf6", "#a78bfa"],
  product_data: ["#ec4899", "#f472b6"],
  operational_parameters: ["#64748b", "#94a3b8"],
  label_tags: ["#ef4444", "#f87171"],
};

export const ANALYTICS_METRIC_TITLES: Record<string, string> = {
  status: "Products by stage",
  in_progress: "Products in progress",
  overdue: "Overdue products",
  due: "Products due",
  created: "Products created",
  released: "Products released",
  approver: "Products waiting on an approver",
  tab: "Drafts with an incomplete tab",
};
