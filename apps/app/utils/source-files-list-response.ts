import type {
  SourceFilesFolder,
  SourceFilesFoldersListResult,
} from "@/types/source-files";
import type { WorkspaceListPagination } from "@/types/user";

function emptyPagination(limit = 24): WorkspaceListPagination {
  return {
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    limit,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

function normalizeFolderId(folder: SourceFilesFolder): SourceFilesFolder {
  const id = folder._id as string | { $oid?: string };
  const normalizedId =
    typeof id === "string"
      ? id
      : id && typeof id === "object" && "$oid" in id && id.$oid
        ? id.$oid
        : String(id);

  return { ...folder, _id: normalizedId };
}

export function isRootSourceFolder(folder: SourceFilesFolder): boolean {
  return (folder.parentId ?? folder.parent_id) == null;
}

export function parseSourceFilesFoldersListResponse(
  data: unknown,
  fallbackLimit = 24,
): SourceFilesFoldersListResult {
  const payload = data as {
    result?: SourceFilesFoldersListResult | SourceFilesFolder[];
  } | null;

  const result = payload?.result;

  if (result && !Array.isArray(result) && Array.isArray(result.folders)) {
    return {
      folders: result.folders.map(normalizeFolderId),
      pagination: result.pagination ?? emptyPagination(fallbackLimit),
    };
  }

  if (Array.isArray(result)) {
    const folders = result.map(normalizeFolderId);
    return {
      folders,
      pagination: {
        currentPage: 1,
        totalPages: folders.length > 0 ? 1 : 0,
        totalCount: folders.length,
        limit: Math.max(folders.length, fallbackLimit),
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  return { folders: [], pagination: emptyPagination(fallbackLimit) };
}
