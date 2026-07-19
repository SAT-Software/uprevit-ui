"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@uprevit/ui/components/ui/avatar";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import {
  Delete02Icon,
  UserIcon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { User } from "@/types/user";
import DialogRemoveUser from "./DialogRemoveUser";

function UserStatusBadge({ status }: { status: User["status"] }) {
  const statusClasses = {
    active:
      "bg-green-50/90 dark:bg-green-900/60 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-700",
    invited:
      "bg-yellow-50/90 dark:bg-yellow-900/60 text-yellow-600 dark:text-yellow-400 border border-yellow-500 dark:border-yellow-700",
    inactive:
      "bg-muted text-muted-foreground border border-border",
  };
  const displayText =
    status === "active" ? "Active" : status === "invited" ? "Invited" : "Removed";

  return <Badge className={cn(statusClasses[status])}>{displayText}</Badge>;
}

export function getUserTableColumns(isAdmin: boolean): ColumnDef<User>[] {
  const baseColumns: ColumnDef<User>[] = [
    {
      accessorKey: "_id",
      header: "ID",
      size: 72,
      cell: ({ row }) => (
        <div className="truncate font-mono text-xs">
          {String(row.getValue("_id") ?? "").slice(0, 8)}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "User",
      size: 280,
      cell: ({ row }) => {
        const { name, email, profileAvatar } = row.original;
        return (
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="size-6 shrink-0">
              <AvatarImage src={profileAvatar} alt={name} />
              <AvatarFallback className="text-[10px]">
                {name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "userType",
      header: "User Type",
      size: 108,
      cell: ({ row }) => {
        const userType = row.getValue("userType") as string;
        if (userType === "admin") {
          return (
            <Badge variant="secondary" className="max-w-full truncate">
              <Icon icon={UserShield01Icon} size={14} strokeWidth={2} className="shrink-0" />
              Admin
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="max-w-full gap-1 truncate text-muted-foreground"
          >
            <Icon icon={UserIcon} size={14} strokeWidth={2} className="shrink-0" />
            Member
          </Badge>
        );
      },
    },
    {
      accessorKey: "designation",
      header: "Designation",
      size: 132,
      cell: ({ row }) => {
        const designation = row.getValue("designation") as string;
        if (designation) {
          return <p className="truncate text-sm">{designation}</p>;
        }
        return <p className="text-sm text-muted-foreground">N/A</p>;
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      size: 132,
      cell: ({ row }) => {
        const location = row.getValue("location") as string;
        if (location) {
          return <p className="truncate text-sm">{location}</p>;
        }
        return <p className="text-sm text-muted-foreground">N/A</p>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 96,
      cell: ({ row }) => (
        <UserStatusBadge status={row.getValue("status") as User["status"]} />
      ),
    },
  ];

  if (!isAdmin) {
    return baseColumns;
  }

  return [
    ...baseColumns,
    {
      id: "remove",
      header: () => <span className="sr-only">Remove</span>,
      size: 44,
      enableHiding: false,
      cell: ({ row }) => {
        const { _id, name, status } = row.original;
        if (!_id || status === "inactive") {
          return (
            <div className="flex justify-end">
              <Button variant="ghost" size="icon" className="size-7" disabled>
                <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                <span className="sr-only">Cannot remove user</span>
              </Button>
            </div>
          );
        }

        return (
          <div className="flex justify-end">
            <DialogRemoveUser
              userId={_id}
              userName={name}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Icon icon={Delete02Icon} size={14} strokeWidth={2} />
                  <span className="sr-only">Remove user</span>
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];
}
