"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ButtonGroup } from "../ui/button-group";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";

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
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="flex gap-2">
      <ButtonGroup className="w-full">
        <Button variant="outline" aria-label="Search">
          <PiMagnifyingGlassDuotone size={18} />
        </Button>
        <Input
          placeholder="Search by name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onClick={onSearch}
          className="pl-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
      </ButtonGroup>
      <Button variant="outline" onClick={onSearch}>
        Search
      </Button>
    </div>
  );
}

function MemberRow({ member }: { member: User }) {
  const initials = useMemo(() => {
    return member?.name
      ?.split(" ")
      ?.map((p) => p[0])
      ?.join("");
  }, [member.name]);

  return (
    <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <Avatar className="h-10 w-10">
        {member.profileAvatar ? (
          <AvatarImage src={member.profileAvatar} alt={member.name} />
        ) : null}
        <AvatarFallback className="bg-muted text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{member.name}</p>
        {member.email ? (
          <p className="truncate text-sm text-muted-foreground">
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
      <DialogContent className="max-h-[80vh] max-w-xl overflow-hidden p-0">
        <div className="p-6 pb-0">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-semibold flex flex-row items-center gap-2">
              <p>{titlePrefix ? `${titlePrefix} ` : ""}Users</p>
              <span className="text-xs font-normal text-muted-foreground/80">
                Total users - {users?.length}
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* <div className="mt-2">
            <MembersSearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => {}}
            />
          </div> */}
        </div>

        <div className="px-6 pb-6">
          <div className="mt-3 max-h-[420px] space-y-1 overflow-y-auto">
            {filtered?.length ? (
              filtered?.map((m: User) => <MemberRow key={m._id} member={m} />)
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No members found
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MembersInlineTrigger({
  users,
  titlePrefix,
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
                <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                  {m?.name
                    ?.split(" ")
                    ?.map((p) => p[0]?.toUpperCase())
                    ?.join("")}
                </AvatarFallback>
              </Avatar>
            );
          })}

          {extra > 0 ? (
            <Avatar className="h-7 w-7 ring-2 ring-background">
              <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                +{extra}
              </AvatarFallback>
            </Avatar>
          ) : null}

          {users?.length === 0 ? (
            <Avatar className="h-7 w-7 ring-2 ring-background">
              <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                0
              </AvatarFallback>
            </Avatar>
          ) : null}
        </div>
        {users?.length <= 4 && extra === 0 && (
          <div className="flex gap-1">
            <span className="text-xs text-muted-foreground">
              {users?.length}
            </span>
            <span className="text-xs text-muted-foreground">users</span>
          </div>
        )}
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
