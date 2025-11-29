"use client";

import ProductComponentDetailsTable from "@/features/workspace/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/workspace/products/product/component-details/AddComponentDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

interface ComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
}

interface LabelComponentItem {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
}

export default function Page() {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "label-components"
  );

  if (!productId) {
    return <div className="flex flex-col gap-4 p-4">Loading product...</div>;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">Loading label components...</div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4 text-destructive">
        Error loading label components: {error.message}
      </div>
    );
  }

  console.log("component data", data?.result);

  const components = (data?.result?.data?.data || []).map(
    (item: LabelComponentItem) => ({
      _id: item._id,
      component_number: item.component_number || "",
      image: item.image || "",
      component_description: item.component_description || "",
      label_type: item.label_type || [],
      dimensions: item.dimensions || "",
      component_type: item.component_type || "",
    })
  ) as ComponentItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between items-center w-full">
        <h1 className="text-base font-bold">Label Components</h1>
        <AddComponentDialog productId={productId as string} />
      </div>
      <ProductComponentDetailsTable data={components} />
    </div>
  );
}
