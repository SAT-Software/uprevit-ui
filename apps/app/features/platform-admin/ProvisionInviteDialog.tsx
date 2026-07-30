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
import { useProvisionInvite } from "@/hooks/platform-admin/useProvisionInvite";
import {
  Cancel01Icon,
  MailSend01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

export function ProvisionInviteDialog() {
  const id = useId();
  const formId = `provision-invite-form-${id}`;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const mutation = useProvisionInvite();

  const resetForm = () => {
    setEmail("");
    setName("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !name || mutation.isPending) return;

    await mutation.mutateAsync({ email, name });
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icon icon={UserAdd01Icon} size={14} strokeWidth={2} />
          Invite new org admin
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Invite new org admin"
        description="Invite a new organization admin who will create their workspace on first login."
        subtitle="Sends an invite for a new organization admin. They will set up their own workspace the first time they log in."
        variant="form"
        size="md"
        primaryAction={{
          label: "Send invite",
          loadingLabel: "Sending...",
          form: formId,
          type: "submit",
          loading: mutation.isPending,
          disabled: !email || !name || mutation.isPending,
          icon: MailSend01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: mutation.isPending,
          icon: Cancel01Icon,
        }}
      >
        <form id={formId} onSubmit={handleSubmit} noValidate>
          <FieldGroup className="gap-4 p-4">
            <Field>
              <FormFieldLabel
                htmlFor={`${id}-provision-name`}
                label="Name"
                tooltip="Full name of the person you are inviting."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-provision-name`}
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </InputGroup>
            </Field>
            <Field>
              <FormFieldLabel
                htmlFor={`${id}-provision-email`}
                label="Email"
                tooltip="Invite will be sent to this email address."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-provision-email`}
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </InputGroup>
            </Field>
          </FieldGroup>
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
