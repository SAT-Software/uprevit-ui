"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FolderPlusIcon } from "lucide-react";

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
import { useCreateBookmarkFolder } from "@/hooks/bookmark/useCreateBookmarkFolder";
import { PiPlusBold } from "react-icons/pi";

interface FormValues {
  folderName: string;
}

export default function DialogCreateFolder() {
  const id = useId();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      folderName: "",
    },
    mode: "onSubmit",
  });

  const createMutation = useCreateBookmarkFolder();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      // Create bookmark folder request data
      const bookmarkFolderData = {
        id: "68a1cf8c2cb63e45ad511688",
        folder_name: data.folderName.trim(),
      };

      await createMutation.mutateAsync(bookmarkFolderData);

      reset();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          Create New Folder <PiPlusBold />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlusIcon size={20} />
            Create New Folder
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Create a new folder to organize your bookmarked products.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div>
            <form
              id="create-folder-form"
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
                  {...register("folderName", {
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
                {errors.folderName && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.folderName.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-folder-form"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
