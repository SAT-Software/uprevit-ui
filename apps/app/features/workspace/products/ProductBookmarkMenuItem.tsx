"use client";

import { useBookmarkedProductIds } from "@/hooks/product/useBookmarkedProductIds";
import {
  BookmarkAdd01Icon,
  BookmarkMinus01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { DropdownMenuItem } from "@uprevit/ui/components/ui/dropdown-menu";

interface ProductBookmarkMenuItemProps {
  productId: string;
  onAddBookmark: () => void;
  onRemoveBookmark: (folderId: string) => void;
}

export function ProductBookmarkMenuItem({
  productId,
  onAddBookmark,
  onRemoveBookmark,
}: ProductBookmarkMenuItemProps) {
  const { bookmarkedProductIds, productFolderIds } = useBookmarkedProductIds();
  const isBookmarked = bookmarkedProductIds.has(productId);
  const folderIds = productFolderIds.get(productId) ?? [];

  if (isBookmarked) {
    return (
      <DropdownMenuItem
        onClick={(e) => e.stopPropagation()}
        onSelect={() => {
          const folderId = folderIds[0];
          if (!folderId) return;
          setTimeout(() => onRemoveBookmark(folderId), 100);
        }}
        className="group"
      >
        <Icon
          icon={BookmarkMinus01Icon}
          className="text-destructive/60 group-hover:text-destructive"
        />
        <span>Remove Bookmark</span>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      onClick={(e) => e.stopPropagation()}
      onSelect={() => {
        setTimeout(onAddBookmark, 100);
      }}
    >
      <Icon icon={BookmarkAdd01Icon} />
      <span>Add to Bookmarks</span>
    </DropdownMenuItem>
  );
}
