"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export type Member = {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarUrl?: string;
  isCurrentUser?: boolean;
};

export interface MembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  titlePrefix?: string; // e.g. Department / Project name
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
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
      </div>
      <Button variant="outline" onClick={onSearch}>
        Search
      </Button>
    </div>
  );
}

function MemberRow({ member }: { member: Member }) {
  const initials = useMemo(() => {
    return member.name
      .split(" ")
      .map((p) => p[0])
      .join("");
  }, [member.name]);

  return (
    <div className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
      <Avatar className="h-10 w-10">
        {member.avatarUrl ? (
          <AvatarImage src={member.avatarUrl} alt={member.name} />
        ) : null}
        <AvatarFallback className="bg-muted text-muted-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">
          {member.name}
          {member.isCurrentUser ? (
            <span className="font-normal text-muted-foreground"> (You)</span>
          ) : null}
        </p>
        {member.email ? (
          <p className="truncate text-sm text-muted-foreground">
            {member.email}
          </p>
        ) : null}
      </div>

      <Badge variant="outline" className="text-xs font-medium">
        {member.role}
      </Badge>
    </div>
  );
}

export function MembersDialog({
  open,
  onOpenChange,
  members,
  titlePrefix,
}: MembersDialogProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.email ?? ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [members, query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-xl overflow-hidden p-0">
        <div className="p-6 pb-0">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="text-xl font-semibold flex flex-row items-center gap-2">
              <p>{titlePrefix ? `${titlePrefix} ` : ""}Members</p>
              <span className="text-xs font-normal text-muted-foreground/80">
                Total users - {members.length}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-2">
            <MembersSearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => {}}
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="mt-3 max-h-[420px] space-y-1 overflow-y-auto">
            {filtered.length ? (
              filtered.map((m) => <MemberRow key={m.id} member={m} />)
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
  members,
  titlePrefix,
}: {
  members: Member[];
  titlePrefix?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const topFour = members.slice(0, 4);
  const extra = Math.max(members.length - 4, 0);

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
          {topFour.map((m) => (
            <Avatar key={m.id} className="h-7 w-7 ring-2 ring-background">
              {m.avatarUrl ? (
                <AvatarImage src={m.avatarUrl} alt={m.name} />
              ) : null}
              <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                {m.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}

          {extra > 0 ? (
            <Avatar className="h-7 w-7 ring-2 ring-background">
              <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                +{extra}
              </AvatarFallback>
            </Avatar>
          ) : null}

          {members.length === 0 ? (
            <Avatar className="h-7 w-7 ring-2 ring-background">
              <AvatarFallback className="bg-muted text-[10px] text-muted-foreground">
                0
              </AvatarFallback>
            </Avatar>
          ) : null}
        </div>
        <span className="text-xs text-muted-foreground">
          {/* {members.length}  */}
          members
          {/* {extra > 0 ? "" : ""} */}
        </span>
      </button>

      <MembersDialog
        open={open}
        onOpenChange={setOpen}
        members={members}
        titlePrefix={titlePrefix}
      />
    </>
  );
}

export default MembersDialog;
