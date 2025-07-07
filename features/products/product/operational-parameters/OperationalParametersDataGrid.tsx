"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import dynamic from "next/dynamic";
import { IWorkbookData } from "@univerjs/core";

export interface OperationalParametersDataGridRefRef {
  saveData: () => IWorkbookData | null;
}

const DynamicUniverComponent = dynamic(() => import("../UniverComponent"), {
  ssr: false,
});

const OperationalParametersDataGridRef =
  forwardRef<OperationalParametersDataGridRefRef>((_, ref) => {
    const univerRef = useRef<OperationalParametersDataGridRefRef>(null);

    useImperativeHandle(ref, () => ({
      saveData: () => univerRef.current?.saveData() || null,
    }));

    return (
      <DynamicUniverComponent
        ref={univerRef as React.RefObject<OperationalParametersDataGridRefRef>}
      />
    );
  });

OperationalParametersDataGridRef.displayName =
  "OperationalParametersDataGridRef";

export default OperationalParametersDataGridRef;
