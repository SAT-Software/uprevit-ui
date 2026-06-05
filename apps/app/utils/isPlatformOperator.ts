import type { AuthProfile } from "@/utils/isAdmin";

function includesPlatformAdmin(groups: unknown) {
  if (Array.isArray(groups)) {
    return groups.includes("platform-admin");
  }

  if (typeof groups === "string") {
    return groups
      .split(",")
      .map((group) => group.trim())
      .includes("platform-admin");
  }

  return false;
}

export function isPlatformOperatorProfile(profile: AuthProfile) {
  return includesPlatformAdmin(profile?.["cognito:groups"]);
}
