import { useQuery } from "@tanstack/react-query";

export function useGetAllSourceFileFolders() {
  return useQuery({
    queryKey: ["source-files-folders"],
    queryFn: async ({ signal }) => {
      const res = await fetch(
        "/api/sourceFiles/folders?workspaceId=68a1ce212cb63e45ad511684",
        { signal }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to fetch source files folders");
      }
      return res.json();
    },
  });
}
