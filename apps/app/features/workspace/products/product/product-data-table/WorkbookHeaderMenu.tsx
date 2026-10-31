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
        <Button size="icon-2xs" variant="ghost" aria-label={label} className="hover:bg-accent-foreground/10">
          <Icon icon={MoreVerticalIcon} size={10} strokeWidth={2} className="size-2.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onSelect={() => onInsert(false)}>
          Insert {axis} {axis === "row" ? "above" : "left"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onInsert(true)}>
          Insert {axis} {axis === "row" ? "below" : "right"}
        </DropdownMenuItem>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete {axis}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
