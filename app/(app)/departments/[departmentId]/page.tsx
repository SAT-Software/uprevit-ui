"use client";

import { Button } from "@/components/ui/button";
import DialogArchiveEntity from "@/features/archive/DialogArchiveEntity";
import MutateDepartmentDialog from "@/features/departments/MutateDepartmentDialog";
import { useGetDepartmentById } from "@/hooks/department/useGetDepartmentById";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import DepartmentPageProductsTable from "@/features/departments/DepartmentPageProductsTable";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import {
  PiArchiveDuotone,
  PiCalendarDuotone,
  PiKanbanDuotone,
  PiPencilCircleDuotone,
  PiShareNetworkDuotone,
  PiTextAlignJustifyDuotone,
  PiUserDuotone,
} from "react-icons/pi";

export default function DepartmentDetailPage() {
  const params = useParams<{ departmentId: string }>();
  const departmentId = params?.departmentId;

  const { data, isLoading, isError } = useGetDepartmentById(departmentId ?? "");

  const department = data?.department;

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6">
          Loading department...
        </div>
      </div>
    );
  }

  if (isError || !department) return notFound();

  return (
    <div className="p-4">
      <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg">
        <div className="relative h-64 w-full rounded-t-lg overflow-hidden mb-6">
          {department?.image ? (
            <Image
              src={department.image}
              alt={`${department.department_name} cover image`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted rounded-t-md">
              <PiKanbanDuotone className="w-24 h-24 text-muted-foreground/60" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1 bg-background/80 p-1 rounded">
            <MutateDepartmentDialog
              mode="update"
              department={department}
              trigger={
                <Button variant="ghost" size="sm">
                  <PiPencilCircleDuotone className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              }
            />
            <Button variant="ghost" size="sm">
              <PiShareNetworkDuotone className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>

            <DialogArchiveEntity
              id={departmentId ?? ""}
              entityName={department.department_name}
              entityType="department"
              trigger={
                <Button variant="ghost" size="sm">
                  <PiArchiveDuotone className="h-4 w-4" />
                  <span className="sr-only">Archive</span>
                </Button>
              }
            />
          </div>
        </div>

        {/* Department Name */}
        <div className="flex flex-col gap-4 px-4 py-4">
          <h1 className="text-2xl font-bold">{department.department_name}</h1>

          {/* Manager Name */}
          <div className="flex items-center space-x-2">
            <PiUserDuotone className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">
              Manager: <span className="font-medium">{department.manager}</span>
            </p>
          </div>

          {/* Description */}
          <p className="flex items-center gap-2 text-muted-foreground">
            <PiTextAlignJustifyDuotone className="w-5 h-5" />
            {department.department_description}
          </p>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <PiCalendarDuotone className="w-5 h-5" />
            {department.date}
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2">
            {(() => {
              const membersForDialog = (department.users || []).map(
                (u: string, i: number) => ({
                  id: String(u ?? i),
                  name: `User ${i + 1}`,
                  email: `user${i + 1}@example.com`,
                  role: "Member",
                  avatarUrl: u,
                })
              );
              return (
                <MembersInlineTrigger
                  members={membersForDialog}
                  titlePrefix={department.department_name}
                />
              );
            })()}
          </div>
        </div>

        {/* Associated Products Section */}
        <div className="px-4 pb-4 mt-6">
          <h2 className="text-xl font-semibold mt-6">Products</h2>
          <DepartmentPageProductsTable data={department?.projects || []} />
        </div>
      </div>
    </div>
  );
}
