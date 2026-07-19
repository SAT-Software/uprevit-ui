"use client";

import { Pdf01Icon, Xls01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

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
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportPDF}
            disabled={disabled || isExportingPDF}
          >
            {isExportingPDF ? (
              <Spinner className="size-3.5" />
            ) : (
              <Icon
                icon={Pdf01Icon}
                size={14}
                strokeWidth={2}
                
              />
            )}
            PDF
          </Button>
        </TooltipTrigger>
        <TooltipContent>Queue PDF export</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportExcel}
            disabled={disabled || isExportingExcel}
          >
            {isExportingExcel ? (
              <Spinner className="size-3.5" />
            ) : (
              <Icon
                icon={Xls01Icon}
                size={14}
                strokeWidth={2}
                
              />
            )}
            Excel
          </Button>
        </TooltipTrigger>
        <TooltipContent>Queue Excel export</TooltipContent>
      </Tooltip>
    </div>
  );
}
