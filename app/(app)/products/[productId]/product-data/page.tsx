"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ProductDataGrid, {
  ProductDataGridRef,
} from "@/features/products/product/product-data/ProductDataGrid";
import { Save } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function Page() {
  const productDataGridRef = useRef<ProductDataGridRef>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSave = () => {
    const savedData = productDataGridRef.current?.saveData();
    if (savedData) {
      console.log("Saved data:", savedData);
      console.log("Stringified data:", JSON.stringify(savedData, null, 2));
    } else {
      console.error("Failed to save data");
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
        <ProductDataGrid ref={productDataGridRef} />
      ) : (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-muted-foreground">Loading spreadsheet...</div>
        </div>
      )}
    </div>
  );
}
