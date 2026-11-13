export const PRODUCT_TABS = [
  {
    slug: "product-information",
    field: "product_information",
    label: "Product Information",
    completionAction: "update_product_information_completion",
  },
  {
    slug: "compliance-information",
    field: "compliance_information",
    label: "Compliance Information",
    completionAction: "update_compliance_tab_completion",
  },
  {
    slug: "label-components",
    field: "label_components",
    label: "Label Components",
    completionAction: "update_label_component_tab_completion",
  },
  {
    slug: "symbols-graphics",
    field: "symbols_graphics",
    label: "Symbols & Graphics",
    completionAction: "update_symbols_graphics_tab_completion",
  },
  {
    slug: "product-specifications",
    field: "product_data",
    label: "Product Specifications",
    completionAction: "update_product_data_tab_completion",
  },
  {
    slug: "operational-parameters",
    field: "operational_parameters",
    label: "Operational Parameters",
    completionAction: "update_operational_parameters_tab_completion",
  },
  {
    slug: "label-tags",
    field: "label_tags",
    label: "Label Tags",
    completionAction: "update_label_tags_tab_completion",
  },
] as const;

export type ProductTab = (typeof PRODUCT_TABS)[number];

export type ProductTabSlug = ProductTab["slug"];

export type ProductTabField = ProductTab["field"];

export type ProductTabCompletion = Partial<
  Record<ProductTabField, { tab_completed?: boolean } | undefined>
>;

export const getProductTab = (slug?: string) =>
  PRODUCT_TABS.find((tab) => tab.slug === slug);

export const getCompletedProductTabs = (product?: ProductTabCompletion) =>
  PRODUCT_TABS.filter((tab) => product?.[tab.field]?.tab_completed).map(
    (tab) => tab.slug,
  );

const PROGRESS_BARS = [
  { min: 100, bar: "from-emerald-400 via-emerald-500 to-emerald-600" },
  { min: 70, bar: "from-sky-400 via-sky-500 to-sky-600" },
  { min: 40, bar: "from-amber-400 via-amber-500 to-amber-600" },
  { min: 0, bar: "from-slate-400 via-slate-500 to-slate-600" },
] as const;

const SUBMITTED_PROGRESS_BAR = "from-violet-400 via-violet-500 to-violet-600";

export const getProductProgressBar = (
  status: string | undefined,
  percentage: number,
): string =>
  status && status !== "draft"
    ? SUBMITTED_PROGRESS_BAR
    : (PROGRESS_BARS.find((state) => percentage >= state.min) ??
        PROGRESS_BARS[PROGRESS_BARS.length - 1]
      ).bar;
