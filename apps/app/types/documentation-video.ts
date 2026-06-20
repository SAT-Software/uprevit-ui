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
  | "product.compare-versions-redline-view"
  | "product.compliance-tab"
  | "product.label-components"
  | "product.label-tags"
  | "product.product-information"
  | "product.product-plan-review-overview"
  | "product.product-specifications"
  | "product.products-intro"
  | "product.symbols-graphics"
  | "projects.projects-tab"
  | "reports-analytics.overview"
  | "working-with-files.source-files-archive-bookmarks";
