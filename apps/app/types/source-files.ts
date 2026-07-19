import type { WorkspaceListPagination } from "./user";

export interface SourceFilesFolder {
  _id: string;
  name: string;
  type: "file" | "folder";
  workspace_id: string;
  parent_id: string | null;
  parentId?: string | null;
  product_id?: string | null;
  url?: string;
  key?: string;
  fileCount?: number;
  created_at?: string;
}

export type SourceFilesFoldersListResult = {
  folders: SourceFilesFolder[];
  pagination: WorkspaceListPagination;
};

export type SourceFilesFoldersApiResponse = {
  message?: string;
  result: SourceFilesFoldersListResult;
};
