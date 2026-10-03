"use client";

import { InfoTooltip } from "@/components/common/InfoTooltip";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { WorkflowCompletionModeSelect } from "@/features/workspace/workflows/WorkflowCompletionModeSelect";
import { useUpdateWorkspace } from "@/hooks/workspace/useUpdateWorkspace";
import type { Workspace } from "@/types/workspace";

export function WorkflowSettingsCard({ workspace }: { workspace: Workspace }) {
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <p className="text-sm font-medium">Approval Workflows</p>
        <InfoTooltip content="Defaults for new workflows. The Initiator can change them on each draft." />
      </div>
      <div className="flex flex-col gap-2 p-4 md:max-w-md">
        <FormFieldLabel
          htmlFor="default-workflow-completion"
          label="Default workflow completion"
          tooltip="Used to prefill the completion of new workflow drafts."
        />
        <WorkflowCompletionModeSelect
          id="default-workflow-completion"
          value={workspace.defaultWorkflowCompletionMode ?? "automatic"}
          disabled={isPending}
          onValueChange={(defaultWorkflowCompletionMode) =>
            updateWorkspace({ ...workspace, defaultWorkflowCompletionMode })
          }
        />
      </div>
    </div>
  );
}
