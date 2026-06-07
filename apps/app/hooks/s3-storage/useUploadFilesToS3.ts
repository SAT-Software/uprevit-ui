import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";

interface S3SignedUrlRequest {
  file: File;
  contentType?: string;
  uploadScope?: S3UploadScope;
  productId?: string;
}

type S3UploadScope = "workspace-assets" | "product-assets" | "source-files";

const PRODUCT_ASSET_CONTENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const SOURCE_FILE_EXTRA_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/vnd.adobe.photoshop",
  "application/photoshop",
  "application/x-photoshop",
  "application/postscript",
  "application/illustrator",
  "application/vnd.adobe.illustrator",
]);

const EXTENSION_CONTENT_TYPE_MAP: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  pdf: "application/pdf",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  psd: "image/vnd.adobe.photoshop",
  ai: "application/vnd.adobe.illustrator",
};

const resolveContentType = (file: File, providedType?: string): string => {
  const normalizedProvided = (providedType ?? "").trim().toLowerCase();
  if (normalizedProvided && normalizedProvided !== "application/octet-stream") {
    return normalizedProvided;
  }

  const fileType = (file.type ?? "").trim().toLowerCase();
  if (fileType && fileType !== "application/octet-stream") return fileType;

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) return "";
  return EXTENSION_CONTENT_TYPE_MAP[extension] ?? "";
};

const isAllowedContentType = (
  contentType: string,
  uploadScope: S3UploadScope,
) => {
  if (PRODUCT_ASSET_CONTENT_TYPES.has(contentType)) return true;
  if (uploadScope === "source-files") {
    return SOURCE_FILE_EXTRA_CONTENT_TYPES.has(contentType);
  }
  return false;
};

export function useUploadFilesToS3() {
  const auth = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      contentType,
      uploadScope = "workspace-assets",
      productId,
    }: S3SignedUrlRequest) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const resolvedContentType = resolveContentType(file, contentType);

      if (!isAllowedContentType(resolvedContentType, uploadScope)) {
        throw new Error(`Unsupported file type: ${file.name}`);
      }

      const presignRequestBody = {
        fileName: file.name,
        contentType: resolvedContentType,
        uploadScope,
        sizeBytes: file.size,
        ...(productId ? { productId } : {}),
      };

      const res = await fetch(`/api/s3-storage/presign-upload`, {
        method: "POST",
        body: JSON.stringify(presignRequestBody),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          await getResponseErrorMessage(res, "Failed to get signed URL"),
        );
      }

      const presignResponse = (await res.json()) as {
        uploadUrl?: unknown;
        key?: unknown;
        message?: unknown;
        error?: unknown;
      };

      const uploadUrl =
        typeof presignResponse.uploadUrl === "string"
          ? presignResponse.uploadUrl.trim()
          : "";
      const key =
        typeof presignResponse.key === "string"
          ? presignResponse.key.trim()
          : "";
      const details =
        typeof presignResponse.message === "string"
          ? presignResponse.message
          : typeof presignResponse.error === "string"
            ? presignResponse.error
            : "";

      if (!uploadUrl) {
        throw new Error(
          `Missing uploadUrl in presign-upload response (status ${res.status})${details ? `: ${details}` : ""}`,
        );
      }

      if (!key) {
        throw new Error(
          `Missing key in presign-upload response (status ${res.status})${details ? `: ${details}` : ""}`,
        );
      }

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": resolvedContentType,
        },
      });

      if (!putRes.ok) {
        throw new Error(
          "File upload failed. Please check your connection and try again.",
        );
      }

      return {
        key,
        originalName: file.name,
        contentType: resolvedContentType,
        size: file.size,
      };
    },
    onError: (error) => {
      const message = getErrorMessage(
        error,
        "File upload failed. Please try again.",
      );
      console.error(message);
      toast.error(message);
    },
  });
}
