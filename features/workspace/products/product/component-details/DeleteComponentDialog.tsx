import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import {
  PiTrashDuotone,
  PiXCircleDuotone,
  PiWarningDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

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

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <AlertDialogHeader className="contents space-y-0 text-left">
          <AlertDialogTitle className="border-b px-4 py-4 text-sm bg-destructive/10 flex w-full justify-between items-center">
            <div className="flex items-center gap-2 text-destructive">
              <PiTrashDuotone className="w-4 h-4" />
              <span>Delete Component</span>
            </div>
            <button
              type="button"
              className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onOpenChange(false)}
            >
              <PiXCircleDuotone size={18} />
            </button>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <div className="p-4">
          <AlertDialogDescription className="text-sm text-muted-foreground">
            This will permanently delete the component{" "}
            <span className="font-semibold text-foreground">
              &quot;{component.component_number}&quot;
            </span>{" "}
            data. This action cannot be undone.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            <PiXCircleDuotone />
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            variant="destructive"
            size="sm"
          >
            {isPending ? <Spinner /> : <PiTrashDuotone />}
            {isPending ? "Deleting..." : "Delete Component"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
