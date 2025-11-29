"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import dynamic from "next/dynamic";
import { IWorkbookData } from "@univerjs/core";

export interface OperationalParametersDataGridRefRef {
  saveData: () => IWorkbookData | null;
}

interface OperationalParametersDataGridProps {
  operationalParametersData?: {
    id: string;
    workbook_data: IWorkbookData;
  }; // Type this according to your API response structure
}

const DynamicUniverComponent = dynamic(
  () => import("./UniverComponentOpsParams"),
  {
    ssr: false,
  }
);

const OperationalParametersDataGridRef = forwardRef<
  OperationalParametersDataGridRefRef,
  OperationalParametersDataGridProps
>(({ operationalParametersData }, ref) => {
  const univerRef = useRef<OperationalParametersDataGridRefRef>(null);

  useImperativeHandle(ref, () => ({
    saveData: () => univerRef.current?.saveData() || null,
  }));

  return (
    <DynamicUniverComponent
      operationalParametersData={operationalParametersData}
      ref={univerRef as React.RefObject<OperationalParametersDataGridRefRef>}
    />
  );
});

OperationalParametersDataGridRef.displayName =
  "OperationalParametersDataGridRef";

export default OperationalParametersDataGridRef;
