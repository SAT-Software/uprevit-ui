import { useState } from "react";
import {
  PiTrashDuotone,
  PiXCircleDuotone,
  PiWarningDuotone,
} from "react-icons/pi";

import {
  AlertDialog,
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          <PiTrashDuotone />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="border-b px-4 py-4 text-sm bg-destructive/10 flex w-full justify-between items-center">
            <div className="flex items-center gap-2 text-destructive">
              <PiWarningDuotone className="w-4 h-4" />
              <span>Delete Standard</span>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              <PiXCircleDuotone size={18} />
            </button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-4">
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This will permanently delete the compliance standard{" "}
            <span className="font-semibold text-foreground">
              &quot;{standardName}&quot;
            </span>
            . This action cannot be undone.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            <PiXCircleDuotone />
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            aria-busy={isPending}
          >
            <PiTrashDuotone />
            {isPending ? "Deleting..." : "Delete Standard"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
