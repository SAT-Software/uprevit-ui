"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OperationalParametersDataGridRef, {
  OperationalParametersDataGridRefRef,
} from "@/features/workspace/products/product/operational-parameters/OperationalParametersDataGrid";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { Save } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;
  const [isMounted] = useState(true);
  const operationalParametersDataGridRef =
    useRef<OperationalParametersDataGridRefRef>(null);

  const { mutate: updateOpsParam } = useUpdateProductTabData();
  const { data, isLoading, error } = useGetProductTabData(
    productId,
    "operational-parameters"
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  const operationalParametersData = data?.result?.data?.data;

  console.log("Operational parameters data", operationalParametersData);

  const handleSave = async () => {
    try {
      const savedData = operationalParametersDataGridRef.current?.saveData();

      const updateOpsParamData = {
        id: productId,
        action: "add_operational_parameters",
        tab: "operational-parameters",
        data: {
          workbook_data: savedData,
        },
      };

      updateOpsParam(updateOpsParamData, {
        onSuccess: () => {
          toast.success("Operational parameters saved successfully");
          console.log("Saved data:", savedData);
          console.log("Stringified data:", JSON.stringify(savedData, null, 2));
        },
        onError: (error) => {
          throw new Error("Failed to update product information:", error);
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to save the operational parameters data");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex gap-2 justify-end mr-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="standard"
              className="p-0"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 " />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save data</p>
          </TooltipContent>
        </Tooltip>

        {/* <Button variant="ghost" size="standard" className="p-0">
          <Upload className="h-4 w-4 " />
        </Button>
        <Button variant="ghost" size="standard" className="p-0">
          <Download className="h-4 w-4 " />
        </Button> */}
      </div>
      {isMounted ? (
        <OperationalParametersDataGridRef
          ref={operationalParametersDataGridRef}
          operationalParametersData={operationalParametersData}
        />
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-muted-foreground">Loading spreadsheet...</div>
        </div>
      )}
    </div>
  );
}
