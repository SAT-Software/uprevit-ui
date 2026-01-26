export type AuthProfile = Record<string, unknown> | null | undefined;

function includesAdmin(groups: unknown) {
  if (Array.isArray(groups)) {
    return groups.includes("admin");
  }

  if (typeof groups === "string") {
    return groups
      .split(",")
      .map((group) => group.trim())
      .includes("admin");
  }

  return false;
}

export function isAdminProfile(profile: AuthProfile) {
  return includesAdmin(profile?.["cognito:groups"]);
}
