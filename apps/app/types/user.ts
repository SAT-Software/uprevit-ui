export type UserType = "admin" | "user" | "approver";

export const PRODUCT_TEAM_USER_TYPES: UserType[] = ["admin", "user"];
export const APPROVER_USER_TYPES: UserType[] = ["admin", "user", "approver"];

export interface User {
  _id?: string;
  name: string;
  email: string;
  profileAvatar: string;
  profileAvatarKey?: string;
  profileAvatarSizeBytes?: number;
  designation: string;
  unit?: string;
  phone?: string;
  userType?: UserType | null;
  isManager?: boolean;
  location?: string;
  cognitoSub: string;
  workspaceId: string | null;
  status: "invited" | "active" | "inactive";
}

export type WorkspaceListPagination = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type UsersListResponse = {
  message: string;
  result: {
    users: User[];
    pagination: WorkspaceListPagination;
  };
};

export type MemberAccess = {
  userType: Exclude<UserType, "admin"> | null;
  isManager: boolean;
};

export type MemberAccessBlockers = {
  products: { _id: string; name: string; relationship: "owner" | "contributor" }[];
  workflows: {
    _id: string;
    numberLabel: string;
    name: string;
    relationship: "initiator" | "approver";
  }[];
};
