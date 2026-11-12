const windows = new Map<string, { count: number; resetAt: number }>();
const MAX_TRACKED_KEYS = 10_000;

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (windows.size >= MAX_TRACKED_KEYS) {
    for (const [existingKey, window] of windows) {
      if (window.resetAt <= now) windows.delete(existingKey);
    }
    if (windows.size >= MAX_TRACKED_KEYS) {
      return { ok: false, retryAfter: Math.ceil(windowMs / 1000) };
    }
  }

  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }

  current.count += 1;
  return { ok: true, retryAfter: 0 };
}

export function rateLimitResponse(retryAfter: number) {
  return Response.json(
    { error: "Too many requests" },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
