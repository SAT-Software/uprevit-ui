export const BILLING_ACCOUNT_FIELD_TOOLTIPS = {
  status:
    "Lifecycle state of the billing account. Draft and pilot are pre-production; active is billable; past_due flags overdue payment without auto-blocking access; cancelled ends billing.",
  cadence:
    "How often the workspace is billed. Monthly and yearly cadences roll forward from the billing account creation date.",
  currency: "Currency used for account display and later provider handoff for this workspace.",
  netTerms:
    "Number of days after invoice issue before payment is due. Used for offline and manual payment workflows.",
  meteringEnabled:
    "When enabled, usage limits can block or allow over-limit usage per the workspace enforcement mode. Usage is always recorded, even when enforcement is off.",
  pastDue:
    "Marks the account as overdue for payment. Does not automatically freeze workspace access or usage.",
  ssoEnabled:
    "Actual SSO feature state for this workspace. SSO can only be enabled when the workspace usage limit allows it.",
  seatMonths:
    "Active member limit for this workspace. Invited and inactive members do not occupy seats.",
  exports:
    "Completed product or report export limit for the current billing period. Only successfully completed export jobs count.",
  uploadGb:
    "Upload volume limit for the current billing period, in gigabytes. Based on bytes uploaded during the period; decimals such as 0.5 GB are supported.",
} as const;

export const WORKSPACE_FREEZE_FIELD_TOOLTIPS = {
  usageFreeze:
    "Blocks invites, exports, and uploads while still allowing users to log in and read workspace data.",
  accessFreeze:
    "Blocks workspace login and all usage actions. Use for full workspace suspension.",
} as const;

export const BILLING_OPERATIONS_FIELD_TOOLTIPS = {
  reconciliationStatus:
    "Result of the latest reconciliation check comparing recorded usage events against underlying source records.",
  recomputeSnapshot:
    "Rebuilds the current billing period usage snapshot from recorded usage events. Use after data fixes or if totals look stale.",
  runReconciliation:
    "Runs a reconciliation check for this workspace and updates the snapshot reconciliation status.",
  adjustmentMetric:
    "Which usage metric to correct: completed exports or raw upload bytes for the current billing period.",
  adjustmentDelta:
    "Amount to add or subtract from the selected metric. Use negative values to reduce recorded usage.",
  usageAdjustment:
    "Manual correction to recorded usage for the current billing period. Creates an auditable adjustment event.",
} as const;

export const BILLING_SUMMARY_FIELD_TOOLTIPS = {
  status: BILLING_ACCOUNT_FIELD_TOOLTIPS.status,
  cadence: BILLING_ACCOUNT_FIELD_TOOLTIPS.cadence,
  currency: BILLING_ACCOUNT_FIELD_TOOLTIPS.currency,
  netTerms: BILLING_ACCOUNT_FIELD_TOOLTIPS.netTerms,
  metering: BILLING_ACCOUNT_FIELD_TOOLTIPS.meteringEnabled,
  pastDue: BILLING_ACCOUNT_FIELD_TOOLTIPS.pastDue,
  sso: BILLING_ACCOUNT_FIELD_TOOLTIPS.ssoEnabled,
  seatMonths: BILLING_ACCOUNT_FIELD_TOOLTIPS.seatMonths,
  exports: BILLING_ACCOUNT_FIELD_TOOLTIPS.exports,
  uploadGb: BILLING_ACCOUNT_FIELD_TOOLTIPS.uploadGb,
  usageFreeze: WORKSPACE_FREEZE_FIELD_TOOLTIPS.usageFreeze,
  accessFreeze: WORKSPACE_FREEZE_FIELD_TOOLTIPS.accessFreeze,
  reconciliationStatus: BILLING_OPERATIONS_FIELD_TOOLTIPS.reconciliationStatus,
  currentPeriod:
    "Start and end dates for the workspace's current billing period, anchored to when the billing account was created.",
  availableActions:
    "Maintenance actions available to platform operators: snapshot recompute, reconciliation, and manual usage adjustments.",
} as const;
