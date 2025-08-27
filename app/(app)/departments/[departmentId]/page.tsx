"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  CalendarClock,
  Text,
  User,
  Share2,
  Archive,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MutateDepartmentDialog from "@/features/departments/MutateDepartmentDialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { PiKanbanDuotone } from "react-icons/pi";
import { useGetDepartmentById } from "@/hooks/department/useGetDepartmentById";
import DialogArchiveEntity from "@/features/archive/DialogArchiveEntity";

export default function DepartmentDetailPage() {
  const params = useParams<{ departmentId: string }>();
  const departmentId = params?.departmentId;

  const { data, isLoading, isError } = useGetDepartmentById(departmentId ?? "");

  const department = data?.result;

  console.log(department);

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6">
          Loading department...
        </div>
      </div>
    );
  }

  const departmentProjects = department?.projects ?? [];

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
            <MutateDepartmentDialog mode="update" department={department} />
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>

            <DialogArchiveEntity
              id={departmentId ?? ""}
              entityName={department.department_name}
              entityType="department"
              trigger={
                <Button variant="ghost" size="sm">
                  <Archive className="h-4 w-4" />
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
            <User className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">
              Manager: <span className="font-medium">{department.manager}</span>
            </p>
          </div>

          {/* Description */}
          <p className="flex items-center gap-2 text-muted-foreground">
            <Text className="w-5 h-5" />
            {department.department_description}
          </p>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <CalendarClock className="w-4 h-4" />
            {department.date}
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {department.users
                ?.slice(0, 4)
                .map((member: string, index: number) => (
                  <Avatar
                    key={index}
                    className="h-6 w-6 ring-2 ring-white dark:ring-gray-800"
                  >
                    <AvatarImage src={member} alt={member} />
                    <AvatarFallback className="text-xs font-medium">
                      {member?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              {department.membersCount && department.membersCount > 4 && (
                <a
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +{department.membersCount - 4 || 0}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="my-4 px-4 flex flex-col gap-4">
          {departmentProjects && departmentProjects.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            departmentProjects.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex flex-row items-start w-full border border-input rounded-xl bg-card p-3 gap-4 hover:bg-accent/50 transition-colors duration-150"
              >
                {/* Image */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-input">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
                      <PiKanbanDuotone className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col justify-between h-full flex-1 min-w-0 gap-1">
                  {/* Top Row: Name & Date */}
                  <div className="flex justify-between items-center gap-2">
                    <h3
                      className="font-semibold text-base text-foreground truncate"
                      title={project.name}
                    >
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <CalendarClock className="w-3 h-3" />
                      <span className="whitespace-nowrap">
                        {new Date(project.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs text-muted-foreground line-clamp-2"
                    title={project.description}
                  >
                    {project.description}
                  </p>

                  {/* Bottom Row: Members */}
                  <div className="flex items-center justify-start gap-2 mt-1">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <div className="flex -space-x-2 rtl:space-x-reverse flex-shrink-0">
                      {project.members
                        ?.slice(0, 3)
                        .map(
                          (
                            member: { src: string; name: string },
                            index: number
                          ) => (
                            <Avatar
                              key={index}
                              className="h-5 w-5 ring ring-white dark:ring-gray-800"
                            >
                              <AvatarImage src={member.src} alt={member.name} />
                              <AvatarFallback className="text-[10px] font-medium">
                                {member.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )
                        )}
                      {(project.membersCount || 0) > 3 && (
                        <div
                          className="flex items-center justify-center w-5 h-5 text-[10px] font-medium text-white bg-gray-700 border border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                          title={`${project.membersCount} members total`}
                        >
                          +{(project.membersCount || 0) - 3}
                        </div>
                      )}
                      {(project.membersCount || 0) === 0 && (
                        <span className="text-xs text-muted-foreground">
                          No members
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-10">
              No projects found for this department.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
