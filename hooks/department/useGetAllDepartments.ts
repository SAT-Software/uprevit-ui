import { useQuery } from "@tanstack/react-query";

async function getAllDepartments() {
  const response = await fetch("/api/departments");
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Failed to fetch departments");
  }
  const data = await response.json();
  return data;
}

export function useGetAllDepartments() {
  return useQuery({
    queryKey: ["all-departments"],
    queryFn: getAllDepartments,
  });
}
