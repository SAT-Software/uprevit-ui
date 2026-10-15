export type SupportConfig = {
  distinctId: string;
  identityHash: string | null;
  replayEnabled: boolean;
};

export type SupportCategory = "bug" | "feature" | "other";

export type SupportImageDraft = {
  localId: string;
  file: File;
  previewUrl: string;
  attachmentId?: string;
};

export type SupportDraft = {
  name: string;
  email: string;
  category: SupportCategory;
  title: string;
  message: string;
  images: SupportImageDraft[];
};

export type SupportAttachmentView = {
  url: string;
  contentType: string;
  sizeBytes: number;
  uploadedAt?: string;
  expiresAt: string;
};
