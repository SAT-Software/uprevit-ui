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

export type MemberAccessOptionValue =
  (typeof MEMBER_ACCESS_OPTIONS)[number]["value"];

export function getMemberAccessOption(value: MemberAccessOptionValue) {
  return MEMBER_ACCESS_OPTIONS.find((option) => option.value === value)!;
}

export function getMemberAccessOptionValue(
  access: MemberAccess,
): MemberAccessOptionValue {
  return (
    MEMBER_ACCESS_OPTIONS.find(
      (option) =>
        option.access.userType === access.userType &&
        option.access.isManager === access.isManager,
    )?.value ?? "manager"
  );
}
