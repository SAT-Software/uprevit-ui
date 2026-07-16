"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

interface DeleteStandardDialogProps {
  productId: string;
  standardId: string;
  standardName: string;
  onDeleted?: () => void;
  isSubmitted?: boolean;
}

export default function DeleteStandardDialog({
  productId,
  standardId,
  standardName,
  isSubmitted = false,
}: DeleteStandardDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteStandard, isPending } = useUpdateProductTabData();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const deleteStandardData = {
        id: productId,
        action: "delete_compliance_standard",
        tab: "compliance-information",
        data: {
          id: standardId,
        },
      };

      deleteStandard(deleteStandardData, {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update product information:", error);
          setOpen(false);
        },
      });
    } catch (error) {
      console.error("Failed to delete standard:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              size="icon-xs"
              variant="destructive"
              disabled={isSubmitted}
              aria-label="Delete standard"
            >
              <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Delete standard"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Delete Standard"
        description="Delete this compliance standard. This action cannot be undone."
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Are you sure?",
          message: (
            <>
              This will permanently delete the compliance standard{" "}
              <span className="font-semibold text-foreground">
                &quot;{standardName}&quot;
              </span>
              . This action cannot be undone.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Standard",
          loadingLabel: "Deleting...",
          onClick: handleDelete,
          loading: isPending,
          disabled: isPending,
          icon: Delete02Icon,
          variant: "destructive",
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      />
    </Dialog>
  );
}
