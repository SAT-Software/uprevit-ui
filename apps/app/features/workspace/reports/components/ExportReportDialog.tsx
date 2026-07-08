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
  Clock01Icon,
  Pdf01Icon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
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
      <DialogContent className="p-4 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon
              icon={isPDF ? Pdf01Icon : Xls01Icon}
              size={18}
              strokeWidth={2}
              className={isPDF ? "text-red-500" : "text-emerald-600"}
            />
            Export as {isPDF ? "PDF" : "Excel"}
          </DialogTitle>
          <DialogDescription>
            This export will run in the background so you can keep working while
            the file is generated.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="flex items-start gap-2">
            <Icon
              icon={Clock01Icon}
              size={16}
              strokeWidth={2}
              className="mt-0.5 text-muted-foreground"
            />
            <div className="space-y-1 text-sm">
              <p className="font-medium text-foreground">
                Background export
              </p>
              <p className="text-muted-foreground">
                We will queue a {isPDF ? "PDF" : "Excel"} export for the current
                filtered results. Track progress and download from the Exports
                panel.
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
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Spinner className="size-4" />
            ) : (
              <Icon
                icon={isPDF ? Pdf01Icon : Xls01Icon}
                size={14}
                strokeWidth={2}
              />
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
