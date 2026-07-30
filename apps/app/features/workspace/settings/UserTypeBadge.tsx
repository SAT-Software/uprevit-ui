"use client";

import { UserIcon, UserShield01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import type { User } from "@/types/user";

export function UserTypeBadge({
  userType,
  className,
}: {
  userType?: User["userType"];
  className?: string;
}) {
  const isAdmin = (userType ?? "user") === "admin";

  return (
    <Badge
      variant={isAdmin ? "default" : "secondary"}
      className={cn("max-w-full truncate", className)}
    >
      <Icon
        icon={isAdmin ? UserShield01Icon : UserIcon}
        size={14}
        strokeWidth={2}
        className="shrink-0"
      />
      {isAdmin ? "Admin" : "User"}
    </Badge>
  );
}
