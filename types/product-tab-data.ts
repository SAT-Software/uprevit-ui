export interface LegendItem {
  id: string;
  shape: string;
  text: string;
  strokeStyle?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export interface LabelTagDataItem {
  _id: string;
  legend_items?: LegendItem[];
  [key: string]: unknown;
}

export interface ProductTabDataResponse {
  result?: {
    data?: {
      data?: LabelTagDataItem[];
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface UpdateProductTabDataParams {
  id: string;
  action: string;
  tab: string;
  data: object | object[];
}

export interface UpdateLegendPayload {
  id: string;
  legend_items: LegendItem[];
}

export interface OptimisticContext {
  queryKey: readonly unknown[];
  previousData?: ProductTabDataResponse;
  didOptimisticUpdate: boolean;
}
