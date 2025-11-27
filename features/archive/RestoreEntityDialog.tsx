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
import { Button } from "@/components/ui/button";

interface RestoreEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityName: string;
  onConfirm: () => void;
  isPending: boolean;
}

export function RestoreEntityDialog({
  open,
  onOpenChange,
  entityName,
  onConfirm,
  isPending,
}: RestoreEntityDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore {entityName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will restore <strong>{entityName}</strong> and make it active
            again.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onConfirm} disabled={isPending}>
            {isPending ? "Restoring..." : "Restore"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
