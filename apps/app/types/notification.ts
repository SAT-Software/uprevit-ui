export type NotificationType =
  | "product.owner_assigned"
  | "product.contributor_added"
  | "product.returned_to_draft"
  | "product.ownership_transferred";

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
