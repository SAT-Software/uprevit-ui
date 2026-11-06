import { hasCognitoGroup, type AuthProfile } from "@/utils/isAdmin";

export function isPlatformOperatorProfile(profile: AuthProfile) {
  return hasCognitoGroup(profile, "platform-admin");
}
