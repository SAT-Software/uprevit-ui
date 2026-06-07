export type BillingAccountStatus =
  | "draft"
  | "pilot"
  | "active"
  | "past_due"
  | "cancelled";

export type BillingCadence = "monthly" | "yearly";
export type EnforcementMode = "overage" | "block";
export type BillingUsageMetric =
  | "activated_seat_month"
  | "completed_export"
  | "upload_bytes";

export type UsageLimits = {
  seats: number;
  exports: number;
  uploadGb: number;
  ssoAllowed: boolean;
};

export type DeprecatedIncludedLimits = {
  seatMonths: number;
  exports: number;
  uploadGb: number;
  sso: boolean;
};

export type LimitStatusMetric = {
  used: number;
  limit: number;
  delta: number;
  overLimit: boolean;
};

export type LimitStatus = {
  seats: LimitStatusMetric;
  exports: LimitStatusMetric;
  uploadGb: LimitStatusMetric;
};

export type BillingAccount = {
  id: string;
  workspaceId: string;
  status: BillingAccountStatus;
  meteringEnabled: boolean;
  limitsEnabled: boolean;
  billingCadence: BillingCadence;
  currency: string;
  netTermDays: number;
  paymentMode: string;
  periodStart: string | null;
  periodEnd: string | null;
  usageLimits: UsageLimits;
  included: DeprecatedIncludedLimits;
  workspacePreferences: {
    enforcementMode: EnforcementMode;
  };
  sso: {
    enabled: boolean;
    enabledAt: string | null;
    disabledAt: string | null;
  };
  pastDue: boolean;
  lastReconciledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceBillingSummary = {
  account: BillingAccount;
  period: {
    start: string;
    end: string;
  };
  usage: {
    activeSeats: number;
    exports: number;
    uploadBytes: number;
    uploadGb: number;
  };
  usageLimits: UsageLimits;
  included: DeprecatedIncludedLimits;
  limitStatus: LimitStatus;
  addOns: {
    ssoEnabled: boolean;
  };
  enforcementMode: EnforcementMode;
  meteringEnabled: boolean;
  limitsEnabled: boolean;
  freezes?: WorkspaceFreezes | null;
};

export type WorkspaceFreezes = {
  usageFreeze: { enabled: boolean; updatedAt: string | null };
  accessFreeze: { enabled: boolean; updatedAt: string | null };
};

export type UsageSnapshot = {
  id: string;
  periodStart: string;
  periodEnd: string;
  usage: WorkspaceBillingSummary["usage"];
  usageLimits: UsageLimits;
  included: DeprecatedIncludedLimits;
  limitStatus: LimitStatus;
  reconciliationStatus: "pending" | "ok" | "mismatch";
  approvedForBillingAt: string | null;
  updatedAt: string;
};

export type PlatformBillingDetail = {
  account: BillingAccount;
  summary: WorkspaceBillingSummary;
  snapshot: UsageSnapshot | null;
  freezes: WorkspaceFreezes;
};
