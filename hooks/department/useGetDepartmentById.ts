import { useQuery } from "@tanstack/react-query";

async function getDepartmentById(id: string) {
  const response = await fetch(`/api/departments/${id}`);
  const data = await response.json();
  return data;
}

export function useGetDepartmentById(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartmentById(id),
  });
}
