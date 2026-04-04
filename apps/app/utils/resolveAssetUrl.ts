const HTTP_URL_REGEX = /^https?:\/\//i;
const S3_KEY_PREFIX = "uploads/";

const decodeUriSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const extractUploadsKey = (value?: string | null): string | undefined => {
  if (!value) return undefined;

  const trimmedValue = value.trim();
  if (!trimmedValue) return undefined;
  if (trimmedValue.startsWith(S3_KEY_PREFIX)) return trimmedValue;

  const normalizedValue = decodeUriSafe(trimmedValue).replace(/\\/g, "/");
  const match = normalizedValue.match(/uploads\/[^?#]+/i);
  return match?.[0];
};

export const resolveAssetUrl = (
  assetReference?: string | null,
  fallbackUrl?: string | null,
): string => {
  const normalizedAssetReference = assetReference?.trim() ?? "";
  const normalizedFallbackUrl = fallbackUrl?.trim() ?? "";

  if (!normalizedAssetReference) return normalizedFallbackUrl;
  if (HTTP_URL_REGEX.test(normalizedAssetReference)) return normalizedAssetReference;

  const key = extractUploadsKey(normalizedAssetReference);
  if (!key) return normalizedFallbackUrl || normalizedAssetReference;

  const fallbackKey = extractUploadsKey(normalizedFallbackUrl);
  if (fallbackKey && fallbackKey === key) {
    return normalizedFallbackUrl;
  }

  if (normalizedFallbackUrl && !fallbackKey) {
    return normalizedFallbackUrl;
  }

  return "";
};
