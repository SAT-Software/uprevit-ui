import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSourceFilesFolder } from "@/hooks/source-files/useUpdateSourceFilesFolder";
import { SourceFilesFolder } from "@/types/source-files";
import { PiPencilCircleDuotone } from "react-icons/pi";

interface FormValues {
  folderName: string;
}

export default function DialogEditSourceFilesFolder({
  currentFolder,
}: {
  currentFolder: SourceFilesFolder;
}) {
  const { mutate: updateSourceFilesFolder, isPending } =
    useUpdateSourceFilesFolder();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const folderName = watch("folderName");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateSourceFilesFolder(
      {
        name: data.folderName,
        id: currentFolder._id,
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
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete folder"
          title="Delete folder"
        >
          <PiPencilCircleDuotone className="h-5 w-5" />
        </Button>
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
              Edit Folder
            </DialogTitle>
            <DialogDescription>
              Update the name for the new folder.
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
                defaultValue={currentFolder?.name}
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
              {isPending ? "Updating..." : "Update Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
