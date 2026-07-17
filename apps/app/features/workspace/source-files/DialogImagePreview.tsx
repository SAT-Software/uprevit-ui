"use client";

import {
  CancelSquareIcon,
  DownloadSquare01Icon,
} from "@hugeicons/core-free-icons";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";

import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { cn } from "@uprevit/ui/lib/utils";

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
          "flex h-[98vh] max-h-[98vh] w-[98vw] max-w-[98vw] flex-col gap-0 border-none bg-muted p-0 sm:max-w-[98vw]",
        )}
      >
        <VisuallyHidden>
          <DialogTitle>Image Preview: {fileName}</DialogTitle>
        </VisuallyHidden>

        <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-border px-3">
          <p className="min-w-0 truncate text-sm font-medium text-foreground">
            {fileName}
          </p>
          <div className="flex items-center gap-2">
            {onDownload ? (
              <Button
                type="button"
                variant="outline"
                onClick={onDownload}
                aria-label="Download image"
              >
                <Icon icon={DownloadSquare01Icon} size={16} strokeWidth={2} />
                Download
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onOpenChange(false)}
              aria-label="Close preview"
            >
              <Icon icon={CancelSquareIcon} size={16} strokeWidth={2} />
            </Button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 bg-background p-8">
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
