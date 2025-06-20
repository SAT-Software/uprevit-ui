"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiPlusBold } from "react-icons/pi";
import { X } from "lucide-react";

interface Member {
  name: string;
  src: string;
}

interface AddMemberInProjectDropdownProps {
  onAddMember: (member: Member) => void;
  onRemoveMember?: (member: Member) => void;
  selectedMembers?: Member[];
}

// Sample members data - in a real app, this would come from an API or database
const sampleMembers: Member[] = [
  { name: "Amit Shah", src: "/avatar-80-03.jpg" },
  { name: "Priya Verma", src: "/avatar-80-04.jpg" },
  { name: "Ravi Kumar", src: "/avatar-80-05.jpg" },
  { name: "Sonal Mehta", src: "/avatar-80-06.jpg" },
  { name: "Adam Tosa", src: "/avatar-80-07.jpg" },
];

export default function AddMemberInProjectDropdown({
  onAddMember,
  onRemoveMember,
  selectedMembers = [],
}: AddMemberInProjectDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Add Members <PiPlusBold />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {sampleMembers.map((member) => {
          const isSelected = selectedMembers.some(
            (m) => m.name === member.name
          );
          return (
            <DropdownMenuItem
              key={member.name}
              onClick={() =>
                isSelected ? onRemoveMember?.(member) : onAddMember(member)
              }
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={member.src}
                  alt={member.name}
                  className="size-6 rounded-full"
                />
                {member.name}
              </div>
              {isSelected && (
                <X className="size-4 text-muted-foreground hover:text-destructive" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
