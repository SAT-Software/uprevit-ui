"use client";

import ProductComponentDetailsTable from "@/features/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/products/product/component-details/AddComponentDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

interface ComponentItem {
  id: string;
  componentName: string;
  componentDescription: string;
  componentNumber: string;
  componentImage: string;
  note?: string;
}

interface LabelComponentItem {
  _id: string;
  component_name: string;
  component_number: string;
  component_image: string;
  specification_details: string;
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

  const components = (data?.data?.data || []).map(
    (item: LabelComponentItem) => ({
      id: item._id,
      componentName: item.component_name || "",
      componentNumber: item.component_number || "",
      componentImage: item.component_image || "",
      componentDescription: item.specification_details || "",
    })
  ) as ComponentItem[];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-end">
        <AddComponentDialog productId={productId as string} />
      </div>
      <ProductComponentDetailsTable data={components} />
    </div>
  );
}
