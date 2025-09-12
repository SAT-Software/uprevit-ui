import { useQuery } from "@tanstack/react-query";

async function getAllProducts({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/products", { signal });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch products");
  }
  const data = await response.json();

  return data;
}

export function useGetAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: ({ signal }) => getAllProducts({ signal }),
  });
}
