import { useMutation } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";

interface S3SignedUrlRequest {
  file: File;
  contentType: string;
}

export function useUploadFilesToS3() {
  const auth = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      contentType = "application/octet-stream",
    }: S3SignedUrlRequest) => {
      const accessToken = auth.user?.access_token;
      if (!accessToken) {
        throw new Error("User is not authenticated");
      }

      const res = await fetch(`/api/s3-storage/presign-upload`, {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, contentType }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to get signed URL");
      }

      const { uploadUrl, key } = await res.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      if (!putRes.ok) {
        throw new Error("Failed to upload file to S3");
      }

      return {
        key,
        originalName: file.name,
        contentType,
        size: file.size,
      };
    },
    onSuccess: () => {
      toast.success("File uploaded successfully");
    },
    onError: (error) => {
      console.error(error.message || "Failed to upload file to S3");
      toast.error("Failed to upload file to S3");
    },
  });
}
