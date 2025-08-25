"use client";

import CreateDepartmentDialog from "@/features/departments/CreateDepartmentDialog";
import Departments from "@/features/departments/DepartmentsCard";
import { departments } from "./data";

function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Departments</p>

          <CreateDepartmentDialog />
        </div>
        <Departments departments={departments} />
      </div>
    </div>
  );
}

export default DepartmentsPage;
