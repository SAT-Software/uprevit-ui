import { useQuery } from "@tanstack/react-query";

async function getArchivedProducts({ signal }: { signal: AbortSignal }) {
  const response = await fetch("/api/products?status=archive", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`, // Add your authorization header here
      "Content-Type": "application/json", // Example of another header
    },
    signal,
  });
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
