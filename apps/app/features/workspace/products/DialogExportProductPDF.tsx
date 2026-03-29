"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  PiDownloadDuotone,
  PiFilePdfDuotone,
  PiInfoDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";
import { useExportProductPDF } from "@/hooks/product/useExportProductPDF";
import { toast } from "sonner";

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
          toast.success("PDF export queued. Check Product Exports for status.");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to queue PDF export");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Export Product</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Export product data to a PDF file.
        </DialogDescription>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-500"
              aria-hidden="true"
            >
              <PiFilePdfDuotone size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-sm">Export to PDF</h4>
              <p className="text-sm text-muted-foreground">
                Queue an export for{" "}
                <span className="font-medium text-foreground">
                  {product.product_name || "this product"}
                </span>{" "}
                as a PDF file. You can download it once processing finishes.
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <PiInfoDuotone className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">Export includes:</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">
              <li>Product Information</li>
              <li>Compliance Information</li>
              <li>Label Components</li>
              <li>Symbols & Graphics</li>
              <li>Product Data</li>
              <li>Operational Parameters</li>
              <li>Label Tags</li>
            </ul>
          </div>

          {product.version && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
              <span>Exporting:</span>
              <span className="font-medium text-foreground">
                Version {product.version}
              </span>
              {product.product_plan_number && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="font-mono text-xs">
                    {product.product_plan_number}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isPending}
            >
              <PiXCircleDuotone />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleExport}
            disabled={isPending}
          >
            {isPending ? <Spinner /> : <PiDownloadDuotone />}
            {isPending ? "Queueing..." : "Queue PDF Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
