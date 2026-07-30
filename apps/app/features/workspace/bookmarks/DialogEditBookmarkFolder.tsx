"use client";

import { useId, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
  PropertyEditIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
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
          console.error("Failed to edit bookmark folder:", error);
        },
      },
    );
  };

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      reset({ folder_name: currentFolderName });
    } else {
      reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Icon icon={PropertyEditIcon} />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <AppDialogContent
        title="Edit Folder Name"
        description="Edit the name of this bookmark folder."
        variant="form"
        size="md"
        primaryAction={{
          label: "Save Changes",
          loadingLabel: "Saving...",
          form: `edit-folder-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: Tick01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <form
          id={`edit-folder-form-${id}`}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="gap-4 p-4">
            <Field data-invalid={!!errors.folder_name}>
              <FormFieldLabel
                htmlFor={`${id}-folder-name`}
                label="Folder Name"
                tooltip="Update the name of this bookmark folder."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
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
              </InputGroup>
              {errors.folder_name ? (
                <FieldError>{errors.folder_name.message}</FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
