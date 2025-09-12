export interface SourceFileItem {
  _id: string;
  file_name: string;
  url: string;
}

export interface SourceFilesFolder {
  _id: string;
  folder_name: string;
  product_id: string;
  workspace_id: string;
  folder: SourceFileItem[];
}

export interface SourceFilesFolderResponse {
  data?: SourceFilesFolder;
  folder?: SourceFilesFolder;
}
