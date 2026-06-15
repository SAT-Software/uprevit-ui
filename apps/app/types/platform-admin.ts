import type {
  BillingAccountStatus,
  BillingCadence,
  EnforcementMode,
  UsageLimits,
  WorkspaceFreezes,
} from "@/types/billing";

export type PlatformAdminRole = "owner" | "operator" | "viewer";

export type PlatformOperatorSession = {
  id: string;
  email: string;
  name: string | null;
  role: PlatformAdminRole;
  status: "active" | "disabled";
  lastSeenAt: string | null;
};

export type PlatformSummary = {
  totalWorkspaces: number;
  activeUsers: number;
  invitedUsers: number;
  workspaceAdmins: number;
  billing: {
    accountsLinked: number;
    pastDueWorkspaces: number;
    limitsEnabledWorkspaces: number;
    meteringEnabledWorkspaces: number;
  };
};

export type WorkspaceBillingPreview =
  | {
      status: "not_set";
      meteringEnabled: null;
      limitsEnabled: null;
      billingCadence: null;
      currency: null;
      pastDue: null;
    }
  | {
      status: BillingAccountStatus;
      meteringEnabled: boolean;
      limitsEnabled: boolean;
      billingCadence: BillingCadence;
      currency: string;
      pastDue: boolean;
    };

export type PlatformWorkspaceListItem = {
  id: string;
  workspaceName: string;
  companyName: string;
  logo: string | null;
  planName: string | null;
  memberCount: number;
  billing: WorkspaceBillingPreview;
};

export type PlatformWorkspaceAdmin = {
  id: string;
  name: string;
  email: string;
  status: string;
  userType?: string;
};

export type PlatformAuditLogItem = {
  id: string;
  action: string;
  summary: string;
  status: "success" | "failed";
  actor: {
    email: string | null;
    name: string | null;
    role: PlatformAdminRole | null;
  };
  target: {
    type: string;
    workspaceId: string | null;
    entityId: string | null;
  };
  occurredAt: string;
  errorMessage: string | null;
};

export type PlatformWorkspaceDetail = {
  workspace: {
    id: string;
    workspaceName: string;
    companyName: string;
    description: string;
    logo: string | null;
    planName: string | null;
  };
  counts: {
    members: number;
    activeMembers: number;
    invitedMembers: number;
    admins: number;
  };
  admins: PlatformWorkspaceAdmin[];
  billing: WorkspaceBillingPreview;
  freezes?: WorkspaceFreezes;
  recentAuditLogs: PlatformAuditLogItem[];
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UpdatePlatformBillingAccountInput = {
  status?: BillingAccountStatus;
  billingCadence?: BillingCadence;
  currency?: string;
  netTermDays?: number;
  meteringEnabled?: boolean;
  limitsEnabled?: boolean;
  enforcementMode?: EnforcementMode;
  ssoEnabled?: boolean;
  usageLimits?: Partial<UsageLimits>;
};
