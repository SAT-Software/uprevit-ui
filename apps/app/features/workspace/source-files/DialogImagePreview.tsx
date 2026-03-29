"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { PiDownloadSimpleDuotone, PiXCircleDuotone } from "react-icons/pi";

interface DialogImagePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  fileName: string;
  onDownload?: () => void;
}

export default function DialogImagePreview({
  open,
  onOpenChange,
  imageUrl,
  fileName,
  onDownload,
}: DialogImagePreviewProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[98vw] h-[98vh] max-w-[98vw] max-h-[98vh] p-0 bg-accent border-none",
          "flex flex-col items-center justify-center gap-0"
        )}
      >
        {/* Accessible title (visually hidden) */}
        <VisuallyHidden>
          <DialogTitle>Image Preview: {fileName}</DialogTitle>
        </VisuallyHidden>

        {/* Top Bar with Close and Download */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 border-b border-border">
          <p className="text-foreground text-sm font-medium truncate max-w-[60%]">
            {fileName}
          </p>
          <div className="flex items-center gap-2">
            {onDownload && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onDownload}
                aria-label="Download image"
              >
                <PiDownloadSimpleDuotone className="w-5 h-5" />
                Download
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
              aria-label="Close preview"
            >
              <PiXCircleDuotone className="w-5 h-5" />
              Close
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center bg-background p-8">
          <Image
            src={imageUrl}
            alt={fileName}
            fill
            className="object-contain p-4"
            sizes="95vw"
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
