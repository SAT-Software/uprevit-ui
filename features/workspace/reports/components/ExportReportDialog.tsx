"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PiFilePdfDuotone,
  PiMicrosoftExcelLogoDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

export type ExportFormat = "pdf" | "excel";

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (header: string, format: ExportFormat) => Promise<void> | void;
  isExporting?: boolean;
  format: ExportFormat;
}

export function ExportReportDialog({
  open,
  onOpenChange,
  onExport,
  isExporting,
  format,
}: ExportReportDialogProps) {
  const [header, setHeader] = useState("");

  const handleExport = () => {
    if (header.trim()) {
      onExport(header.trim(), format);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setHeader("");
    }
    onOpenChange(open);
  };

  const isPDF = format === "pdf";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isPDF ? (
              <PiFilePdfDuotone size={20} className="text-red-500" />
            ) : (
              <PiMicrosoftExcelLogoDuotone
                size={20}
                className="text-green-600"
              />
            )}
            Export as {isPDF ? "PDF" : "Excel"}
          </DialogTitle>
          <DialogDescription>
            Enter a header name for your report. This will also be used as the
            filename.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="report-header">Report Header</Label>
          <Input
            id="report-header"
            placeholder="e.g., Q4 Product Compliance Report"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExport()}
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isExporting}
          >
            <PiXCircleDuotone />
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={!header.trim() || isExporting}
          >
            {isExporting ? (
              <Spinner />
            ) : isPDF ? (
              <PiFilePdfDuotone size={16} />
            ) : (
              <PiMicrosoftExcelLogoDuotone size={16} />
            )}
            {isExporting ? "Exporting..." : `Export ${isPDF ? "PDF" : "Excel"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
