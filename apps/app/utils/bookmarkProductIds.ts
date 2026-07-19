export type BookmarkFolderWithProducts = {
  _id: string;
  folder_name: string;
  products: string[];
};

export function buildBookmarkedProductIndex(
  folders: BookmarkFolderWithProducts[],
) {
  const bookmarkedProductIds = new Set<string>();
  const productFolderIds = new Map<string, string[]>();

  for (const folder of folders) {
    for (const productId of folder.products ?? []) {
      bookmarkedProductIds.add(productId);
      const existing = productFolderIds.get(productId) ?? [];
      productFolderIds.set(productId, [...existing, folder._id]);
    }
  }

  return { bookmarkedProductIds, productFolderIds };
}
