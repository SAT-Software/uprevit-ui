export interface Product {
  _id?: string;
  workspace_id?: string;
  product_plan_number: string;
  product_name: string;
  product_description: string;
  department_id: string;
  project_id: string;
  status?: "draft" | "submitted" | "archived";
  target_date?: string | null;
  actual_completion_date?: string | null;
  complete_count?: number;

  // Versioning fields
  version?: number;
  is_latest?: boolean;
  parent_id?: string | null;

  auditLogs?: Array<AuditLog>;
  product_information?: {
    market_geography?: string;
    country_of_origin?: string;
    oem_contract_manufacturer?: string;
    commercial_clinical?: string;
    manufacturing_location?: string;
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
      dimensions?: string;
      label_type?: string[];
      component_number: string;
      component_type: string;
      component_description: string;
      image?: string;
      key?: string;
    }>;
    tab_completed?: boolean;
  };
  symbols_graphics?: {
    data?: Array<{
      _id?: string;
      image: string;
      key?: string;
      text: string;
      description?: string;
      text_present?: boolean;
      label_presence: string[];
      entity: "Symbols" | "Schematics" | "Barcodes" | "Other Components";
    }>;
    tab_completed?: boolean;
  };
  product_data?: {
    data?: {
      _id?: string;
      workbook_data: object;
    };
    tab_completed?: boolean;
  };
  operational_parameters?: {
    data?: {
      _id?: string;
      workbook_data: object;
    };
    tab_completed?: boolean;
  };
  label_tags?: {
    data?: Array<{
      _id: string;
      name?: string;
      description?: string;
      type?: string;
      image?: string;
      key?: string;
      tagged_image?: string;
      tagged_image_key?: string;
      legend_items?: Array<{
        id: string;
        shape: string;
        strokeStyle?: string;
        strokeColor?: string;
        strokeWidth?: number;
        fillColor?: string;
        fillOpacity?: number;
        text: string;
      }>;
    }>;
    tab_completed?: boolean;
  };
}

export interface ProductApiResponse {
  _id?: string;
  auditLogs?: Array<AuditLog>;
  product_name?: string;
  project_id?: string;
  department_id?: string;
  status?: "draft" | "submitted" | "archived";
  version?: number;
  is_latest?: boolean;
  parent_id?: string | null;
}

export interface ProductMetadata {
  actual_completion_date: string;
  complete_count: number;
  department_id: string;
  is_latest: boolean;
  parent_id: string | null;
  product_description: string;
  product_name: string;
  product_plan_number: string;
  project_id: string;
  status: "submitted";
  target_date: string;
  version: number;
  workspace_id: string;
  _id: string;
}

export interface AuditLog {
  _id?: string;
  entity: string;
  entityId: string;
  action: string;
  actionBy: string;
  actionAt: Date;
  active: boolean;
}

// =====================================
// NEW: Product Tab Data API Response Types
// =====================================

/** Core product data included in every tab response */
export interface ProductDataContent {
  _id: string;
  workspace_id: string;
  project_id: string;
  department_id?: string;
  product_plan_number: string;
  product_name: string;
  product_description: string;

  // Versioning fields
  is_latest: boolean;
  parent_id: string | null;

  target_date: string | null;
  actual_completion_date: string | null;
  status: "draft" | "submitted" | "archived";
  complete_count?: number;
  version?: string;
}

/** Wrapper for product_data in tab responses */
export interface ProductDataWrapper {
  data: ProductDataContent;
}

/** Custom field structure */
export interface CustomField {
  _id?: string;
  field_name: string;
  field_value: string;
}

/** Base structure for tab data in the all-tabs response */
export interface TabDataBase {
  product_data: ProductDataWrapper;
  tab_completed: boolean;
}

/** Product information data (flat fields, no nested data array) */
export interface ProductInformationData {
  market_geography?: string;
  country_of_origin?: string;
  oem_contract_manufacturer?: string;
  commercial_clinical?: string;
  manufacturing_location?: string;
}

/** Product information tab in all-tabs response */
export interface ProductInformationTab extends TabDataBase {
  data: ProductInformationData;
  custom_fields?: CustomField[];
}

/** Generic tab with array data */
export interface TabWithArrayData<T> extends TabDataBase {
  data: T[];
}

/** Workbook tab data */
export interface WorkbookTabData extends TabDataBase {
  data: {
    _id: string;
    workbook_data: object;
  };
}

/** All tabs response data structure */
export interface AllTabsData {
  product_information: ProductInformationTab;
  compliance_information: TabWithArrayData<{
    _id?: string;
    compliance_type: string;
    status: string;
    reference_number?: string;
    notes?: string;
  }>;
  label_components: TabWithArrayData<{
    _id?: string;
    dimensions?: string;
    label_type?: string[];
    component_number: string;
    component_type: string;
    component_description: string;
    image?: string;
    key?: string;
  }>;
  symbols_graphics: TabWithArrayData<{
    _id?: string;
    image: string;
    key?: string;
    text: string;
    description?: string;
    text_present?: boolean;
    label_presence: string[];
    entity: "Symbols" | "Schematics" | "Barcodes" | "Other Components";
  }>;
  product_data: WorkbookTabData;
  operational_parameters: WorkbookTabData;
  label_tags: TabWithArrayData<{
    _id: string;
    name?: string;
    description?: string;
    type?: string;
    image?: string;
    key?: string;
    tagged_image?: string;
    tagged_image_key?: string;
    legend_items?: Array<{
      id: string;
      shape: string;
      strokeStyle?: string;
      strokeColor?: string;
      strokeWidth?: number;
      fillColor?: string;
      fillOpacity?: number;
      text: string;
    }>;
  }>;
  auditLogs: AuditLog[];
}

/** Response structure for GET /products/productData?tab=all-tabs */
export interface GetAllTabsResponse {
  message: string;
  result: {
    tab: "all-tabs";
    data: AllTabsData;
  };
}

/** Response structure for single tab GET /products/productData?tab=<tab-name> */
export interface GetSingleTabResponse<T = unknown> {
  message: string;
  result: {
    tab: string;
    data: {
      product_data: ProductDataWrapper;
      data: T;
      tab_completed: boolean;
      custom_fields?: CustomField[];
      auditLogs: AuditLog[];
    };
  };
}
