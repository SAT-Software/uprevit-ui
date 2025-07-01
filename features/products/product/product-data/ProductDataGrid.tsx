"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import {
  createUniver,
  defaultTheme,
  LocaleType,
  merge,
} from "@univerjs/presets";
import { IWorkbookData } from "@univerjs/core";
import { UniverSheetsCorePreset } from "@univerjs/presets/preset-sheets-core";
import UniverPresetSheetsCoreEnUS from "@univerjs/presets/preset-sheets-core/locales/en-US";
import { UniverSheetsDataValidationPreset } from "@univerjs/presets/preset-sheets-data-validation";
import UniverPresetSheetsDataValidationEnUS from "@univerjs/presets/preset-sheets-data-validation/locales/en-US";
import { UniverSheetsFilterPreset } from "@univerjs/presets/preset-sheets-filter";
import UniverPresetSheetsFilterEnUS from "@univerjs/presets/preset-sheets-filter/locales/en-US";
import { UniverSheetsFindReplacePreset } from "@univerjs/presets/preset-sheets-find-replace";
import UniverPresetSheetsFindReplaceEnUS from "@univerjs/presets/preset-sheets-find-replace/locales/en-US";
import { UniverSheetsDrawingPreset } from "@univerjs/presets/preset-sheets-drawing";
import UniverPresetSheetsDrawingEnUS from "@univerjs/presets/preset-sheets-drawing/locales/en-US";
import { UniverSheetsThreadCommentPreset } from "@univerjs/presets/preset-sheets-thread-comment";
import UniverPresetSheetsThreadCommentEnUS from "@univerjs/presets/preset-sheets-thread-comment/locales/en-US";
import { UniverSheetsNotePreset } from "@univerjs/presets/preset-sheets-note";
import UniverPresetSheetsNoteEnUS from "@univerjs/presets/preset-sheets-note/locales/en-US";
import { UniverSheetsTablePreset } from "@univerjs/presets/preset-sheets-table";
import UniverPresetSheetsTableEnUS from "@univerjs/presets/preset-sheets-table/locales/en-US";
import { UniverSheetsSortPreset } from "@univerjs/presets/preset-sheets-sort";
import SheetsSortEnUS from "@univerjs/presets/preset-sheets-sort/locales/en-US";

import "@univerjs/presets/lib/styles/preset-sheets-data-validation.css";
import "@univerjs/presets/lib/styles/preset-sheets-filter.css";
import "@univerjs/presets/lib/styles/preset-sheets-find-replace.css";
import "@univerjs/presets/lib/styles/preset-sheets-drawing.css";
import "@univerjs/presets/lib/styles/preset-sheets-thread-comment.css";
import "@univerjs/presets/lib/styles/preset-sheets-core.css";
import "@univerjs/presets/lib/styles/preset-sheets-table.css";
import "@univerjs/presets/lib/styles/preset-sheets-table.css";
import "@univerjs/presets/lib/styles/preset-sheets-sort.css";

import "@univerjs/presets/lib/styles/preset-sheets-core.css";

export interface ProductDataGridRef {
  saveData: () => IWorkbookData | null;
}

const ProductDataGrid = forwardRef<ProductDataGridRef>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerAPIRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  useImperativeHandle(ref, () => ({
    saveData: () => {
      if (!univerAPIRef.current) return null;
      try {
        const workbook = univerAPIRef.current.getActiveWorkbook();
        return workbook.save();
      } catch (error) {
        console.error("Error saving data:", error);
        return null;
      }
    },
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: merge(
          {},
          UniverPresetSheetsCoreEnUS,
          UniverPresetSheetsDataValidationEnUS,
          UniverPresetSheetsFilterEnUS,
          UniverPresetSheetsFindReplaceEnUS,
          UniverPresetSheetsDrawingEnUS,
          UniverPresetSheetsThreadCommentEnUS,
          UniverPresetSheetsNoteEnUS,
          UniverPresetSheetsTableEnUS,
          SheetsSortEnUS
        ),
      },
      theme: defaultTheme,
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
        }),
        UniverSheetsDataValidationPreset({
          showEditOnDropdown: true,
        }),
        UniverSheetsFilterPreset(),
        UniverSheetsFindReplacePreset(),
        UniverSheetsDrawingPreset(),
        UniverSheetsThreadCommentPreset(),
        UniverSheetsNotePreset(),
        UniverSheetsTablePreset(),
        UniverSheetsSortPreset(),
      ],
    });

    univerAPIRef.current = univerAPI;

    // Sample product data
    const productData: IWorkbookData = {
      id: "product-data-workbook",
      name: "Product Data",
      locale: LocaleType.EN_US,
      appVersion: "0.1.0",
      styles: {},
      sheets: {
        sheet1: {
          id: "sheet1",
          name: "Product Components",
          cellData: {
            0: {
              0: { v: "Component ID" },
              1: { v: "Component Name" },
              2: { v: "Manufacturer" },
              3: { v: "Part Number" },
              4: { v: "Quantity" },
              5: { v: "Unit Price" },
              6: { v: "Status" },
            },
            1: {
              0: { v: "COMP001" },
              1: { v: "Resistor 10kΩ" },
              2: { v: "Vishay" },
              3: { v: "CRCW080510K0FKEA" },
              4: { v: 100 },
              5: { v: 0.15 },
              6: { v: "Active" },
            },
            2: {
              0: { v: "COMP002" },
              1: { v: "Capacitor 100nF" },
              2: { v: "Murata" },
              3: { v: "GRM188R71H104KA93D" },
              4: { v: 250 },
              5: { v: 0.08 },
              6: { v: "Active" },
            },
            3: {
              0: { v: "COMP003" },
              1: { v: "IC Microcontroller" },
              2: { v: "STMicroelectronics" },
              3: { v: "STM32F103C8T6" },
              4: { v: 50 },
              5: { v: 5.25 },
              6: { v: "Active" },
            },
            4: {
              0: { v: "COMP004" },
              1: { v: "LED Red 3mm" },
              2: { v: "Kingbright" },
              3: { v: "L-934SRC-D" },
              4: { v: 200 },
              5: { v: 0.12 },
              6: { v: "Discontinued" },
            },
            5: {
              0: { v: "COMP005" },
              1: { v: "Crystal 8MHz" },
              2: { v: "ECS Inc" },
              3: { v: "ECS-80-20-5PX-TR" },
              4: { v: 75 },
              5: { v: 0.45 },
              6: { v: "Active" },
            },
          },
          rowCount: 1000,
          columnCount: 26,
        },
      },
      sheetOrder: ["sheet1"],
    };

    univerAPI.createUniverSheet(productData);

    return () => {
      univerAPI.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full border border-border rounded-xl overflow-hidden"
    />
  );
});

ProductDataGrid.displayName = "ProductDataGrid";

export default ProductDataGrid;
