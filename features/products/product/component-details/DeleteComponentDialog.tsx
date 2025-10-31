import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
type ComponentItem = {
  _id: string;
  name: string;
  specification_details: string;
  number: string;
  image: string;
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

  async function handleDelete() {
    try {
      const deleteComponentData = {
        id: productId,
        action: "delete_label_component",
        tab: "label-components",
        data: {
          component_id: component._id,
        },
      };

      deleteComponent(deleteComponentData);
    } catch (error) {
      console.error("Failed to delete component:", error);
    } finally {
      onOpenChange(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the component data. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-background hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
