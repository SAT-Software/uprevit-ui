import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
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
