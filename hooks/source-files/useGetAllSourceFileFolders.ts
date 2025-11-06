import { useQuery } from "@tanstack/react-query";

export function useGetAllSourceFileFolders() {
  return useQuery({
    queryKey: ["source-files-folders"],
    queryFn: async ({ signal }) => {
      const res = await fetch(
        "/api/source-files?workspaceId=68d2be511ad93c69d6e39e51",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
            "Content-Type": "application/json", // Example of another header
          },
          signal,
        }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to fetch source files folders");
      }
      return res.json();
    },
  });
}
