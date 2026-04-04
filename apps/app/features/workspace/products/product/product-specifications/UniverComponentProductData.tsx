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
import { useTheme } from "next-themes";

export interface ProductDataGridRef {
  saveData: () => IWorkbookData | null;
}

interface UniverComponentProps {
  productTabData?: {
    id: string;
    workbook_data: IWorkbookData;
  }; // Type this according to your API response structure
}

const UniverComponentOpsParams = forwardRef<
  ProductDataGridRef,
  UniverComponentProps
>(({ productTabData }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerAPIRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const { theme } = useTheme();

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
      darkMode: theme === "dark" ? true : false,
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

    // Use passed data or fallback to sample data
    const workbookData: IWorkbookData =
      (productTabData?.workbook_data as IWorkbookData) || {
        id: "product-specifications-workbook",
        name: "Product Specifications",
        locale: LocaleType.EN_US,
        appVersion: "0.1.0",
        styles: {},
        sheets: {
          sheet1: {
            id: "sheet1",
            name: "sheet1",
            rowCount: 1000,
            columnCount: 26,
          },
        },
        sheetOrder: ["sheet1"],
      };

    univerAPI.createUniverSheet(workbookData);

    return () => {
      univerAPI.dispose();
    };
  }, [productTabData]); // Re-create when data changes

  return <div ref={containerRef} className="w-full h-full overflow-hidden" />;
});

UniverComponentOpsParams.displayName = "UniverComponent";

export default UniverComponentOpsParams;
