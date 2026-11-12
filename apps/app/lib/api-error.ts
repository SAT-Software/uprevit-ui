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

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getResponseError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  return new ApiError(
    await getResponseErrorMessage(response, fallbackMessage),
    response.status,
  );
}

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (error instanceof ApiError) {
    const retryable =
      error.status >= 500 || error.status === 408 || error.status === 429;
    if (!retryable) return false;
  }
  return failureCount < 3;
}
