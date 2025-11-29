"use client";

import SchematicsSymbolsTabs from "@/features/workspace/products/product/graphics-other-components/SchematicsSymbolsTabs";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

interface SymbolGraphicItem {
  _id: string;
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

  const symbolsGraphics =
    (data?.result?.data?.data as SymbolGraphicItem[]) || [];

  // Group items by normalized entity (lowercase)
  const entityGroups: Record<string, SymbolGraphicItem[]> = {};
  symbolsGraphics.forEach((item) => {
    const key = item.entity.toLowerCase();
    if (!entityGroups[key]) {
      entityGroups[key] = [];
    }
    entityGroups[key].push(item);
  });

  console.log("Entity groups:", entityGroups);

  // Map grouped data to expected prop names for SchematicsSymbolsTabs
  const schematicsData = (entityGroups["schematics"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    presentOnLabels: item.label_presence,
  }));

  const barcodesData = (entityGroups["barcodes"] || []).map((item) => ({
    id: item._id,
    componentName: item.text,
    componentDescription: item.description,
    componentImage: item.image,
    presentOnLabels: item.label_presence,
  }));

  const otherComponentsData = (entityGroups["other components"] || []).map(
    (item) => ({
      id: item._id,
      componentName: item.text,
      componentDescription: item.description,
      componentImage: item.image,
      presentOnLabels: item.label_presence,
    })
  );

  console.log("Other components data:", otherComponentsData);

  // Merge "symbol" and "graphics" entities into symbolsData
  const symbolsData = [...(entityGroups["symbols"] || [])].map((item) => ({
    id: item._id,
    componentName: item.text,
    componentImage: item.image,
    symbolsTextPresent: item.label_presence,
    textPresent: item.text_present,
  }));

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
