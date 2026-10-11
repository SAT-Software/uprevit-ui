import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import type { WorkflowCompletionMode } from "@/types/workflow";
import { WORKFLOW_COMPLETION_MODE_OPTIONS } from "@/utils/workflow/workflow-labels";

export function WorkflowCompletionModeSelect({
  id,
  value,
  disabled,
  onValueChange,
}: {
  id?: string;
  value: WorkflowCompletionMode;
  disabled?: boolean;
  onValueChange: (value: WorkflowCompletionMode) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(next) => onValueChange(next as WorkflowCompletionMode)}
      >
        <SelectTrigger id={id} className="h-9 w-full bg-background">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WORKFLOW_COMPLETION_MODE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {
          WORKFLOW_COMPLETION_MODE_OPTIONS.find(
            (option) => option.value === value,
          )?.description
        }
      </p>
    </div>
  );
}
