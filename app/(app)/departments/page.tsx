"use client";

import DepartmentsCard from "@/features/departments/DepartmentsCard";
import DialogAddDepartment from "@/features/departments/DialogAddDepartment";

function DepartmentsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <h1 className="text-base font-semibold">All Departments</h1>
          <DialogAddDepartment />
        </div>
        <DepartmentsCard />
      </div>
    </div>
  );
}

export default DepartmentsPage;
