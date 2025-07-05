"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import dynamic from "next/dynamic";
import { IWorkbookData } from "@univerjs/core";

export interface ProductDataGridRef {
  saveData: () => IWorkbookData | null;
}

const DynamicUniverComponent = dynamic(
  () => import("./UniverComponent"),
  { ssr: false }
);

const ProductDataGrid = forwardRef<ProductDataGridRef>((_, ref) => {
  const univerRef = useRef<ProductDataGridRef>(null);

  useImperativeHandle(ref, () => ({
    saveData: () => univerRef.current?.saveData() || null,
  }));

  // Forward the ref to the dynamic component
  return <DynamicUniverComponent ref={univerRef as any} />;
});

ProductDataGrid.displayName = "ProductDataGrid";

export default ProductDataGrid;
