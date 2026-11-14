import { COMPLIANCE_LANGUAGES } from "@/data/compliance-languages";
import { PRODUCT_TABS } from "@/lib/product-tabs";
import { PRODUCT_STATUS_LABELS } from "@/utils/product/product-lifecycle";

export type FieldType =
  | "text"
  | "select"
  | "boolean"
  | "number"
  | "count"
  | "date"
  | "list"
  | "person"
  | "tab";

export type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "exists"
  | "not_exists"
  | "contains_any"
  | "contains_all"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "on"
  | "before"
  | "after";

export interface QueryableField {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface TabConfig {
  key: string;
  label: string;
  fields: QueryableField[];
}

const toOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value }));

const STATUS_OPTIONS = Object.entries(PRODUCT_STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
);

const YES_NO_OPTIONS = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

const TAB_OPTIONS = PRODUCT_TABS.map(({ field, label }) => ({
  value: field,
  label,
}));

const LANGUAGE_NAME_OPTIONS = toOptions(
  COMPLIANCE_LANGUAGES.map(({ name }) => name),
);
const LANGUAGE_CODE_OPTIONS = toOptions(
  COMPLIANCE_LANGUAGES.map(({ code }) => code),
);

const itemCount = (label: string): QueryableField => ({
  key: "item_count",
  label: `Number of ${label}`,
  type: "count",
});

const graphicFields = (
  nameLabel: string,
  descriptionLabel: string,
  countLabel: string,
  extra: QueryableField[] = [],
): QueryableField[] => [
  { key: "text", label: nameLabel, type: "text" },
  { key: "description", label: descriptionLabel, type: "text" },
  { key: "label_presence", label: "Presence on Labels", type: "list" },
  ...extra,
  itemCount(countLabel),
];

export const QUERYABLE_TABS: TabConfig[] = [
  {
    key: "root",
    label: "Product",
    fields: [
      { key: "product_name", label: "Product Name", type: "text" },
      { key: "product_description", label: "Product Description", type: "text" },
      { key: "product_plan_number", label: "Product Plan Number", type: "text" },
      { key: "department_name", label: "Department Name", type: "text" },
      { key: "department_description", label: "Department Description", type: "text" },
      { key: "project_name", label: "Project Name", type: "text" },
      { key: "project_description", label: "Project Description", type: "text" },
      { key: "project_number", label: "Project Number", type: "text" },
      { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
      { key: "version", label: "Version", type: "number" },
      { key: "is_latest", label: "Latest Version", type: "boolean" },
      { key: "is_archived", label: "Archived", type: "boolean" },
    ],
  },
  {
    key: "dates",
    label: "Dates",
    fields: [
      { key: "created_at", label: "Created", type: "date" },
      { key: "target_date", label: "Target Date", type: "date" },
      { key: "actual_completion_date", label: "Completion Date", type: "date" },
      { key: "released_at", label: "Released", type: "date" },
      { key: "obsoleted_at", label: "Obsoleted", type: "date" },
      { key: "archived_at", label: "Archived", type: "date" },
    ],
  },
  {
    key: "team",
    label: "Team & Workflow",
    fields: [
      { key: "owner", label: "Owner", type: "person", placeholder: "Name or email" },
      { key: "contributors", label: "Contributor", type: "person", placeholder: "Name or email" },
      { key: "in_active_workflow", label: "In an Active Workflow", type: "boolean" },
      { key: "released_by_workflow", label: "Released Through a Workflow", type: "boolean" },
      { key: "legacy_release", label: "Legacy Release", type: "boolean" },
    ],
  },
  {
    key: "progress",
    label: "Progress",
    fields: [
      { key: "completed_tab", label: "Tab", type: "tab", options: TAB_OPTIONS },
      { key: "complete_count", label: "Completed Tabs", type: "number" },
    ],
  },
  {
    key: "product_information",
    label: "Product Information",
    fields: [
      { key: "market_geography", label: "Market/Geography", type: "text" },
      { key: "country_of_origin", label: "Country of Origin", type: "text" },
      {
        key: "commercial_clinical",
        label: "Commercial/Clinical",
        type: "select",
        options: toOptions(["Commercial", "Clinical"]),
      },
      { key: "manufacturing_location", label: "Manufacturing Location", type: "text" },
      { key: "oem_contract_manufacturer", label: "OEM/Contract Manufacturer", type: "text" },
      { key: "class_of_device", label: "Class of Device", type: "text" },
      { key: "basic_udi_di", label: "Basic UDI-DI", type: "text" },
    ],
  },
  {
    key: "custom_fields",
    label: "Custom Fields",
    fields: [
      { key: "label", label: "Field Label", type: "text" },
      { key: "value", label: "Field Value", type: "text" },
      itemCount("Custom Fields"),
    ],
  },
  {
    key: "compliance_information",
    label: "Compliance Information",
    fields: [
      { key: "standard", label: "Standard", type: "text" },
      { key: "standard_description", label: "Standard Description", type: "text" },
      itemCount("Standards"),
    ],
  },
  {
    key: "languages_information",
    label: "Languages",
    fields: [
      { key: "name", label: "Language", type: "select", options: LANGUAGE_NAME_OPTIONS },
      { key: "code", label: "Language Code", type: "select", options: LANGUAGE_CODE_OPTIONS },
      { key: "country", label: "Country", type: "text" },
      itemCount("Languages"),
    ],
  },
  {
    key: "symbols",
    label: "Symbols",
    fields: graphicFields("Symbol Text", "Description", "Symbols", [
      { key: "text_present", label: "Symbol Text Present", type: "boolean" },
      { key: "standard_ref_number", label: "Standard Reference Number", type: "text" },
      { key: "is_standard", label: "From Standard Library", type: "boolean" },
    ]),
  },
  {
    key: "schematics",
    label: "Schematics",
    fields: graphicFields("Schematic Name", "Description", "Schematics"),
  },
  {
    key: "barcodes",
    label: "Barcodes",
    fields: graphicFields("Barcode Type", "Barcode Data", "Barcodes", [
      { key: "count", label: "Count", type: "number" },
    ]),
  },
  {
    key: "other_components",
    label: "Other Components",
    fields: graphicFields("Component Name", "Description", "Other Components"),
  },
  {
    key: "label_components",
    label: "Label Components",
    fields: [
      { key: "component_type", label: "Component Type", type: "text" },
      { key: "component_number", label: "Component Number", type: "text" },
      { key: "component_description", label: "Description", type: "text" },
      { key: "label_type", label: "Label Type", type: "list" },
      { key: "dimensions", label: "Dimensions", type: "text" },
      { key: "print_direction", label: "Print Direction", type: "text" },
      itemCount("Label Components"),
    ],
  },
  {
    key: "label_tags",
    label: "Label Tags",
    fields: [
      { key: "name", label: "Label Name", type: "text" },
      { key: "description", label: "Description", type: "text" },
      { key: "type", label: "Label Type", type: "text" },
      { key: "legend_text", label: "Legend Text", type: "list" },
      itemCount("Label Tags"),
    ],
  },
];

const TEXT_OPERATORS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "exists", label: "Has a value" },
  { value: "not_exists", label: "Is empty" },
] as const;

const COMPARE_OPERATORS = [
  { value: "equals", label: "=" },
  { value: "not_equals", label: "≠" },
  { value: "gt", label: ">" },
  { value: "gte", label: "≥" },
  { value: "lt", label: "<" },
  { value: "lte", label: "≤" },
] as const;

export const FIELD_OPERATORS: Record<
  FieldType,
  readonly { value: Operator; label: string }[]
> = {
  text: TEXT_OPERATORS,
  person: TEXT_OPERATORS,
  select: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
  ],
  boolean: [{ value: "equals", label: "Is" }],
  tab: [
    { value: "equals", label: "Is complete" },
    { value: "not_equals", label: "Is not complete" },
  ],
  number: [
    ...COMPARE_OPERATORS,
    { value: "exists", label: "Has a value" },
    { value: "not_exists", label: "Is empty" },
  ],
  count: COMPARE_OPERATORS,
  date: [
    { value: "on", label: "On" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "exists", label: "Has a date" },
    { value: "not_exists", label: "Has no date" },
  ],
  list: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "contains_any", label: "Includes any of" },
    { value: "contains_all", label: "Includes all of" },
    { value: "exists", label: "Has a value" },
    { value: "not_exists", label: "Is empty" },
  ],
};

export const NO_VALUE_OPERATORS: Operator[] = ["exists", "not_exists"];

export const ARRAY_FIELD_OPERATORS: Operator[] = ["contains_any", "contains_all"];

export function getTabConfig(tabKey: string): TabConfig | undefined {
  return QUERYABLE_TABS.find((tab) => tab.key === tabKey);
}

export function getFieldsForTab(tabKey: string): QueryableField[] {
  return getTabConfig(tabKey)?.fields ?? [];
}

export function getQueryableField(tabKey: string, fieldKey: string) {
  return getFieldsForTab(tabKey).find((field) => field.key === fieldKey);
}

export function getFieldOptions(field?: QueryableField) {
  return field?.type === "boolean" ? YES_NO_OPTIONS : field?.options;
}
