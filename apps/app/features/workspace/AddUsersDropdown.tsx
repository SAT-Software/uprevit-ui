"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { PiUserCirclePlusDuotone, PiXDuotone } from "react-icons/pi";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  profileAvatar: string;
}

interface AddUsersDropdownProps {
  onAddUser: (user: User) => void;
  onRemoveUser?: (user: User) => void;
  selectedUsers?: User[];
  users?: User[];
}

export default function AddUsersDropdown({
  onAddUser,
  onRemoveUser,
  selectedUsers = [],
  users = [],
}: AddUsersDropdownProps) {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const handleUserClick = (user: User) => {
    if (!isAdmin) {
      toast.warning("Insufficient privileges, contact Admin");
      return;
    }
    const isSelected = selectedUsers.some((u) => u._id === user._id);
    if (isSelected) {
      onRemoveUser?.(user);
    } else {
      onAddUser(user);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
        >
          <PiUserCirclePlusDuotone />
          Add Users
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0"
        align="start"
        onWheel={(event) => event.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Search users..." className="h-9" />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {users.map((user) => {
                const isSelected = selectedUsers.some(
                  (u) => u._id === user._id,
                );
                return (
                  <CommandItem
                    key={user._id}
                    value={user.name}
                    onSelect={() => handleUserClick(user)}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {user.profileAvatar ? (
                        <Image
                          src={user.profileAvatar}
                          alt={user.name}
                          width={24}
                          height={24}
                          className="size-6 shrink-0 rounded-full"
                        />
                      ) : (
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-sm text-muted-foreground">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="truncate">{user.name}</span>
                    </div>
                    {isSelected && (
                      <PiXDuotone className="size-4 shrink-0 text-muted-foreground" />
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
