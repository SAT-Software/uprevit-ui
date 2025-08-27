import { useQuery } from "@tanstack/react-query";

async function getArchivedDepartments() {
  const response = await fetch("/api/departments?isArchive=true");
  const data = await response.json();
  return data;
}

export function useGetArchivedDepartments() {
  return useQuery({
    queryKey: ["archived-departments"],
    queryFn: getArchivedDepartments,
  });
}
