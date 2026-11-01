export type DocumentationVideoSignedUrlResponse = {
  message: string;
  result: {
    url: string;
    expiresAt: string;
  };
};

export type DocumentationVideoKey =
  | "department.departments-tab"
  | "getting-started.welcome-dashboard"
  | "getting-started.workspace"
  | "product.compare-versions-redline-view"
  | "product.compliance-tab"
  | "product.label-components"
  | "product.label-tags"
  | "product.operational-parameters"
  | "product.product-information"
  | "product.product-plan-review-overview"
  | "product.product-specifications"
  | "product.products-intro"
  | "product.symbols-graphics"
  | "projects.projects-tab"
  | "reports-analytics.reports"
  | "review-outputs.approval-workflows"
  | "review-outputs.archives"
  | "review-outputs.exports"
  | "review-outputs.notifications"
  | "working-with-files.bookmarks"
  | "working-with-files.source-files";
