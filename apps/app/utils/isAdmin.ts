export type AuthProfile = Record<string, unknown> | null | undefined;

export function hasCognitoGroup(profile: AuthProfile, group: string) {
  const groups = profile?.["cognito:groups"];
  if (Array.isArray(groups)) {
    return groups.includes(group);
  }

  if (typeof groups === "string") {
    return groups
      .split(",")
      .map((item) => item.trim())
      .includes(group);
  }

  return false;
}

export function isAdminProfile(profile: AuthProfile) {
  return hasCognitoGroup(profile, "admin");
}

export function canEditWorkspaceDataProfile(profile: AuthProfile) {
  return isAdminProfile(profile) || hasCognitoGroup(profile, "user");
}

export function isManagerProfile(profile: AuthProfile) {
  return hasCognitoGroup(profile, "manager");
}

export function canManageBillingProfile(profile: AuthProfile) {
  return isAdminProfile(profile) || isManagerProfile(profile);
}
