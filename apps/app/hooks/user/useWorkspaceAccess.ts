import { useAuth } from "react-oidc-context";
import {
  canEditWorkspaceDataProfile,
  canManageBillingProfile,
  isAdminProfile,
} from "@/utils/isAdmin";

/** What the signed-in member may do in the workspace, from their Cognito groups. */
export function useWorkspaceAccess() {
  const profile = useAuth().user?.profile;

  return {
    isAdmin: isAdminProfile(profile),
    canEdit: canEditWorkspaceDataProfile(profile),
    canManageBilling: canManageBillingProfile(profile),
  };
}
