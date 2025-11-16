"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notFound, useParams } from "next/navigation";
import DialogArchiveEntity from "@/features/archive/DialogArchiveEntity";
import {
  PiKanbanDuotone,
  PiPencilCircleDuotone,
  PiShareNetworkDuotone,
  PiArchiveDuotone,
  PiUserDuotone,
  PiTextAlignJustifyDuotone,
  PiCalendarDuotone,
} from "react-icons/pi";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import MutateProjectDialog from "@/features/projects/MutateProjectDialog";
import { MembersInlineTrigger } from "@/components/common/MembersDialog";
import ProjectPageProductsTable from "@/features/projects/ProjectPageProductsTable";
import { Item } from "@/features/products/ProductsPageProductTable";

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId;

  const { data, isLoading, isError } = useGetProjectById(projectId);
  const { data: productsData } = useGetAllProducts();

  const project = data?.project;

  // Transform products data to match ProjectPageProductsTable format
  const projectProducts = (productsData?.result?.products || []).filter(
    (product: Item) => product.project_id === projectId
  );

  if (isLoading || !project) {
    return (
      <div className="p-4">
        <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg p-6">
          Loading project...
        </div>
      </div>
    );
  }

  if (isError) return notFound();

  return (
    <div className="p-4">
      <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg">
        {/* Cover Image and Action Buttons */}
        <div className="relative h-64 w-full  overflow-hidden mb-6">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.project_name} cover image`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
              <PiKanbanDuotone className="w-24 h-24 text-muted-foreground/60" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1 bg-background/80 p-1 rounded">
            <MutateProjectDialog
              mode="update"
              project={project}
              trigger={
                <Button variant="ghost" size="sm">
                  <PiPencilCircleDuotone className="h-4 w-4" />
                  <span className="sr-only">Edit Project</span>
                </Button>
              }
            />
            <Button variant="ghost" size="sm">
              <PiShareNetworkDuotone className="h-4 w-4" />
              <span className="sr-only">Share Project</span>
            </Button>
            <DialogArchiveEntity
              id={projectId}
              entityName={project.project_name}
              entityType="project"
              trigger={
                <Button variant="ghost" size="sm">
                  <PiArchiveDuotone className="h-4 w-4" />
                  <span className="sr-only">Archive Project</span>
                </Button>
              }
            />{" "}
          </div>
        </div>

        {/* Project Details Section */}
        <div className="flex flex-col gap-4 px-4 py-4">
          {/* Project Name */}
          <h1 className="text-2xl font-bold">{project.project_name}</h1>

          {/* Manager Name */}
          <div className="flex items-center space-x-2">
            <PiUserDuotone className="h-5 w-5 text-gray-500" />
            <p className="text-sm text-gray-600">
              Manager:{" "}
              <span className="font-medium">{project.project_manager}</span>
            </p>
          </div>

          {/* Description */}
          <p className="flex items-center gap-2 text-muted-foreground">
            <PiTextAlignJustifyDuotone className="w-5 h-5" />
            {project.project_description}
          </p>

          {/* Date */}
          <div className="flex items-center space-x-2">
            <PiCalendarDuotone className="w-5 h-5" />
            <span>
              {" "}
              {project.actionAt
                ? new Date(project.actionAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2">
            {(() => {
              const usersForDialog = (project?.users || []).map(
                (u: string, i: number) => ({
                  _id: String(u ?? i),
                  name: `User ${i + 1}`,
                  email: `user${i + 1}@example.com`,
                  profileAvatar: u,
                })
              );
              return (
                <MembersInlineTrigger
                  users={usersForDialog}
                  titlePrefix={project.project_name}
                />
              );
            })()}
          </div>
        </div>

        {/* Associated Products Section */}
        <div className="px-4 pb-4 mt-6">
          <h2 className="text-xl font-semibold mt-6">Products</h2>
          <ProjectPageProductsTable data={projectProducts} />
        </div>
      </div>
    </div>
  );
}
