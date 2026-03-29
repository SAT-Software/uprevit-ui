export interface AuditLog {
  _id: string;
  action: string;
  actionAt: string;
  actionBy: string;
  active: boolean;
  entity: string;
  entityId: string;
}

export type AuditScopeType =
  | "product"
  | "project"
  | "department"
  | "source-files"
  | "archive";

export type AuditVisibility = "all" | "admin";

export interface AuditLogV2Change {
  path: string;
  from?: unknown;
  to?: unknown;
}

export interface AuditLogV2 {
  _id: string;
  schemaVersion: 2;
  workspaceId: string;
  scope: {
    type: AuditScopeType;
    id: string;
  };
  entity?: {
    type: "product" | "project" | "department" | "source_file" | "source_folder";
    id: string;
  };
  action:
    | "create"
    | "update"
    | "delete"
    | "move"
    | "archive"
    | "restore"
    | "submit"
    | "link"
    | "unlink";
  eventKey: string;
  summary: string;
  actor: {
    userId?: string;
    name: string;
    email?: string;
    role?: "admin" | "user";
  };
  where: {
    module: "products" | "projects" | "departments" | "source-files" | "archive";
    tab?: string;
    parentId?: string;
  };
  changes?: AuditLogV2Change[];
  visibility: AuditVisibility;
  occurredAt: string;
}

export interface GetAuditLogsResponse {
  message: string;
  result: {
    logs: AuditLogV2[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
