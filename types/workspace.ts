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
  planStart?: string;
  planEnd?: string;
  cost?: number;
  userIds?: string[];
  userCount?: number;
}
