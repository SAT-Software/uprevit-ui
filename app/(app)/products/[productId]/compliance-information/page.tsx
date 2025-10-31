"use client";

import AddStandardDialog from "@/features/products/product/compliance-information/AddStandardDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { PiCheckCircleDuotone } from "react-icons/pi";
import EditStandardDialog from "@/features/products/product/compliance-information/EditStandardDialog";
import DeleteStandardDialog from "@/features/products/product/compliance-information/DeleteStandardDialog";

interface ComplianceItem {
  _id: string;
  standard: string;
  standard_description: string;
}

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "compliance-information"
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        Loading compliance standards...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 p-4 text-destructive">
        Error loading compliance standards: {error.message}
      </div>
    );
  }

  const standards = (data?.result?.data?.data as ComplianceItem[]) || [];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-end">
        <AddStandardDialog productId={productId} />
      </div>
      {standards.map((item) => (
        <div
          key={item._id}
          className="flex items-center bg-card border rounded-md px-4 py-2 min-h-[64px] w-full"
        >
          <PiCheckCircleDuotone
            className="text-green-500 mr-4 shrink-0"
            size={16}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium text-base truncate">
              {item.standard}
            </span>
            <span className="text-muted-foreground text-xs truncate">
              {item.standard_description}
            </span>
          </div>
          <div className="ml-4 flex gap-2 items-center">
            <EditStandardDialog productId={productId} standards={item} />
            <DeleteStandardDialog
              productId={productId}
              standardId={item._id}
              standardName={item.standard}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
