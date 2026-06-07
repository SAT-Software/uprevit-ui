export function getProfileValue(
  profile: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  const value = profile?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
