"use client";

import SchematicsSymbolsTabs from "@/features/products/product/graphics-other-components/SchematicsSymbolsTabs";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

interface SymbolGraphicItem {
  image: string;
  text: string;
  description: string;
  text_present: boolean;
  label_presence: string[];
  entity: string;
}

export default function Page() {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "symbols-graphics"
  );

  if (!productId) {
    return <div className="flex flex-col gap-4 p-4">Loading product...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        Loading symbols and graphics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 text-destructive">
        Error loading symbols and graphics: {error.message}
      </div>
    );
  }

  const symbolsGraphics = (data?.data as SymbolGraphicItem[]) || [];

  console.log("symbolsGraphics", symbolsGraphics);

  // Group items by normalized entity (lowercase)
  const entityGroups: Record<string, SymbolGraphicItem[]> = {};
  symbolsGraphics.forEach((item) => {
    const key = item.entity.toLowerCase();
    if (!entityGroups[key]) {
      entityGroups[key] = [];
    }
    entityGroups[key].push(item);
  });

  console.log("entityGroups", entityGroups);

  // Map grouped data to expected prop names for SchematicsSymbolsTabs
  const schematicsData = (entityGroups["schematics"] || []).map(
    (item, index) => ({
      id: item.text || item.image || `schematics-${index}`,
      componentName: item.text || "Schematics",
      componentDescription: item.description || "",
      componentImage: item.image || "",
      presentOnLabels: item.label_presence,
    })
  );

  const barcodesData = (entityGroups["barcodes"] || []).map((item, index) => ({
    id: item.text || item.image || `barcodes-${index}`,
    componentName: item.text || "Barcode",
    componentDescription: item.description || "",
    componentImage: item.image || "",
    presentOnLabels: item.label_presence,
  }));

  const otherComponentsData = (entityGroups["other components"] || []).map(
    (item, index) => ({
      id: item.text || item.image || `other-${index}`,
      componentName: item.text || "Other Component",
      componentDescription: item.description || "",
      componentImage: item.image || "",
      presentOnLabels: item.label_presence,
    })
  );

  // Merge "symbol" and "graphics" entities into symbolsData
  const symbolsData = [...(entityGroups["symbols"] || [])].map(
    (item, index) => ({
      id: item.text || item.image || `symbols-${index}`,
      componentName: item.text || "Symbols",
      componentDescription: item.description || "",
      componentImage: item.image || "",
      symbolsTextPresent: item.label_presence,
      textPresent: item.text_present || false,
    })
  );

  return (
    <SchematicsSymbolsTabs
      schematicsData={schematicsData}
      barcodesData={barcodesData}
      otherComponentsData={otherComponentsData}
      symbolsData={symbolsData}
      productId={productId as string}
    />
  );
}
