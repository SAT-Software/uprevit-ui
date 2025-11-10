export interface User {
  name: string;
  email: string;
  profileAvatar: string;
  designation: string;
  phone?: string;
  userType?: "user" | "admin";
  location?: string;
  cognitoSub: string;
  workspaceId: string | null;
  status: "invited" | "active";
}
