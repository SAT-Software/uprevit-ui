"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Alert01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { useDeleteBookmarkFolder } from "@/hooks/bookmark/useDeleteBookmarkFolder";

interface DialogDeleteBookmarkFolderProps {
  folderId: string;
  folderName: string;
  trigger?: React.ReactElement;
}

export default function DialogDeleteBookmarkFolder({
  folderId,
  folderName,
  trigger,
}: DialogDeleteBookmarkFolderProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { mutate: deleteFolder, isPending } = useDeleteBookmarkFolder();

  const disabled = value !== folderName || isPending;

  function handleConfirm() {
    if (disabled) return;

    deleteFolder(folderId, {
      onSuccess: () => {
        router.push("/bookmarked-products");
      },
    });
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
        {trigger || (
          <Button variant="destructive" size="sm">
            <Icon icon={Delete02Icon} />
            Delete
          </Button>
        )}
      </DialogTrigger>
      <AppDialogContent
        title="Delete Bookmark Folder"
        description={`Delete the bookmark folder ${folderName}. This action cannot be undone.`}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Delete bookmark folder",
          message: (
            <>
              You are about to delete the bookmark folder{" "}
              <strong>{folderName}</strong>. This action cannot be undone and
              will remove all products from this folder.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Delete Folder",
          loadingLabel: "Deleting...",
          onClick: handleConfirm,
          loading: isPending,
          disabled,
          icon: Delete02Icon,
          variant: "destructive",
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <FieldGroup className="gap-4 px-4 pb-4">
          <Field>
            <FormFieldLabel
              htmlFor={inputId}
              label="Folder name"
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
