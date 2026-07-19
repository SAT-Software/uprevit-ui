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
import { useInviteWorkspaceAdmin } from "@/hooks/platform-admin/useInviteWorkspaceAdmin";
import {
  Cancel01Icon,
  MailSend01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";

export function WorkspaceAdminInviteDialog({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const id = useId();
  const formId = `workspace-admin-invite-form-${id}`;
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const mutation = useInviteWorkspaceAdmin(workspaceId);

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
          Invite org admin
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Invite org admin"
        description="Invite an administrator to an existing organization workspace."
        subtitle="Adds an admin to this workspace. The person will finish a short onboarding before they can access it."
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
                htmlFor={`${id}-workspace-admin-name`}
                label="Name"
                tooltip="Full name of the person you are inviting."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-workspace-admin-name`}
                  placeholder="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </InputGroup>
            </Field>
            <Field>
              <FormFieldLabel
                htmlFor={`${id}-workspace-admin-email`}
                label="Email"
                tooltip="Invite will be sent to this email address."
              />
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  id={`${id}-workspace-admin-email`}
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
