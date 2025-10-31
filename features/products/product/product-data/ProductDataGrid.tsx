"use client";

import React, { useRef, useImperativeHandle, forwardRef } from "react";
import dynamic from "next/dynamic";
import { IWorkbookData } from "@univerjs/core";

export interface ProductDataGridRef {
  saveData: () => IWorkbookData | null;
}

interface ProductTabDataGridProps {
  productTabData?: {
    id: string;
    workbook_data: IWorkbookData;
  }; // Type this according to your API response structure
}

const DynamicUniverComponent = dynamic(
  () => import("./UniverComponentProductData"),
  {
    ssr: false,
  }
);

const ProductDataGrid = forwardRef<ProductDataGridRef, ProductTabDataGridProps>(
  ({ productTabData }, ref) => {
    const univerRef = useRef<ProductDataGridRef>(null);

    useImperativeHandle(ref, () => ({
      saveData: () => univerRef.current?.saveData() || null,
    }));

    // Forward the ref to the dynamic component
    return (
      <DynamicUniverComponent
        productTabData={productTabData}
        ref={univerRef as React.RefObject<ProductDataGridRef>}
      />
    );
  }
);

ProductDataGrid.displayName = "ProductDataGrid";

export default ProductDataGrid;
