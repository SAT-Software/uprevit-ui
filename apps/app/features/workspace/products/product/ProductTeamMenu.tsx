"use client";

import { useState } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { ArrowDown01Icon, UserSettings01Icon } from "@hugeicons/core-free-icons";
import type { ProductTeam, ProductTeamMember } from "@/types/product";
import { ProductMemberAvatar } from "../ProductMemberAvatar";
import ProductTeamDialog from "../ProductTeamDialog";

const MAX_CONTRIBUTOR_AVATARS = 3;

function ProductTeamMenuMember({ member }: { member: ProductTeamMember }) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <ProductMemberAvatar member={member} />
      <div className="min-w-0">
        <p className="truncate text-sm">{member.name}</p>
        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
      </div>
    </div>
  );
}

export default function ProductTeamMenu({
  productId,
  team,
  canManageTeam,
}: {
  productId: string;
  team: ProductTeam;
  canManageTeam: boolean;
}) {
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const contributors = team.contributors ?? [];
  const hiddenContributors = contributors.length - MAX_CONTRIBUTOR_AVATARS;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 max-w-56 gap-2 px-1.5 font-normal"
            aria-label="Product team"
          >
            {team.owner ? (
              <ProductMemberAvatar member={team.owner} className="size-5" />
            ) : null}
            <span className="truncate text-xs">
              {team.owner?.name ?? "No owner"}
            </span>
            {contributors.length > 0 ? (
              <span className="flex -space-x-1.5">
                {contributors.slice(0, MAX_CONTRIBUTOR_AVATARS).map((member) => (
                  <ProductMemberAvatar
                    key={member._id}
                    member={member}
                    className="size-5"
                  />
                ))}
                {hiddenContributors > 0 ? (
                  <span className="flex size-5 items-center justify-center rounded-full border border-background bg-muted text-[10px] text-muted-foreground">
                    +{hiddenContributors}
                  </span>
                ) : null}
              </span>
            ) : null}
            <Icon icon={ArrowDown01Icon} size={12} className="shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Product Owner
            </DropdownMenuLabel>
            {team.owner ? (
              <ProductTeamMenuMember member={team.owner} />
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No owner
              </p>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Contributors
            </DropdownMenuLabel>
            {contributors.length > 0 ? (
              contributors.map((member) => (
                <ProductTeamMenuMember key={member._id} member={member} />
              ))
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No contributors
              </p>
            )}
          </DropdownMenuGroup>
          {canManageTeam ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setTimeout(() => setTeamDialogOpen(true), 100)}
              >
                <Icon icon={UserSettings01Icon} />
                Manage team
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      {canManageTeam ? (
        <ProductTeamDialog
          open={teamDialogOpen}
          onOpenChange={setTeamDialogOpen}
          productId={productId}
          team={team}
        />
      ) : null}
    </>
  );
}
