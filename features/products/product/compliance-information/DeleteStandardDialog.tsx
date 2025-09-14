import { useState } from "react";
import { PiTrashDuotone } from "react-icons/pi";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";

interface DeleteStandardDialogProps {
  productId: string;
  standardId: string;
  standardName: string;
  onDeleted?: () => void;
}

export default function DeleteStandardDialog({
  productId,
  standardId,
  standardName,
  onDeleted,
}: DeleteStandardDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteStandard, isPending } = useUpdateProductTabData();

  async function handleDelete() {
    try {
      const deleteStandardData = {
        id: productId,
        action: "delete_compliance_standard",
        tab: "compliance-information",
        data: {
          standard_id: standardId,
        },
      };

      await deleteStandard(deleteStandardData);
      onDeleted?.();
    } catch (error) {
      console.error("Failed to delete standard:", error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <PiTrashDuotone />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the compliance standard &quot;
            {standardName}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-background hover:bg=destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
