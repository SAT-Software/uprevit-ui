export interface SourceFilesFolder {
  _id: string;
  name: string;
  type: "file" | "folder";
  workspace_id: string;
  parent_id: string | null;
  url?: string;
}
