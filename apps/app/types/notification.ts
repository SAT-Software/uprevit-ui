export type NotificationType =
  | "product.owner_assigned"
  | "product.contributor_added"
  | "product.returned_to_draft"
  | "product.ownership_transferred"
  | "workflow.approval_requested"
  | "workflow.product_in_review"
  | "workflow.approved"
  | "workflow.changes_requested"
  | "workflow.change_request_addressed"
  | "workflow.content_changed"
  | "workflow.approver_replaced"
  | "workflow.approver_unavailable"
  | "workflow.reminder"
  | "workflow.ready_to_complete"
  | "workflow.completed"
  | "workflow.rejected"
  | "workflow.cancelled";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
  readAt: string | null;
  createdAt: string;
}

export interface GetNotificationsResponse {
  result: {
    notifications: AppNotification[];
    unreadCount: number;
    pagination: {
      currentPage: number;
      totalCount: number;
      hasNextPage: boolean;
    };
  };
}
