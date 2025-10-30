"use client";

import MutateDepartmentDialog from "@/features/departments/MutateDepartmentDialog";
import DepartmentsCard from "@/features/departments/DepartmentsCard";
import { useGetAllDepartments } from "@/hooks/department/useGetAllDepartments";

function DepartmentsPage() {
  const { data, isLoading, error } = useGetAllDepartments();

  const allDepartments = data?.result?.departments ?? [];

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          Failed to load departments. Please try again.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Departments</p>

          <MutateDepartmentDialog mode="create" />
        </div>
        <DepartmentsCard departments={allDepartments} />
      </div>
    </div>
  );
}

export default DepartmentsPage;
