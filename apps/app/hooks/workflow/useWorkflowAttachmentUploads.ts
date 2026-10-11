import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadFilesToS3 } from "@/hooks/s3-storage/useUploadFilesToS3";

export const WORKFLOW_ATTACHMENT_LIMIT = 4;
export const WORKFLOW_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const WORKFLOW_ATTACHMENT_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif";

export type WorkflowAttachmentUpload = {
  key: string;
  name: string;
  previewUrl: string;
};

/** Uploads images picked or pasted into a workflow comment or change request, before it is posted. */
export function useWorkflowAttachmentUploads(workflowId: string) {
  const [attachments, setAttachments] = useState<WorkflowAttachmentUpload[]>(
    [],
  );
  const [uploading, setUploading] = useState(0);
  const { mutateAsync: upload } = useUploadFilesToS3();
  // Previews this composer still owns; revoked when it unmounts so closed dialogs don't keep the image data.
  const previewUrls = useRef<Set<string> | null>(null);

  useEffect(() => {
    const urls = new Set<string>();
    previewUrls.current = urls;
    return () => {
      previewUrls.current = null;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const addFiles = async (files: File[]) => {
    const room = WORKFLOW_ATTACHMENT_LIMIT - attachments.length - uploading;
    if (files.length > room) {
      toast.error(`You can attach up to ${WORKFLOW_ATTACHMENT_LIMIT} images`);
    }
    const accepted = files.slice(0, Math.max(room, 0)).filter((file) => {
      if (!WORKFLOW_ATTACHMENT_ACCEPT.split(",").includes(file.type)) {
        toast.error(`${file.name} is not a PNG, JPEG, WebP or GIF image`);
        return false;
      }
      if (file.size > WORKFLOW_ATTACHMENT_MAX_BYTES) {
        toast.error(`${file.name} is larger than 10 MB`);
        return false;
      }
      return true;
    });

    setUploading((count) => count + accepted.length);
    await Promise.all(
      accepted.map(async (file) => {
        try {
          const { key } = await upload({
            file,
            uploadScope: "workflow-attachments",
            workflowId,
          });
          const urls = previewUrls.current;
          if (!urls) return;
          const previewUrl = URL.createObjectURL(file);
          urls.add(previewUrl);
          setAttachments((current) => [
            ...current,
            { key, name: file.name, previewUrl },
          ]);
        } catch {
          // useUploadFilesToS3 already shows the error.
        } finally {
          setUploading((count) => count - 1);
        }
      }),
    );
  };

  const revokePreview = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl);
    previewUrls.current?.delete(previewUrl);
  };

  const remove = (key: string) => {
    const attachment = attachments.find((item) => item.key === key);
    if (attachment) revokePreview(attachment.previewUrl);
    setAttachments((current) => current.filter((item) => item.key !== key));
  };

  const reset = () => {
    attachments.forEach((attachment) => revokePreview(attachment.previewUrl));
    setAttachments([]);
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const images = Array.from(event.clipboardData.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (images.length === 0) return;
    event.preventDefault();
    void addFiles(images);
  };

  return {
    attachments,
    keys: attachments.map((attachment) => attachment.key),
    isUploading: uploading > 0,
    isFull: attachments.length + uploading >= WORKFLOW_ATTACHMENT_LIMIT,
    uploading,
    addFiles,
    remove,
    reset,
    onPaste,
  };
}
