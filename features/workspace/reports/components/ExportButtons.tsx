"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiFilePdfDuotone, PiMicrosoftExcelLogoDuotone } from "react-icons/pi";

interface ExportButtonsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  isExportingPDF?: boolean;
  isExportingExcel?: boolean;
  disabled?: boolean;
}

export function ExportButtons({
  onExportPDF,
  onExportExcel,
  isExportingPDF,
  isExportingExcel,
  disabled,
}: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportPDF}
            disabled={disabled || isExportingPDF}
            className="gap-1.5"
          >
            <PiFilePdfDuotone size={16} className="text-red-500" />
            {isExportingPDF ? "Exporting..." : "PDF"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export results in PDF</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportExcel}
            disabled={disabled || isExportingExcel}
            className="gap-1.5"
          >
            <PiMicrosoftExcelLogoDuotone size={16} className="text-green-600" />
            {isExportingExcel ? "Exporting..." : "Excel"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export results in Excel</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
