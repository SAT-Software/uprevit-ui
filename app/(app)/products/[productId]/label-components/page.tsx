"use client";

import ProductComponentDetailsTable from "@/features/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/products/product/component-details/AddComponentDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

interface ComponentItem {
  _id: string;
  name: string;
  specification_details: string;
  number: string;
  image: string;
}

interface LabelComponentItem {
  _id: string;
  name: string;
  specification_details: string;
  number: string;
  image: string;
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
      name: item.name || "",
      number: item.number || "",
      image: item.image || "",
      specification_details: item.specification_details || "",
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
