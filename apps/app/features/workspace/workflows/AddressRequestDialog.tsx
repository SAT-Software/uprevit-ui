"use client";

import { MessageDone01Icon } from "@hugeicons/core-free-icons";
import { useAddressChangeRequest } from "@/hooks/workflow/useWorkflows";
import type { WorkflowDiscussionItem } from "@/types/workflow";
import { WorkflowNoteDialog } from "./WorkflowNoteDialog";

export function AddressRequestDialog({
  workflowId,
  item,
  open,
  onOpenChange,
}: {
  workflowId: string;
  item: WorkflowDiscussionItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { mutate: address, isPending } = useAddressChangeRequest(workflowId);

  return (
    <WorkflowNoteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Mark Addressed"
      variant="confirm"
      heading={`Mark ${item.authorSnapshot.name}'s request as addressed?`}
      message="They are notified and still need to decide. Addressing a request is not an approval."
      icon={MessageDone01Icon}
      noteLabel="Note"
      noteTooltip="Explain what you changed, or why no change is needed."
      notePlaceholder="e.g. Fixed the label, or why it's fine as is"
      required
      submitLabel="Mark Addressed"
      submitLoadingLabel="Saving…"
      submitIcon={MessageDone01Icon}
      isPending={isPending}
      onSubmit={(note) =>
        address(
          { itemId: item._id, note },
          { onSuccess: () => onOpenChange(false) },
        )
      }
    />
  );
}
