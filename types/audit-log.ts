export interface AuditLog {
  _id: string;
  action: string;
  actionAt: string;
  actionBy: string;
  active: boolean;
  entity: string;
  entityId: string;
}
