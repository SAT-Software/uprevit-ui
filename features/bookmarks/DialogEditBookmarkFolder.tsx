"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiPencilDuotone } from "react-icons/pi";
import { useEditBookmarkFolder } from "@/hooks/bookmark/useEditBookmarkFolder";

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
          // You can handle errors here, e.g., show a toast notification
          console.error("Failed to edit bookmark folder:", error);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <PiPencilDuotone className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiPencilDuotone size={20} />
            Edit Folder Name
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edit the name of this bookmark folder.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div>
            <form
              id={`edit-folder-form-${id}`}
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="space-y-2">
                <Label htmlFor={`${id}-folder-name`}>Folder Name</Label>
                <Input
                  id={`${id}-folder-name`}
                  placeholder="Enter folder name..."
                  type="text"
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
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form={`edit-folder-form-${id}`}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
