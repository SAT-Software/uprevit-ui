import { notFound } from "next/navigation";
import Image from "next/image";
import {
  CalendarClock,
  Text,
  User,
  Edit,
  Share2,
  Archive,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { projects as allProjectsData } from "@/app/(app)/projects/page";
import { PiKanbanDuotone } from "react-icons/pi";
import { departments } from "../page";

interface DepartmentDetailPageProps {
  params: { departmentId: string };
}

export default function DepartmentDetailPage({
  params,
}: DepartmentDetailPageProps) {
  const department = departments.find((d) => d.id === params.departmentId);

  const departmentProjects = allProjectsData.filter(
    (project) => project.departmentId === params.departmentId
  );

  if (!department) return notFound();

  return (
    <div className="p-4">
      <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg">
        <div className="relative h-64 w-full rounded-t-lg overflow-hidden mb-6">
          {department.image ? (
            <Image
              src={department.image}
              alt={`${department.name} cover image`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted rounded-t-md border border-input">
              <PiKanbanDuotone className="w-24 h-24 text-muted-foreground/60" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1 bg-background/80 p-1 rounded">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive</span>
            </Button>
          </div>
        </div>

        {/* Department Name */}
        <div className="flex flex-col gap-4 px-4 py-4">
          <h1 className="text-2xl font-bold">{department.name}</h1>

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
            {department.description}
          </p>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <CalendarClock className="w-4 h-4" />
            {department.date}
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {department.members.slice(0, 4).map((member, index) => (
                <Image
                  key={index}
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={member.src}
                  alt={member.name}
                  width={40}
                  height={40}
                />
              ))}
              {department.membersCount > 4 && (
                <a
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +{department.membersCount - 4}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="my-4 px-4 flex flex-col gap-4">
          {departmentProjects && departmentProjects.length > 0 ? (
            departmentProjects.map((project) => (
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
                        {project.date?.split(" - ")[0] || "N/A"}
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
                      {project.members?.slice(0, 3).map((member, index) => (
                        <Image
                          key={index}
                          className="w-5 h-5 border border-white rounded-full dark:border-gray-800"
                          src={member.src}
                          alt={member.name}
                          width={20}
                          height={20}
                          title={member.name}
                        />
                      ))}
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
