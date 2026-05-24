export async function getResponseErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) return fallbackMessage;

  try {
    const body = JSON.parse(text);
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
  } catch {
    return text;
  }

  return fallbackMessage;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error && error.message
    ? error.message
    : fallbackMessage;
}
