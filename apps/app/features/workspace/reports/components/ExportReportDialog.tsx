"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  PiFilePdfDuotone,
  PiMicrosoftExcelLogoDuotone,
  PiClockCountdownDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

export type ExportFormat = "pdf" | "excel";

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ExportFormat) => Promise<void> | void;
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
  const handleExport = () => {
    onExport(format);
  };

  const isPDF = format === "pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            This export will run in the background so you can keep working while
            the file is generated.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="flex items-start gap-2">
            <PiClockCountdownDuotone className="mt-0.5 size-4 text-muted-foreground" />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">
                This export will be generated in the background.
              </p>
              <p className="text-muted-foreground">
                We will queue a {isPDF ? "PDF" : "Excel"} export for the current
                filtered results; you can keep using the app while progress is
                shown in the Exports tab.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            <PiXCircleDuotone />
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <Spinner />
            ) : isPDF ? (
              <PiFilePdfDuotone size={16} />
            ) : (
              <PiMicrosoftExcelLogoDuotone size={16} />
            )}
            {isExporting
              ? "Starting..."
              : `Start ${isPDF ? "PDF" : "Excel"} Export`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
