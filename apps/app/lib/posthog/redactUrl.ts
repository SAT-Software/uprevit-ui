export function redactPath(pathname: string) {
  return pathname
    .split("/")
    .map((segment) =>
      /\d/.test(segment) ||
      /^[a-f\d]{24}$/i.test(segment) ||
      /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(segment)
        ? ":id"
        : segment,
    )
    .join("/");
}

export function redactUrl(url: string, base?: string) {
  try {
    const parsed = new URL(url, base);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    return `${parsed.origin}${redactPath(parsed.pathname)}`;
  } catch {
    return "";
  }
}
