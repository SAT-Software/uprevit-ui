"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "react-oidc-context";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  FolderAddIcon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
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

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="[&_svg]:text-muted-foreground/60 hover:[&_svg]:text-foreground"
        >
          <Icon icon={FolderAddIcon} />
          Create Folder
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Create New Folder"
        description="Create a new folder to organize your bookmarked products."
        variant="form"
        size="md"
        primaryAction={{
          label: "Create Folder",
          loadingLabel: "Creating...",
          form: `create-folder-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: FolderAddIcon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <form
          id={`create-folder-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field data-invalid={!!errors.folderName}>
              <FormFieldLabel
                htmlFor={`${id}-folder-name`}
                label="Folder Name"
                tooltip="Enter a name for the new bookmark folder."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
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
              </InputGroup>
              {errors.folderName ? (
                <FieldError>{errors.folderName.message}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
