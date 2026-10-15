import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { getResponseErrorMessage } from "@/lib/api-error";
import { redactUrl } from "@/lib/posthog/redactUrl";
import { useSupportConversationsClient } from "@/hooks/support/useSupportConversations";
import type { SupportConfig, SupportDraft } from "@/types/support";

export const SUPPORT_IMAGE_LIMIT = 4;
export const SUPPORT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const SUPPORT_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
];

const CATEGORY_LABELS: Record<SupportDraft["category"], string> = {
  bug: "Bug",
  feature: "Feature request",
  other: "Other",
};

async function uploadSupportImage(file: File, accessToken: string, checkCurrent: () => void) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const createResponse = await fetch("/api/support/attachments", {
    method: "POST",
    headers,
    body: JSON.stringify({ contentType: file.type, sizeBytes: file.size }),
  });
  if (!createResponse.ok) {
    throw new Error(
      await getResponseErrorMessage(createResponse, `Could not upload ${file.name}.`),
    );
  }

  const { result } = (await createResponse.json()) as {
    result: { id: string; upload: { url: string; fields: Record<string, string> } };
  };
  checkCurrent();

  const formData = new FormData();
  Object.entries(result.upload.fields).forEach(([key, value]) =>
    formData.append(key, value),
  );
  formData.append("file", file);

  const uploadResponse = await fetch(result.upload.url, {
    method: "POST",
    body: formData,
  });
  if (!uploadResponse.ok) {
    throw new Error(`Could not upload ${file.name}. Please try again.`);
  }
  checkCurrent();

  const completeResponse = await fetch(
    `/api/support/attachments/${result.id}/complete`,
    { method: "POST", headers },
  );
  if (!completeResponse.ok) {
    throw new Error(
      await getResponseErrorMessage(completeResponse, `Could not upload ${file.name}.`),
    );
  }
  checkCurrent();

  return result.id;
}

function composeSupportMessage(draft: SupportDraft, attachmentIds: string[]) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
  const title = draft.title.trim();
  const lines = [
    `[${CATEGORY_LABELS[draft.category]}]${title ? ` ${title}` : ""}`,
    "",
    draft.message.trim(),
  ];

  if (attachmentIds.length > 0) {
    lines.push(
      "",
      "Screenshots:",
      ...attachmentIds.map((id) => `${appUrl}/support/attachments/${id}`),
    );
  }

  lines.push("", `Page: ${redactUrl(window.location.href)}`);
  return lines.join("\n");
}

export function useSendSupportMessage(config: SupportConfig | undefined) {
  const auth = useAuth();
  const queryClient = useQueryClient();
  const { getConversations } = useSupportConversationsClient(config);

  return useMutation({
    mutationFn: async ({
      draft,
      onImageUploaded,
    }: {
      draft: SupportDraft;
      onImageUploaded: (localId: string, attachmentId: string) => void;
    }) => {
      const accessToken = auth.user?.access_token;
      const checkCurrent = () => {
        getConversations();
      };
      if (!accessToken) {
        throw new Error("Your session has expired. Please sign in again.");
      }
      if (!config?.identityHash) {
        throw new Error("Support is not available for your account yet.");
      }
      checkCurrent();

      const attachmentIds: string[] = [];
      for (const image of draft.images) {
        checkCurrent();
        const attachmentId =
          image.attachmentId ?? (await uploadSupportImage(image.file, accessToken, checkCurrent));
        checkCurrent();
        onImageUploaded(image.localId, attachmentId);
        attachmentIds.push(attachmentId);
      }

      let response;
      checkCurrent();
      try {
        response = await getConversations().sendMessage(
          composeSupportMessage(draft, attachmentIds),
          { name: draft.name.trim(), email: draft.email.trim() },
          true,
        );
      } catch {
        throw new Error(
          "Could not reach support. Check your connection and try again.",
        );
      }
      checkCurrent();

      if (!response?.ticket_id) {
        throw new Error("Support is unavailable right now. Please try again in a moment.");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support", "tickets"] });
    },
  });
}
