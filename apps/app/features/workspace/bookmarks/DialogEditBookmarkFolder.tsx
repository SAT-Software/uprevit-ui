"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import {
  PiPencilDuotone,
  PiCheckCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { useEditBookmarkFolder } from "@/hooks/bookmark/useEditBookmarkFolder";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

interface FormValues {
  folder_name: string;
}

interface DialogEditBookmarkFolderProps {
  folderId: string;
  currentFolderName: string;
  trigger?: React.ReactElement;
}

export default function DialogEditBookmarkFolder({
  folderId,
  currentFolderName,
  trigger,
}: DialogEditBookmarkFolderProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const { mutate: editFolder, isPending } = useEditBookmarkFolder();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      folder_name: currentFolderName,
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    editFolder(
      {
        folderId,
        folder_name: data.folder_name.trim(),
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
        onError: (error) => {
          console.error("Failed to edit bookmark folder:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" size="sm">
            <PiPencilDuotone />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiPencilDuotone size={18} />
              <p>Edit Folder Name</p>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
              >
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit the name of this bookmark folder.
        </DialogDescription>

        <form
          id={`edit-folder-form-${id}`}
          className="p-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor={`${id}-folder-name`}>Folder Name</Label>
            <Input
              id={`${id}-folder-name`}
              placeholder="Enter folder name..."
              type="text"
              aria-invalid={errors.folder_name ? "true" : "false"}
              {...register("folder_name", {
                required: "Folder name is required",
                minLength: {
                  value: 1,
                  message: "Folder name must not be empty",
                },
                maxLength: {
                  value: 50,
                  message: "Folder name must be at most 50 characters",
                },
              })}
            />
            {errors.folder_name && (
              <p role="alert" className="text-xs text-destructive">
                {errors.folder_name.message}
              </p>
            )}
          </div>
        </form>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4 sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            size="sm"
            form={`edit-folder-form-${id}`}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <PiCheckCircleDuotone className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
