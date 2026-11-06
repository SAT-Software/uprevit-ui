import type { MemberAccess } from "@/types/user";

export const MEMBER_ACCESS_OPTIONS = [
  {
    value: "user",
    label: "User",
    description: "Creates and edits Products and starts workflows.",
    access: { userType: "user", isManager: false },
  },
  {
    value: "user-manager",
    label: "User + Manager",
    description: "User access, plus billing and usage.",
    access: { userType: "user", isManager: true },
  },
  {
    value: "approver",
    label: "Approver",
    description: "Views everything and acts only in workflows they are assigned to.",
    access: { userType: "approver", isManager: false },
  },
  {
    value: "approver-manager",
    label: "Approver + Manager",
    description: "Approver access, plus billing and usage.",
    access: { userType: "approver", isManager: true },
  },
  {
    value: "manager",
    label: "Manager only",
    description: "Billing and usage only, with no access to Products or workflows.",
    access: { userType: null, isManager: true },
  },
] as const satisfies readonly {
  value: string;
  label: string;
  description: string;
  access: MemberAccess;
}[];

export const ADMIN_ACCESS_OPTIONS = [
  {
    value: "admin",
    label: "Admin",
    description: "Manages the workspace, its members and usage.",
    access: { userType: "admin", isManager: false },
  },
  {
    value: "admin-manager",
    label: "Admin + Manager",
    description: "Admin access, plus billing and invoices.",
    access: { userType: "admin", isManager: true },
  },
] as const satisfies readonly {
  value: string;
  label: string;
  description: string;
  access: MemberAccess;
}[];

const ALL_ACCESS_OPTIONS = [...MEMBER_ACCESS_OPTIONS, ...ADMIN_ACCESS_OPTIONS];

export type MemberAccessOptionValue =
  (typeof MEMBER_ACCESS_OPTIONS)[number]["value"];

export type AccessOptionValue = (typeof ALL_ACCESS_OPTIONS)[number]["value"];

export function getMemberAccessOption(value: AccessOptionValue) {
  return ALL_ACCESS_OPTIONS.find((option) => option.value === value)!;
}

export function getMemberAccessOptionValue(
  access: MemberAccess,
): AccessOptionValue {
  return (
    ALL_ACCESS_OPTIONS.find(
      (option) =>
        option.access.userType === access.userType &&
        option.access.isManager === access.isManager,
    )?.value ?? "manager"
  );
}
