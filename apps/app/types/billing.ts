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

export type WorkspaceLimits = UsageLimits & {
  enabled: boolean;
  enforcementMode: EnforcementMode;
};

export type BillingAccountChargebee = {
  customerId: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  planId: string | null;
  planName: string | null;
  billingCadence: BillingCadence | null;
  currentTermStart: string | null;
  currentTermEnd: string | null;
  nextBillingAt: string | null;
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

/** Workspace billing profile returned from billing APIs. */
export type BillingAccount = {
  id: string;
  workspaceId: string;
  status: BillingAccountStatus;
  limits: WorkspaceLimits;
  limitsEnabled: boolean;
  meteringEnabled: boolean;
  billingCadence: BillingCadence;
  currency: string;
  netTermDays: number;
  paymentMode: string;
  periodStart: string | null;
  periodEnd: string | null;
  usageLimits: UsageLimits;
  chargebee: BillingAccountChargebee | null;
  sso: {
    enabled: boolean;
    enabledAt: string | null;
    disabledAt: string | null;
  };
  pastDue: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceBillingSummary = {
  account: BillingAccount;
  period: {
    start: string;
    end: string;
    source: "chargebee" | "internal";
  };
  usage: {
    activeSeats: number;
    exports: number;
    uploadBytes: number;
    uploadGb: number;
  };
  limits: WorkspaceLimits;
  usageLimits: UsageLimits;
  limitStatus: LimitStatus;
  addOns: {
    ssoEnabled: boolean;
  };
  enforcementMode: EnforcementMode;
  limitsEnabled: boolean;
  meteringEnabled: boolean;
  freezes?: WorkspaceFreezes | null;
};

export type WorkspaceFreezes = {
  usageFreeze: { enabled: boolean; updatedAt: string | null };
  accessFreeze: { enabled: boolean; updatedAt: string | null };
};

export type PlatformBillingDetail = {
  account: BillingAccount;
  summary: WorkspaceBillingSummary;
  freezes: WorkspaceFreezes;
  failedUsageEventSyncCount: number;
};

export type UsageEventSource =
  | "user_activation"
  | "export_job"
  | "upload_commit"
  | "platform_adjustment";

export type UsageEventMetric = BillingUsageMetric;

export type UsageEventChargebeeSyncStatus =
  | "pending_link"
  | "pending"
  | "synced"
  | "failed"
  | "manual_correction_required";

export type UsageEventChargebeeSync = {
  status: UsageEventChargebeeSyncStatus;
  deduplicationId: string;
  attempts?: number;
  lastError?: string | null;
};

export type UsageEvent = {
  id: string;
  metric: UsageEventMetric;
  source: UsageEventSource;
  sourceId: string;
  occurredAt: string;
  chargebeeSync?: UsageEventChargebeeSync | null;
};

export type ChargebeeInvoice = {
  id: string;
  status: string;
  date: string | null;
  dueDate: string | null;
  total: number;
  amountPaid: number;
  amountDue: number;
  currencyCode: string | null;
  subscriptionId: string | null;
};

export type ChargebeeInvoiceLineItem = {
  id: string;
  description: string | null;
  amount: number;
  unitAmount: number;
  quantity: number;
  dateFrom: string | null;
  dateTo: string | null;
  entityType: string | null;
  entityId: string | null;
};

export type ChargebeeBillingAddress = {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
};

export type ChargebeeInvoiceDetail = ChargebeeInvoice & {
  customerId: string;
  subTotal: number;
  tax?: number;
  creditsApplied?: number;
  lineItems: ChargebeeInvoiceLineItem[];
  billingAddress: ChargebeeBillingAddress | null;
};

export type BillingInvoiceDownload = {
  downloadUrl: string;
  mimeType: string | null;
  validTill: string | null;
};

export type BillingInvoiceDownloadResponse = {
  invoiceId: string;
  downloads: BillingInvoiceDownload[];
  pdfDownloadUrl: string | null;
};

export type BillingChargebeeConnection = {
  configured: boolean;
  linked: boolean;
  customerId: string | null;
  subscriptionId: string | null;
};

export type BillingChargebeeDetail = {
  account: BillingAccount;
  connection: BillingChargebeeConnection;
  invoices: ChargebeeInvoice[];
  invoiceError: string | null;
};
