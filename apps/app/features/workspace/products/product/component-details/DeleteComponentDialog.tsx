"use client";

import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

type ComponentItem = {
  _id: string;
  component_number: string;
  component_description: string;
  image: string;
  label_type: string[];
  dimensions: string;
  component_type: string;
};

export default function DeleteComponentDialog({
  productId,
  component,
  open,
  onOpenChange,
}: {
  productId: string;
  component: ComponentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: deleteComponent, isPending } = useUpdateProductTabData();

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const deleteComponentData = {
        id: productId,
        action: "delete_label_component",
        tab: "label-components",
        data: {
          id: component._id,
        },
      };

      deleteComponent(deleteComponentData, {
        onSuccess: () => {
          onOpenChange(false);
        },
        onError: () => {
          onOpenChange(false);
        },
      });
    } catch (error) {
      console.error("Failed to delete component:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Delete Component"
        description="Delete this component. This action cannot be undone."
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Are you sure?",
          message: (
            <>
              This will permanently delete the component{" "}
              <span className="font-semibold text-foreground">
                &quot;{component.component_number}&quot;
              </span>{" "}
              data. This action cannot be undone.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Component",
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
