"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import { PiMagnifyingGlassDuotone, PiUserDuotone } from "react-icons/pi";

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
    <InputGroup>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search..."
      />
      <InputGroupAddon>
        <PiMagnifyingGlassDuotone />
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
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors border border-border hover:bg-muted/50 group">
      <Avatar className="h-9 w-9 border border-border">
        {member.profileAvatar ? (
          <AvatarImage src={member.profileAvatar} alt={member.name} />
        ) : null}
        <AvatarFallback className="bg-muted text-xs font-medium text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        <p className="truncate text-sm font-medium text-foreground leading-none">
          {member.name}
        </p>
        {member.email ? (
          <p className="truncate text-xs text-muted-foreground leading-none">
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
      [m.name, m.email ?? ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [users, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-md overflow-hidden p-0 gap-0 border-border shadow-lg sm:rounded-xl">
        <DialogHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between space-y-0 bg-muted/10">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            {titlePrefix ? `${titlePrefix} ` : ""}Members
            <span className="flex items-center justify-center bg-muted border border-border text-muted-foreground text-[10px] font-medium px-1.5 h-5 rounded-full min-w-5">
              {users?.length}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-3 border-b border-border bg-muted/5">
          <MembersSearchBar value={query} onChange={setQuery} />
        </div>

        <ScrollArea className="max-h-[400px] overflow-y-auto my-2">
          <div className="p-2 space-y-2">
            {filtered?.length ? (
              filtered?.map((m: User) => <MemberRow key={m._id} member={m} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted/50">
                  <PiUserDuotone className="h-5 w-5 text-muted-foreground" />
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function MembersInlineTrigger({
  users,
  titlePrefix,
  className,
}: {
  users: User[];
  titlePrefix?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const topFour = users?.slice(0, 4);
  const extra = Math.max((users?.length ?? 0) - 4, 0);

  return (
    <>
      <button
        type="button"
        className={"flex items-center gap-3 cursor-pointer"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <div className="flex items-center -space-x-2">
          {topFour?.map((m) => {
            return (
              <Avatar key={m._id} className="h-7 w-7 ring-2 ring-background">
                {m?.profileAvatar ? (
                  <AvatarImage src={m.profileAvatar} alt={m.name} />
                ) : null}
                <AvatarFallback className="bg-muted text-[10px] border border-border text-muted-foreground">
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
              <AvatarFallback className="bg-muted text-[10px] border border-border text-muted-foreground">
                +{extra}
              </AvatarFallback>
            </Avatar>
          ) : null}

          {users?.length === 0 ? (
            <Avatar className="h-7 w-7 ring-2 ring-background">
              <AvatarFallback className="bg-muted text-[10px] border border-border text-muted-foreground">
                0
              </AvatarFallback>
            </Avatar>
          ) : null}
        </div>
      </button>

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
