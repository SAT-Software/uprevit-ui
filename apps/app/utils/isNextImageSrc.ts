export const isNextImageSrc = (src: string) =>
  src.startsWith("/") ||
  src.startsWith("http://") ||
  src.startsWith("https://");

export const getNextImageSrc = (src?: string | null): string | null => {
  const trimmed = typeof src === "string" ? src.trim() : "";
  if (!trimmed || !isNextImageSrc(trimmed)) return null;
  return trimmed;
};
