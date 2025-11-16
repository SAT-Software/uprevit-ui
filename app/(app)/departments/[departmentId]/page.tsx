"use client";

import { Button } from "@/components/ui/button";
import DialogArchiveEntity from "@/features/archive/DialogArchiveEntity";
import { useGetDepartmentById } from "@/hooks/department/useGetDepartmentById";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import {
  PiArchiveDuotone,
  PiCalendarDuotone,
  PiKanbanDuotone,
  PiShareNetworkDuotone,
  PiTextAlignJustifyDuotone,
  PiUserDuotone,
} from "react-icons/pi";
import DepartmentPageProjectsTable from "@/features/departments/DepartmentPageProjectsTable";
import DialogShareDepartment from "@/features/departments/DialogShareDepartment";
import { useGetAllProjects } from "@/hooks/project/useGetAllProjects";
import { Project } from "@/types/project";
import { AuditLog } from "@/types/audit-log";
import DialogUpdateDepartment from "@/features/departments/DialogUpdateDepartment";

interface DepartmentUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

interface DepartmentUser {
  _id: string;
  name: string;
  email: string;
  profileAvatar?: string;
}

export default function DepartmentDetailPage() {
  const params = useParams<{ departmentId: string }>();
  const departmentId = params?.departmentId;

  const { data, isLoading, isError } = useGetDepartmentById(departmentId);
  const { data: projectsData } = useGetAllProjects();

  const department = data?.department;
  const projects =
    projectsData?.result?.projects?.filter(
      (p: Project) => p.department_id === departmentId
    ) || [];

  console.log("Department by Id:", data);
  console.log("Projects for department:", projectsData);

  if (isLoading || !department) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6">
          Loading department...
        </div>
      </div>
    );
  }

  if (isError) return notFound();

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
            <DialogUpdateDepartment department={department} />
            <DialogShareDepartment department={department}>
              <Button variant="ghost" size="sm">
                <PiShareNetworkDuotone className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </DialogShareDepartment>

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

          {department?.auditLogs &&
            department?.auditLogs.map((log: AuditLog) => (
              <div
                key={log._id}
                className="flex items-center space-x-2 text-sm"
              >
                <PiCalendarDuotone className="w-5 h-5" />
                <p className="text-sm text-gray-600">
                  {log.actionAt.slice(0, 10)}
                </p>
                <div className="w-0.5 h-6 bg-border" />
                <p>{log.actionBy}</p>
              </div>
            ))}

          {/* Users */}
          <div className="flex items-center space-x-2">
            {(() => {
              const usersForDialog = (
                (department.users as DepartmentUser[]) || []
              ).map((u: DepartmentUser) => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                profileAvatar: u.profileAvatar,
              }));
              return (
                <MembersInlineTrigger
                  users={usersForDialog}
                  titlePrefix={department.department_name}
                />
              );
            })()}
          </div>
        </div>

        <div className="px-4 pb-4 mt-6">
          <h2 className="text-xl font-semibold mt-6">Projects</h2>
          <DepartmentPageProjectsTable data={projects} />
        </div>
      </div>
    </div>
  );
}
