"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  Clock01Icon,
  Download04Icon,
  Pdf01Icon,
  Xls01Icon,
} from "@hugeicons/core-free-icons";

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
  const isPDF = format === "pdf";
  const formatLabel = isPDF ? "PDF" : "Excel";
  const FormatIcon = isPDF ? Pdf01Icon : Xls01Icon;

  const handleExport = () => {
    onExport(format);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title={`Export as ${formatLabel}`}
        description="This export will run in the background so you can keep working while the file is generated."
        variant="confirm"
        size="md"
        confirmContent={{
          heading: `Export as ${formatLabel}`,
          message: (
            <>
              We will queue a {formatLabel} export for the current filtered
              results. Track progress and download from the Exports panel.
            </>
          ),
          icon: FormatIcon,
        }}
        primaryAction={{
          label: `Start ${formatLabel} Export`,
          loadingLabel: "Starting...",
          onClick: handleExport,
          loading: isExporting,
          disabled: isExporting,
          icon: Download04Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isExporting,
          icon: Cancel01Icon,
        }}
      >
        <div className="px-4 pb-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                <Icon
                  icon={Clock01Icon}
                  size={20}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-1 text-sm">
                <p className="font-medium text-foreground">Background export</p>
                <p className="text-muted-foreground">
                  You can continue working while the export is generated. Check
                  the Exports panel for status updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
