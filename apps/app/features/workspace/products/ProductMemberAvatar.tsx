import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { UserRemove01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@uprevit/ui/lib/utils";
import type { ProductTeamMember } from "@/types/product";

export function ProductMemberAvatar({
  member,
  className,
}: {
  member: Pick<ProductTeamMember, "name" | "profileAvatar">;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-6 border border-background", className)}>
      {member.profileAvatar ? (
        <AvatarImage src={member.profileAvatar} alt={member.name} />
      ) : null}
      <AvatarFallback className="bg-muted text-[10px] font-medium text-muted-foreground">
        {member.name?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

export function RemovedMemberIcon({
  member,
}: {
  member: Pick<ProductTeamMember, "status">;
}) {
  if (member.status !== "inactive") return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex shrink-0 text-destructive">
          <Icon icon={UserRemove01Icon} size={14} aria-label="Removed from workspace" />
        </span>
      </TooltipTrigger>
      <TooltipContent>Removed from workspace</TooltipContent>
    </Tooltip>
  );
}

export function ProductOwnerCell({
  owner,
}: {
  owner?: ProductTeamMember | null;
}) {
  if (!owner) return <span className="text-sm text-muted-foreground">—</span>;

  return (
    <div className="flex min-w-0 items-center gap-2" title={owner.email}>
      <ProductMemberAvatar member={owner} className="size-5" />
      <span className="truncate text-sm font-medium">{owner.name}</span>
    </div>
  );
}
