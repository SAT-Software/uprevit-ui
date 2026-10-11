"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Field, FieldError, FieldGroup } from "@uprevit/ui/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@uprevit/ui/components/ui/input-group";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Cancel01Icon,
  FloppyDiskIcon,
  PlusSignSquareIcon,
} from "@hugeicons/core-free-icons";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { useGetWorkspace } from "@/hooks/workspace/useGetWorkspace";
import {
  useCreateWorkflow,
  useUpdateWorkflow,
} from "@/hooks/workflow/useWorkflows";
import type { WorkflowCompletionMode, WorkflowDetail } from "@/types/workflow";
import { WorkflowCompletionModeSelect } from "./WorkflowCompletionModeSelect";

interface FormValues {
  name: string;
  description: string;
  completionMode: WorkflowCompletionMode;
}

function WorkflowDetailsFields({
  id,
  form,
}: {
  id: string;
  form: ReturnType<typeof useForm<FormValues>>;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <FieldGroup className="gap-4 p-4">
      <Field data-invalid={!!errors.name}>
        <FormFieldLabel
          htmlFor={`${id}-name`}
          label="Name"
          tooltip="A short name people will recognise, e.g. Q3 label update."
        />
        <InputGroup size="md" className="bg-background">
          <InputGroupInput
            id={`${id}-name`}
            placeholder="Enter workflow name"
            aria-invalid={errors.name ? "true" : "false"}
            {...register("name", {
              validate: (value) => value.trim().length > 0 || "Name is required",
              maxLength: {
                value: 120,
                message: "Name must be at most 120 characters",
              },
            })}
          />
        </InputGroup>
        <FieldError errors={[errors.name]} />
      </Field>

      <Field data-invalid={!!errors.description}>
        <FormFieldLabel
          htmlFor={`${id}-description`}
          label="Description"
          tooltip="What this approval covers and why."
        />
        <InputGroup size="md" className="bg-background">
          <InputGroupTextarea
            id={`${id}-description`}
            placeholder="Describe what is being approved"
            className="min-h-24 resize-none"
            aria-invalid={errors.description ? "true" : "false"}
            {...register("description", {
              validate: (value) =>
                value.trim().length > 0 || "Description is required",
              maxLength: {
                value: 1000,
                message: "Description must be at most 1000 characters",
              },
            })}
          />
        </InputGroup>
        <FieldError errors={[errors.description]} />
      </Field>

      <Field>
        <FormFieldLabel
          htmlFor={`${id}-completion`}
          label="Completion"
          tooltip="What happens once every approver has approved."
        />
        <WorkflowCompletionModeSelect
          id={`${id}-completion`}
          value={watch("completionMode")}
          onValueChange={(value) =>
            setValue("completionMode", value, { shouldDirty: true })
          }
        />
      </Field>
    </FieldGroup>
  );
}

export function CreateWorkflowDialog() {
  const id = useId();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: workspaceData } = useGetWorkspace();
  const defaultMode: WorkflowCompletionMode =
    workspaceData?.workspace?.defaultWorkflowCompletionMode ?? "automatic";
  const form = useForm<FormValues>({
    defaultValues: { name: "", description: "", completionMode: defaultMode },
  });
  const { mutate: createWorkflow, isPending } = useCreateWorkflow();

  const handleOpenChange = (next: boolean) => {
    if (next) {
      form.reset({ name: "", description: "", completionMode: defaultMode });
    }
    setOpen(next);
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    createWorkflow(
      {
        name: values.name.trim(),
        description: values.description.trim(),
        completionMode: values.completionMode,
      },
      {
        onSuccess: ({ workflow }) => {
          setOpen(false);
          router.push(`/workflows/${workflow._id}`);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="group">
          <Icon
            icon={PlusSignSquareIcon}
            className="text-primary-foreground/60 group-hover:text-primary-foreground"
          />
          Create Workflow
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Create Workflow"
        description="Create a workflow draft. You can add Products and approvers next."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Create Draft",
          loadingLabel: "Creating…",
          form: `create-workflow-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: PlusSignSquareIcon,
        }}
        secondaryAction={{ label: "Cancel", icon: Cancel01Icon }}
      >
        <form
          id={`create-workflow-form-${id}`}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <WorkflowDetailsFields id={id} form={form} />
        </form>
      </AppDialogContent>
    </Dialog>
  );
}

export function UpdateWorkflowDialog({
  workflow,
  open,
  onOpenChange,
}: {
  workflow: WorkflowDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const values = {
    name: workflow.name,
    description: workflow.description,
    completionMode: workflow.completionMode,
  };
  const form = useForm<FormValues>({ values });
  const { mutate: updateWorkflow, isPending } = useUpdateWorkflow(workflow._id);

  const onSubmit: SubmitHandler<FormValues> = (next) => {
    updateWorkflow(
      {
        action: "update-details",
        name: next.name.trim(),
        description: next.description.trim(),
        completionMode: next.completionMode,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title="Edit Workflow"
        description="Change the workflow name, description, or completion."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Save",
          loadingLabel: "Saving…",
          form: `update-workflow-form-${id}`,
          type: "submit",
          loading: isPending,
          disabled: isPending,
          icon: FloppyDiskIcon,
        }}
        secondaryAction={{ label: "Cancel", icon: Cancel01Icon }}
      >
        <form
          id={`update-workflow-form-${id}`}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <WorkflowDetailsFields id={id} form={form} />
        </form>
      </AppDialogContent>
    </Dialog>
  );
}
