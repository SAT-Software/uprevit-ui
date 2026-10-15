const SUPPORT_ATTACHMENT_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SUPPORT_ATTACHMENT_PATH = /^\/support\/attachments\/([^/]+)$/;

export function isSupportAttachmentId(value: unknown): value is string {
  return typeof value === "string" && SUPPORT_ATTACHMENT_ID.test(value);
}

export function getSupportReturnPath(state: unknown) {
  const returnTo =
    typeof state === "object" && state !== null && "supportReturnTo" in state
      ? state.supportReturnTo
      : undefined;
  if (typeof returnTo !== "string") return null;
  const attachmentId = SUPPORT_ATTACHMENT_PATH.exec(returnTo)?.[1];
  return isSupportAttachmentId(attachmentId) ? returnTo : null;
}
