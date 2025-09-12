import { useQuery } from "@tanstack/react-query";

async function getArchivedProducts({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/products?status=archive", { signal });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch archived products");
  }
  const data = await response.json();

  console.log("archived products", data);
  return data;
}

export function useGetArchivedProducts() {
  return useQuery({
    queryKey: ["archived-products"],
    queryFn: ({ signal }) => getArchivedProducts({ signal }),
  });
}
