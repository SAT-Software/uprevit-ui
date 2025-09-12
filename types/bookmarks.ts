export interface BookmarkFolder {
  _id: string;
  user_id: string;
  workspace_id: string;
  bookmarked_sourceFile_folders: string[];
  bookmarked_product_folders: {
    _id: string;
    folder_name: string;
    products: string[];
  }[];
}
