"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { useMemo, useState } from "react";
import { Search02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";

export type User = {
  _id: string;
  name: string;
  email?: string;
  profileAvatar?: string;
};

export interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
  titlePrefix?: string;
}

function MembersSearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <InputGroup size="lg">
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
      />
      <InputGroupAddon>
        <Icon
          icon={Search02Icon}
          className="text-muted-foreground/60 group-hover:text-muted-foreground"
        />
      </InputGroupAddon>
    </InputGroup>
  );
}

function MemberRow({ member }: { member: User }) {
  const initials = useMemo(() => {
    return member?.name
      ?.split(" ")
      ?.map((p) => p[0])
      ?.join("")
      ?.toUpperCase()
      ?.slice(0, 2);
  }, [member.name]);

  return (
    <div className="group flex items-center gap-2 transition-colors hover:bg-muted/50 p-2">
      <Avatar className="h-9 w-9 border border-border">
        {member.profileAvatar ? (
          <AvatarImage src={member.profileAvatar} alt={member.name} />
        ) : null}
        <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-sm font-medium leading-none text-foreground">
          {member.name}
        </p>
        {member.email ? (
          <p className="truncate text-xs leading-none text-muted-foreground">
            {member.email}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function MembersDialog({
  open,
  onOpenChange,
  users,
  titlePrefix,
}: MembersDialogProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter((m: User) =>
      [m.name, m.email ?? ""].some((v) => v.toLowerCase().includes(q)),
    );
  }, [users, query]);

  const title = (
    <span className="flex items-center gap-2">
      {titlePrefix ? `${titlePrefix} ` : ""}Members
      <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
        {users?.length}
      </span>
    </span>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        title={title}
        description={`${titlePrefix ? `${titlePrefix} ` : ""}Members list`}
        variant="inform"
        size="sm"
        className="max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        headerExtra={
          <div className="border-b border-border bg-muted/20 p-2">
            <MembersSearchBar value={query} onChange={setQuery} />
          </div>
        }
        // bodyClassName="p-2"
      >
        <div className="space-y-2">
          {filtered?.length ? (
            filtered?.map((m: User) => <MemberRow key={m._id} member={m} />)
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
                <Icon icon={UserGroupIcon} size={20} strokeWidth={2} />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  No members found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try searching for a different name
                </p>
              </div>
            </div>
          )}
        </div>
      </AppDialogContent>
    </Dialog>
  );
}

export function MembersInlineTrigger({
  users,
  titlePrefix,
  location,
}: {
  users: User[];
  titlePrefix?: string;
  location: string;
}) {
  const [open, setOpen] = useState(false);
  const topFour = users?.slice(0, 4);
  const extra = Math.max((users?.length ?? 0) - 4, 0);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={"flex cursor-pointer items-center gap-3"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <div className="flex items-center -space-x-2">
              {topFour?.map((m) => {
                return (
                  <Avatar
                    key={m._id}
                    className="h-6 w-6 ring-2 ring-background"
                  >
                    {m?.profileAvatar ? (
                      <AvatarImage src={m.profileAvatar} alt={m.name} />
                    ) : null}
                    <AvatarFallback className="border border-border bg-muted text-[10px] text-muted-foreground">
                      {m?.name
                        ?.split(" ")
                        ?.map((p) => p[0]?.toUpperCase())
                        ?.join("")
                        ?.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                );
              })}

              {extra > 0 ? (
                <Avatar className="h-7 w-7 ring-2 ring-background">
                  <AvatarFallback className="border border-border bg-muted text-[10px] text-muted-foreground">
                    +{extra}
                  </AvatarFallback>
                </Avatar>
              ) : null}

              {users?.length === 0 ? (
                <Avatar className="h-7 w-7 ring-2 ring-background">
                  <AvatarFallback className="border border-border bg-muted text-[10px] text-muted-foreground">
                    0
                  </AvatarFallback>
                </Avatar>
              ) : null}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Users working in this {location}. Click to see complete list of
            users.
          </p>
        </TooltipContent>
      </Tooltip>

      <MembersDialog
        open={open}
        onOpenChange={setOpen}
        users={users}
        titlePrefix={titlePrefix}
      />
    </>
  );
}

export default MembersDialog;
