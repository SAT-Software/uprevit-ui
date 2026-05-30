"use client";

import { useEffect, useRef } from "react";
import {
  createUniver,
  defaultTheme,
  LocaleType,
  merge,
} from "@univerjs/presets";
import { IWorkbookData } from "@univerjs/core";
import { cn } from "@uprevit/ui/lib/utils";
import { redlineBadgeAdded, redlineBadgeRemoved } from "@/utils/redlineStyles";
import { UniverSheetsCorePreset } from "@univerjs/presets/preset-sheets-core";
import UniverPresetSheetsCoreEnUS from "@univerjs/presets/preset-sheets-core/locales/en-US";

interface UniverReadOnlyViewerProps {
  workbookData?: IWorkbookData;
  label?: string;
  variant?: "old" | "new" | "default";
}

export default function UniverReadOnlyViewer({
  workbookData,
  label,
  variant = "default",
}: UniverReadOnlyViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerAPIRef = useRef<
    ReturnType<typeof createUniver>["univerAPI"] | null
  >(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { univerAPI } = createUniver({
      locale: LocaleType.EN_US,
      locales: {
        [LocaleType.EN_US]: merge({}, UniverPresetSheetsCoreEnUS),
      },
      theme: defaultTheme,
      presets: [
        UniverSheetsCorePreset({
          container: containerRef.current,
          toolbar: false,
          header: false,
        }),
      ],
    });

    univerAPIRef.current = univerAPI;

    const data: IWorkbookData = workbookData || {
      id: "empty-workbook",
      name: "Empty",
      locale: LocaleType.EN_US,
      appVersion: "0.1.0",
      styles: {},
      sheets: {
        sheet1: {
          id: "sheet1",
          name: "Sheet 1",
          rowCount: 100,
          columnCount: 26,
        },
      },
      sheetOrder: ["sheet1"],
    };

    univerAPI.createUniverSheet(data);

    return () => {
      univerAPI.dispose();
    };
  }, [workbookData]);

  const getBorderColor = () => {
    switch (variant) {
      case "old":
        return "border-red-300/50 dark:border-red-700/50";
      case "new":
        return "border-blue-300/50 dark:border-blue-700/50";
      default:
        return "border-border";
    }
  };

  const getLabelColor = () => {
    switch (variant) {
      case "old":
        return cn(redlineBadgeRemoved, "border");
      case "new":
        return cn(redlineBadgeAdded, "border");
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {label && (
        <div className="flex items-center gap-2 pb-2">
          <span
            className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-full border shadow-sm ${getLabelColor()}`}
          >
            {label}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        className={`w-full flex-1 border rounded-xl overflow-hidden ${getBorderColor()}`}
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}
