export type LegendShape = "rectangle" | "ellipse" | "line" | "arrow";

export type LegendStrokeStyle = "solid" | "dashed" | "dotted";

export type LegendItem = {
  id: string;
  shape: LegendShape;
  text: string;
  strokeStyle?: LegendStrokeStyle;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  fillOpacity?: number;
};

export type LegendFormValues = Omit<LegendItem, "id">;

export const DEFAULT_LEGEND_ITEM: LegendFormValues = {
  shape: "rectangle",
  text: "",
  strokeStyle: "solid",
  strokeColor: "#000000",
  strokeWidth: 2,
  fillColor: "transparent",
  fillOpacity: 0.2,
};
