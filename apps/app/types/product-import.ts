export type ImportIssueLevel = "error" | "warning";

export interface ImportIssue {
  level: ImportIssueLevel;
  message: string;
}

export interface ImportComponent {
  component_number: string;
  component_type: string;
  component_description: string;
  dimensions: string;
  label_type: string[];
  print_direction: string;
}

export interface ImportedProduct {
  row: number;
  product_plan_number: string;
  product_name: string;
  product_description: string;
  department_name: string;
  project_name: string;
  project_number: string;
  target_date: string | null;
  product_information: {
    market_geography: string;
    country_of_origin: string;
    oem_contract_manufacturer: string;
    commercial_clinical: string;
    manufacturing_location: string;
    class_of_device: string;
    basic_udi_di: string;
  };
  custom_fields: Array<{ label: string; value: string }>;
  compliance: Array<{ standard: string; standard_description: string; custom: boolean }>;
  languages: Array<{ code: string; name: string; country: string }>;
  label_components: ImportComponent[];
  issues: ImportIssue[];
}

export interface ImportWorkbook {
  products: ImportedProduct[];
  customFieldColumns: string[];
  notices: string[];
}

export interface ImportCheckResult {
  existing_plan_numbers: string[];
  taken_project_numbers: Array<{ project_number: string; project_name: string }>;
  destinations: Array<{
    department_name: string;
    project_name: string;
    department_exists: boolean;
    ambiguous: boolean;
    project: { _id: string; project_name: string; project_number: string } | null;
  }>;
}

export interface ImportProjectChoice {
  _id: string;
  project_name: string;
  project_number: string;
}

export type ImportRowStatus = "ready" | "needs-project" | "error" | "excluded";

export interface ImportDestination {
  kind: "existing" | "new" | "none";
  label: string;
  departmentLabel: string;
  createsDepartment: boolean;
  projectNumber?: string;
  project?: ImportProjectChoice;
}

export interface ImportCreateResult {
  plan_number: string;
  status: "created" | "failed";
  product_id?: string;
  error?: string;
}
