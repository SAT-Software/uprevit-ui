export interface Workspace {
  _id?: string;
  workspaceName: string;
  companyName: string;
  companyId: string;
  description: string;
  logo?: string;
  plan?: string;
  planName?: string;
  planId?: string;
  planStart?: string | null;
  planEnd?: string | null;
  cost?: number;
  adminIds?: string[];
  userIds?: string[];
}
