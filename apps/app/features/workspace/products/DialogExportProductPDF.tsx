"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { useExportProductPDF } from "@/hooks/product/useExportProductPDF";
import { toast } from "sonner";
import {
  Cancel01Icon,
  Download04Icon,
  InformationCircleIcon,
  Pdf01Icon,
} from "@hugeicons/core-free-icons";

interface DialogExportProductPDFProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    _id: string;
    product_name?: string;
    product_plan_number?: string;
    version?: number;
    status?: string;
  };
}

export default function DialogExportProductPDF({
  open,
  onOpenChange,
  product,
}: DialogExportProductPDFProps) {
  const { mutate: exportPDF, isPending } = useExportProductPDF();

  async function handleExport(e: React.MouseEvent) {
    e.preventDefault();
    if (!product._id) return;

    exportPDF(
      {
        productId: product._id,
      },
      {
        onSuccess: () => {
          toast.success("PDF export queued. Open Exports to track status.");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to queue PDF export",
          );
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Export Product"
        description="Export product data to a PDF file."
        variant="confirm"
        size="md"
        confirmContent={{
          heading: "Export to PDF",
          message: (
            <>
              Queue an export for{" "}
              <span className="font-medium text-foreground">
                {product.product_name || "this product"}
              </span>{" "}
              as a PDF file. You can download it once processing finishes.
            </>
          ),
          icon: Pdf01Icon,
        }}
        primaryAction={{
          label: "Queue PDF Export",
          loadingLabel: "Queueing...",
          onClick: handleExport,
          loading: isPending,
          disabled: isPending,
          icon: Download04Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <div className="space-y-4 px-4 pb-4">
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon
                icon={InformationCircleIcon}
                size={16}
                className="text-muted-foreground"
              />
              <span className="text-muted-foreground">Export includes:</span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-sm text-muted-foreground">
              <li>Product Information</li>
              <li>Compliance Information</li>
              <li>Label Components</li>
              <li>Symbols & Graphics</li>
              <li>Product Data</li>
              <li>Operational Parameters</li>
              <li>Label Tags</li>
            </ul>
          </div>

          {product.version ? (
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
              <span>Exporting:</span>
              <span className="font-medium text-foreground">
                Version {product.version}
              </span>
              {product.product_plan_number ? (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="font-mono text-xs">
                    {product.product_plan_number}
                  </span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
