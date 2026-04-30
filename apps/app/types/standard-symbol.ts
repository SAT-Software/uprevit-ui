export type StandardSymbol = {
  id: string;
  title: string;
  description?: string;
  standard: string;
  standard_description?: string;
  ref_number: string;
  image_key: string;
  image: string;
  active: boolean;
  sort_order?: number;
};

export type StandardSymbolsResponse = {
  message?: string;
  result: StandardSymbol[];
};
