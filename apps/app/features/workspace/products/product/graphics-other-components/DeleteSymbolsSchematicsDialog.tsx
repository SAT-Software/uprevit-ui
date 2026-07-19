"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

interface GraphicsItem {
  id: string;
  componentName?: string;
}

export default function DeleteSymbolsSchematicsDialog({
  productId,
  graphics,
  open,
  onOpenChange,
}: {
  productId: string;
  graphics: GraphicsItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: deleteSymbol, isPending } = useUpdateProductTabData();

  function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const deleteData = {
        id: productId,
        action: "delete_symbols_graphics",
        tab: "symbols-graphics",
        data: {
          id: graphics.id,
        },
      };

      deleteSymbol(deleteData, {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: () => {
          onOpenChange(false);
        },
      });
    } catch (error) {
      console.error("Failed to delete graphic:", error);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Delete Graphic"
        description="Delete this graphic. This action cannot be undone."
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Are you sure?",
          message: (
            <>
              This will permanently delete the graphic
              {graphics.componentName ? (
                <>
                  {" "}
                  <span className="font-semibold text-foreground">
                    &quot;{graphics.componentName}&quot;
                  </span>
                </>
              ) : null}
              . This action cannot be undone.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Graphic",
          loadingLabel: "Deleting...",
          onClick: handleConfirm,
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
