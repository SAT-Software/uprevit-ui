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
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSourceFilesFolder } from "@/hooks/source-files/useUpdateSourceFilesFolder";
import { SourceFilesFolder } from "@/types/source-files";
import {
  PiPencilCircleDuotone,
  PiChecksDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@/components/ui/spinner";

interface FormValues {
  folderName: string;
}

export default function DialogEditSourceFilesFolder({
  currentFolder,
  folderId,
}: {
  currentFolder: SourceFilesFolder;
  folderId: string;
}) {
  const { mutate: updateSourceFilesFolder, isPending } =
    useUpdateSourceFilesFolder(folderId);
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
        <Button variant="secondary" size="sm" aria-label="Edit folder">
          <PiPencilCircleDuotone />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilCircleDuotone className="w-5 h-5 text-muted-foreground" />
              <p>Edit Folder</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Update the name for the folder.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-folder-form"
          className="overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="space-y-4 p-4">
            <div className="space-y-2">
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
                <p className="text-xs text-destructive">
                  {errors.folderName.message}
                </p>
              )}
            </div>
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="mr-2" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            form="edit-folder-form"
            disabled={(!folderName && !currentFolder?.name) || isPending}
          >
            {isPending ? <Spinner /> : <PiChecksDuotone className="mr-2" />}
            {isPending ? "Updating..." : "Update Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
