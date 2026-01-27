"use client";

import { toast } from "sonner";
import { useAuth } from "react-oidc-context";
import { isAdminProfile } from "@/utils/isAdmin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiUserCirclePlusDuotone, PiXDuotone } from "react-icons/pi";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  profileAvatar: string;
}

interface AddUsersInProjectDropdownProps {
  onAddUser: (user: User) => void;
  onRemoveUser?: (user: User) => void;
  selectedUsers?: User[];
  users?: User[];
}

export default function AddUsersInProjectDropdown({
  onAddUser,
  onRemoveUser,
  selectedUsers = [],
  users = [],
}: AddUsersInProjectDropdownProps) {
  const auth = useAuth();
  const isAdmin = isAdminProfile(auth.user?.profile);

  const handleUserClick = (user: User) => {
    if (!isAdmin) {
      toast.error("Insufficient privileges, contact Admin");
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PiUserCirclePlusDuotone />
          Add Users
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        {users.map((user) => {
          const isSelected = selectedUsers.some((u) => u._id === user._id);
          return (
            <DropdownMenuItem
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                {user.profileAvatar ? (
                  <Image
                    src={user.profileAvatar}
                    alt={user.name}
                    width={24}
                    height={24}
                    className="size-6 rounded-full"
                  />
                ) : (
                  <div className="size-6 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                {user.name}
              </div>
              {isSelected && (
                <PiXDuotone className="size-4 text-muted-foreground hover:text-destructive" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
