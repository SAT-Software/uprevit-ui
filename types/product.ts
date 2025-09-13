export interface Product {
  _id?: string;
  product_plan_number: string;
  product_name: string;
  product_description: string;
  department_id: string;
  project_id: string;
  master_version?: string;
  status?: string;
  target_date?: string | null;
  actual_completion_date?: string | null;
  complete_count?: number;
  product_information?: {
    market_geography?: string;
    country_of_origin?: string;
    oem_contract_manufacturer?: string;
    commercial_clinical?: string;
    custom_fields?: Array<{
      _id?: string;
      field_name: string;
      field_value: string;
    }>;
    tab_completed?: boolean;
  };
  compliance_information?: {
    data?: Array<{
      _id?: string;
      compliance_type: string;
      status: string;
      reference_number?: string;
      notes?: string;
    }>;
    tab_completed?: boolean;
  };
  label_components?: {
    data?: Array<{
      _id?: string;
      component_name: string;
      component_type?: string;
      dimensions?: string;
      material?: string;
      color?: string;
    }>;
    tab_completed?: boolean;
  };
  symbols_graphics?: Array<{
    _id?: string;
    image: string;
    text: string;
    description?: string;
    text_present?: boolean;
    label_presence: string[];
    entity: "Symbols" | "Schematics" | "Barcodes" | "Other Components";
  }>;
}

export interface ProductApiResponse {
  _id?: string;
  action_at?: string;
  action_by?: string;
  product_name?: string;
  project_id?: string;
  department_id?: string;
  master_version?: string;
  status?: string;
}
