export interface User {
  _id?: string;
  name: string;
  email: string;
  profileAvatar: string;
  profileAvatarKey?: string;
  designation: string;
  phone?: string;
  userType?: "user" | "admin";
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
