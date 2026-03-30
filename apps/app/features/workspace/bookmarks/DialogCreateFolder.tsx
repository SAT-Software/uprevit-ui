"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import {
  PiFolderPlusDuotone,
  PiPlusCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";

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
import { useCreateBookmarkFolder } from "@/hooks/bookmark/useCreateBookmarkFolder";

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

  const { mutate: createBookmarkFolder, isPending } = useCreateBookmarkFolder();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const workspaceId = auth?.user?.profile?.workspaceId;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const bookmarkFolderData = {
      user_id: userId,
      workspace_id: workspaceId,
      folder_name: data.folderName.trim(),
    };

    createBookmarkFolder(bookmarkFolderData, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: () => {
        // Keep form state on error so user can retry or adjust
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PiPlusCircleDuotone />
          Create New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-md">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiFolderPlusDuotone className="w-5 h-5" />
              <p>Create New Folder</p>
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
          Create a new folder to organize your bookmarked products.
        </DialogDescription>

        <form
          id={`create-folder-form-${id}`}
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
              aria-invalid={errors.folderName ? "true" : "false"}
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
            variant="default"
            form={`create-folder-form-${id}`}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <PiPlusCircleDuotone className="w-4 h-4 mr-2" />
            )}
            {isPending ? "Creating..." : "Create Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
