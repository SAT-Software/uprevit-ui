"use client";

import { useId, useState } from "react";

import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import { useRemoveUser } from "@/hooks/user/useRemoveUser";
import {
  Alert01Icon,
  Cancel01Icon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

export interface DialogRemoveUserProps {
  userId: string;
  userName: string;
  trigger: React.ReactNode;
}

export default function DialogRemoveUser({
  userId,
  userName,
  trigger,
}: DialogRemoveUserProps) {
  const inputId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const { mutate: removeUser, isPending } = useRemoveUser();

  const disabled = value !== userName || isPending;

  function handleConfirm() {
    if (disabled) return;

    removeUser(userId, {
      onSuccess: () => {
        setOpen(false);
        setValue("");
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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <AppDialogContent
        title="Remove from workspace"
        description={`Remove ${userName} from this workspace.`}
        variant="confirm-destructive"
        size="md"
        confirmContent={{
          heading: "Remove from workspace",
          message: (
            <>
              You are about to remove <strong>{userName}</strong> from this
              workspace. They will lose access immediately, but their historical
              activity in the workspace will be preserved.
            </>
          ),
          icon: Alert01Icon,
        }}
        primaryAction={{
          label: "Remove",
          loadingLabel: "Removing...",
          onClick: handleConfirm,
          loading: isPending,
          disabled,
          icon: UserRemove01Icon,
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
              label="User name"
              tooltip={`Type "${userName}" to confirm removal.`}
            />
            <InputGroup size="md" className="bg-background">
              <InputGroupInput
                id={inputId}
                type="text"
                placeholder={`Type ${userName} to confirm`}
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
