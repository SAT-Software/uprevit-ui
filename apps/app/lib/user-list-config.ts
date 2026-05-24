import type { ListFilterColumn } from "@/lib/workspace-list-query";

export const USER_SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "designation", label: "Designation" },
  { value: "location", label: "Location" },
  { value: "status", label: "Status" },
  { value: "userType", label: "User Type" },
] as const;

export const USER_FILTER_COLUMNS: ListFilterColumn[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "designation", label: "Designation", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "status", label: "Status", type: "text" },
  { name: "userType", label: "User Type", type: "text" },
];

export const ADMIN_USER_TYPE_FILTER = {
  field: "userType",
  operator: "eq" as const,
  value: "admin",
};
