"use client";

import type { ElementType } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@uprevit/ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@uprevit/ui/components/ui/avatar";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import {
  PiTrashDuotone,
  PiUserDuotone,
  PiIdentificationCardDuotone,
  PiBriefcaseDuotone,
  PiMapPinDuotone,
  PiInfoDuotone,
  PiUserCircleGearDuotone,
} from "react-icons/pi";
import { User } from "@/types/user";
import DialogRemoveUser from "./DialogRemoveUser";

const StaticHeader = ({
  title,
  icon: Icon,
}: {
  title: string;
  icon: ElementType;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-4 w-4 text-muted-foreground" />
    <span>{title}</span>
  </div>
);

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
      header: () => (
        <StaticHeader title="ID" icon={PiIdentificationCardDuotone} />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs">
          {String(row.getValue("_id") ?? "").slice(0, 8)}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <StaticHeader title="User" icon={PiUserDuotone} />,
      cell: ({ row }) => {
        const { name, email, profileAvatar } = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={profileAvatar} alt={name} />
              <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "userType",
      header: () => (
        <StaticHeader title="User Type" icon={PiUserCircleGearDuotone} />
      ),
      cell: ({ row }) => {
        const userType = row.getValue("userType") as string;
        if (userType === "admin") {
          return (
            <Badge variant="secondary">
              <PiUserCircleGearDuotone className="w-4 h-4" />
              Admin
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <PiUserDuotone className="w-4 h-4" />
            Member
          </Badge>
        );
      },
    },
    {
      accessorKey: "designation",
      header: () => (
        <StaticHeader title="Designation" icon={PiBriefcaseDuotone} />
      ),
      cell: ({ row }) => {
        const designation = row.getValue("designation") as string;
        if (designation) return <p>{designation}</p>;
        return <p className="text-muted-foreground">N/A</p>;
      },
    },
    {
      accessorKey: "location",
      header: () => <StaticHeader title="Location" icon={PiMapPinDuotone} />,
      cell: ({ row }) => {
        const location = row.getValue("location") as string;
        if (location) return <p>{location}</p>;
        return <p className="text-muted-foreground">N/A</p>;
      },
    },
    {
      accessorKey: "status",
      header: () => <StaticHeader title="Status" icon={PiInfoDuotone} />,
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
      enableHiding: false,
      cell: ({ row }) => {
        const { _id, name, status } = row.original;
        if (!_id || status === "inactive") {
          return (
            <div className="text-right">
              <Button variant="ghost" size="icon" disabled>
                <PiTrashDuotone className="h-4 w-4" />
                <span className="sr-only">Cannot remove user</span>
              </Button>
            </div>
          );
        }

        return (
          <div className="text-right">
            <DialogRemoveUser
              userId={_id}
              userName={name}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <PiTrashDuotone className="h-4 w-4" />
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
