"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  Cancel01Icon,
  CloudUploadIcon,
  InformationCircleIcon,
  SaveIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

interface SaveTaggedImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending?: boolean;
}

export default function SaveTaggedImageDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: SaveTaggedImageDialogProps) {
  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (isPending) return;
    try {
      await onConfirm();
    } catch (error) {
      console.error("Failed to save tagged image:", error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return;
        onOpenChange(nextOpen);
      }}
    >
      <AppDialogContent
        title="Save Tagged Image"
        description="Save the annotated image to the cloud. This will update the label tag with the tagged version of the image."
        variant="confirm"
        size="md"
        onEscapeKeyDown={(event) => {
          if (isPending) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (isPending) event.preventDefault();
        }}
        confirmContent={{
          heading: "Upload Tagged Image",
          message:
            "Your annotated image will be saved to the cloud and linked to this label tag.",
          icon: CloudUploadIcon,
        }}
        primaryAction={{
          label: "Yes, Save Image",
          loadingLabel: "Saving...",
          onClick: handleConfirm,
          loading: isPending,
          disabled: isPending,
          icon: SaveIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <div className="space-y-2 px-4 pb-4">
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Icon
                icon={InformationCircleIcon}
                size={16}
                strokeWidth={2}
                className="text-muted-foreground"
              />
              <span className="font-medium text-muted-foreground">
                What happens next
              </span>
            </div>
            <ul className="ml-6 mt-2 list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                The annotated image will be <strong>uploaded</strong> to cloud
                storage
              </li>
              <li>
                It will <strong>replace</strong> any previous tagged image
              </li>
              <li>
                The original label image will remain <strong>unchanged</strong>
              </li>
            </ul>
          </div>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
