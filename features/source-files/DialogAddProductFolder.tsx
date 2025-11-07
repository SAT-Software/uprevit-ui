import { PlusIcon } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAddSourceFilesFolder } from "@/hooks/source-files/useAddSourceFilesFolder";

interface FormValues {
  folderName: string;
}

interface DialogAddProductFolderProps {
  children?: React.ReactNode;
}

export default function DialogAddProductFolder({
  children,
}: DialogAddProductFolderProps) {
  const { mutate: addSourceFilesFolder, isPending } = useAddSourceFilesFolder();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      folderName: "",
    },
    mode: "onSubmit",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const folderName = watch("folderName");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addSourceFilesFolder(
      {
        workspace_id: "68d2be511ad93c69d6e39e51",
        name: data.folderName,
        type: "folder",
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        {children || (
          <Button variant="default" className="flex items-center gap-2">
            <PlusIcon size={16} />
            Add New Folder
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusIcon size={20} />
              Add New Folder
            </DialogTitle>
            <DialogDescription>
              Enter a name for the new folder in your source files.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </Label>
              <Input
                id="folderName"
                placeholder="e.g. 'Marketing Materials'"
                {...register("folderName", {
                  required: "Folder name is required.",
                })}
              />
              {errors.folderName && (
                <p className="text-sm text-destructive">
                  {errors.folderName.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName || isPending}>
              {isPending ? "Adding..." : "Add Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
