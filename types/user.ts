export interface User {
  name: string;
  profileAvatar: string;
  designation: string;
  email: string;
  phone?: string;
  confirmed?: string;
  userType?: string;
  organization: string;
  location?: string;
}
