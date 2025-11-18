import { AuditLog } from "./audit-log";

export interface Department {
  _id?: string;
  department_name: string;
  department_description: string;
  image?: string;
  manager?: string;
  admin_id: string;
  workspace_id: string;
  users?: string[];
  isArchived?: boolean | null;
  auditLogs?: AuditLog[];
}
