"use client";

import { useQueryClient } from "@tanstack/react-query";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { Switch } from "@uprevit/ui/components/ui/switch";
import { useUpdateWorkspace } from "@/hooks/workspace/useUpdateWorkspace";
import type { Workspace } from "@/types/workspace";

export function SupportSettingsCard({
  workspace,
  isAdmin,
}: {
  workspace: Workspace;
  isAdmin: boolean;
}) {
  const queryClient = useQueryClient();
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-muted/60 pl-3 pr-2">
        <p className="text-sm font-medium">Support</p>
        <InfoTooltip content="Helps the Uprevit team troubleshoot issues reported from this workspace." />
      </div>
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="flex flex-col gap-2 md:max-w-xl">
          <FormFieldLabel
            htmlFor="support-replay-enabled"
            label="Session replay for support"
          />
          <p className="text-sm text-muted-foreground">
            When on, Uprevit records a masked replay of activity for signed-in
            members of this workspace so our team can see what happened when
            someone reports an issue. Text, form inputs, images and documents
            are hidden in the replay. Screenshots are only sent when someone
            adds them to a support message.
          </p>
          {!isAdmin ? (
            <p className="text-xs text-muted-foreground/70">
              Only workspace admins can change this setting.
            </p>
          ) : null}
        </div>
        <Switch
          id="support-replay-enabled"
          checked={workspace.supportReplayEnabled === true}
          disabled={!isAdmin || isPending}
          onCheckedChange={(supportReplayEnabled) =>
            updateWorkspace(
              { supportReplayEnabled },
              {
                onSuccess: () =>
                  queryClient.invalidateQueries({ queryKey: ["support", "config"] }),
              },
            )
          }
        />
      </div>
    </div>
  );
}
