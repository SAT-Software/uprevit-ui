"use client";

import { useId, useState } from "react";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { useDeleteSourceFilesFolder } from "@/hooks/source-files/useDeleteSourceFilesFolder";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

interface DialogDeleteSourceFilesFolderProps {
  id: string;
  folderName: string;
  folderId?: string;
}

export default function DialogDeleteSourceFilesFolder({
  id,
  folderName,
  folderId,
}: DialogDeleteSourceFilesFolderProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const deleteFolder = useDeleteSourceFilesFolder(folderId);
  const disabled = value !== folderName || deleteFolder.isPending;

  async function handleConfirm() {
    if (disabled) return;
    await deleteFolder.mutateAsync(id);
    setOpen(false);
    setValue("");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setValue("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Icon icon={Delete02Icon} />
          Delete
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Delete Folder"
        description={`Delete the folder ${folderName}. This action cannot be undone.`}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Delete folder",
          message: (
            <>
              You are about to delete the folder <strong>{folderName}</strong>.
              This action cannot be undone. Please type the folder name below to
              confirm.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Folder",
          loadingLabel: "Deleting...",
          onClick: handleConfirm,
          loading: deleteFolder.isPending,
          disabled,
          icon: Delete02Icon,
          variant: "destructive",
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: deleteFolder.isPending,
          icon: Cancel01Icon,
        }}
      >
        <FieldGroup className="gap-4 px-4 pb-4">
          <Field>
            <FormFieldLabel
              htmlFor={inputId}
              label="Folder Name"
              tooltip={`Type "${folderName}" to confirm deletion.`}
            />
            <InputGroup size="md" className="bg-background">
              <InputGroupInput
                id={inputId}
                type="text"
                placeholder={`Type ${folderName} to confirm`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
              />
            </InputGroup>
          </Field>
        </FieldGroup>
      </AppDialogContent>
    </Dialog>
  );
}
