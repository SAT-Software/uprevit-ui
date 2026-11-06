"use client";

import {
  CreditCardIcon,
  UserCheck01Icon,
  UserIcon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { cn } from "@uprevit/ui/lib/utils";
import type { User, UserType } from "@/types/user";

const USER_TYPE_LABELS: Record<UserType, string> = {
  admin: "Admin",
  user: "User",
  approver: "Approver",
};

const USER_TYPE_ICONS = {
  admin: UserShield01Icon,
  user: UserIcon,
  approver: UserCheck01Icon,
};

export function UserTypeBadge({
  userType,
  isManager,
  className,
}: Pick<User, "userType" | "isManager"> & { className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-1", className)}>
      {userType ? (
        <Badge
          variant={userType === "admin" ? "default" : "secondary"}
          className="max-w-full truncate"
        >
          <Icon
            icon={USER_TYPE_ICONS[userType]}
            size={14}
            strokeWidth={2}
            className="shrink-0"
          />
          {USER_TYPE_LABELS[userType]}
        </Badge>
      ) : null}
      {isManager ? (
        <Badge variant="outline" className="max-w-full truncate">
          <Icon
            icon={CreditCardIcon}
            size={14}
            strokeWidth={2}
            className="shrink-0"
          />
          Manager
        </Badge>
      ) : null}
    </div>
  );
}
