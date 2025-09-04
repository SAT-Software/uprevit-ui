import { useQuery } from "@tanstack/react-query";

async function getAllDepartments() {
  const response = await fetch("/api/departments");
  const data = await response.json();
  return data;
}

export function useGetAllDepartments() {
  return useQuery({
    queryKey: ["all-departments"],
    queryFn: getAllDepartments,
  });
}
