// "use client";

// import { RevoGrid, type DataType } from "@revolist/react-datagrid";
// import { useMemo, useState, useRef } from "react";
// import { columns } from "./RemoveProductDataColumns";
// import {
//   AutoFillPlugin,
//   FormulaPlugin,
//   HistoryPlugin,
//   EventManagerPlugin,
//   AdvanceFilterPlugin,
//   ColumnStretchPlugin,
// } from "@revolist/rv-pro-trial";

// function ProductDataGrid() {
//   const [source] = useState<DataType[]>(() => {
//     const initialRows: DataType[] = new Array(3000).fill(null).map(() => ({}));
//     return initialRows;
//   });
//   const gridRef = useRef<HTMLRevoGridElement>(null);

//   const plugins = useMemo(
//     () => [
//       AutoFillPlugin,
//       FormulaPlugin,
//       HistoryPlugin,
//       EventManagerPlugin,
//       AdvanceFilterPlugin,
//       ColumnStretchPlugin,
//       // FilterHeaderPlugin,
//     ],
//     []
//   );

//   const additionalData = useMemo(
//     () => ({
//       stretch: "all" as const,

//       filter: {},
//     }),
//     []
//   );

//   return (
//     <div className="h-full w-full">
//       <RevoGrid
//         ref={gridRef}
//         className="rounded-lg border overflow-hidden"
//         columns={columns}
//         source={source}
//         additionalData={additionalData}
//         range
//         rowHeaders={true}
//         plugins={plugins}
//         theme="default"
//         filter={false}
//       />
//     </div>
//   );
// }

// export default ProductDataGrid;
