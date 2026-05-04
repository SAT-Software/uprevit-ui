export type FieldType = "text" | "select" | "multiselect" | "boolean" | "array";
export type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "exists"
  | "not_exists"
  | "contains_any"
  | "contains_all";

export interface QueryableField {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
}

export interface TabConfig {
  key: string;
  label: string;
  isArrayData: boolean;
  fields: QueryableField[];
}

export const OPERATORS: { value: Operator; label: string }[] = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Does not equal" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does not contain" },
  { value: "exists", label: "Exists (has value)" },
  { value: "not_exists", label: "Does not exist (empty)" },
  { value: "contains_any", label: "Contains any" },
  { value: "contains_all", label: "Contains all" },
];

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "archived", label: "Archived" },
];

const COMMERCIAL_CLINICAL_OPTIONS = [
  { value: "Commercial", label: "Commercial" },
  { value: "Clinical", label: "Clinical" },
];

const ENTITY_OPTIONS = [
  { value: "Symbols", label: "Symbols" },
  { value: "Schematics", label: "Schematics" },
  { value: "Barcodes", label: "Barcodes" },
  { value: "Other Components", label: "Other Components" },
];

export const QUERYABLE_TABS: TabConfig[] = [
  {
    key: "root",
    label: "Product",
    isArrayData: false,
    fields: [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: STATUS_OPTIONS,
      },
      { key: "product_name", label: "Product Name", type: "text" },
      {
        key: "product_plan_number",
        label: "Product Plan Number",
        type: "text",
      },
      { key: "version", label: "Version", type: "array" },
    ],
  },
  {
    key: "product_information",
    label: "Product Information",
    isArrayData: false,
    fields: [
      { key: "market_geography", label: "Market/Geography", type: "text" },
      { key: "country_of_origin", label: "Country of Origin", type: "text" },
      {
        key: "commercial_clinical",
        label: "Commercial/Clinical",
        type: "select",
        options: COMMERCIAL_CLINICAL_OPTIONS,
      },
      {
        key: "manufacturing_location",
        label: "Manufacturing Location",
        type: "text",
      },
      {
        key: "oem_contract_manufacturer",
        label: "OEM/Contract Manufacturer",
        type: "text",
      },
      {
        key: "class_of_device",
        label: "Class of Device",
        type: "text",
      },
      {
        key: "basic_udi_di",
        label: "Basic UDI-DI",
        type: "text",
      },
    ],
  },
  {
    key: "compliance_information",
    label: "Compliance Information",
    isArrayData: true,
    fields: [
      { key: "standard", label: "Standard", type: "text" },
      {
        key: "standard_description",
        label: "Standard Description",
        type: "text",
      },
    ],
  },
  {
    key: "symbols_graphics",
    label: "Symbols & Graphics",
    isArrayData: true,
    fields: [
      {
        key: "entity",
        label: "Entity Type",
        type: "select",
        options: ENTITY_OPTIONS,
      },
      { key: "text", label: "Symbol/Graphic Text", type: "text" },
    ],
  },
  {
    key: "label_components",
    label: "Label Components",
    isArrayData: true,
    fields: [
      { key: "component_type", label: "Component Type", type: "text" },
      { key: "component_number", label: "Component Number", type: "text" },
      { key: "component_description", label: "Description", type: "text" },
      { key: "label_type", label: "Label Type", type: "array" },
    ],
  },
];

// Helper to get a tab config by key
export function getTabConfig(tabKey: string): TabConfig | undefined {
  return QUERYABLE_TABS.find((tab) => tab.key === tabKey);
}

// Helper to get fields for a specific tab
export function getFieldsForTab(tabKey: string): QueryableField[] {
  return getTabConfig(tabKey)?.fields ?? [];
}

export const ARRAY_FIELD_OPERATORS: Operator[] = ["contains_any", "contains_all"];

export function isArrayFieldOperator(operator: Operator): boolean {
  return ARRAY_FIELD_OPERATORS.includes(operator);
}
