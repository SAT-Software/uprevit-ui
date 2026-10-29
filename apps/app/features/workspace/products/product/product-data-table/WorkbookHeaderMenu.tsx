import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";

export function WorkbookHeaderMenu({
  axis,
  label,
  onInsert,
  onDelete,
  onHeight,
}: {
  axis: "row" | "column";
  label: string;
  onInsert: (after: boolean) => void;
  onDelete: () => void;
  onHeight?: (reset: boolean) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-2xs" variant="ghost" aria-label={label}>
          <Icon icon={MoreVerticalIcon} size={12} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => onInsert(false)}>
          Insert {axis} {axis === "row" ? "above" : "left"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onInsert(true)}>
          Insert {axis} {axis === "row" ? "below" : "right"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete}>Delete {axis}</DropdownMenuItem>
        {onHeight && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => onHeight(false)}>
              Row height…
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onHeight(true)}>
              Reset row height
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
