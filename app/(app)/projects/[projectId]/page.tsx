import Image from "next/image";
import { CalendarClock, Text, Edit, Share2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { sampleProducts as productsData } from "@/app/(app)/products/page";
import ProjectPageProductsTable from "@/features/projects/ProjectPageProductsTable";
import { projects } from "../page";
import { Item } from "@/features/products/ProductsPageProductTable";
import { PiKanbanDuotone } from "react-icons/pi";

interface ProjectDetailPageProps {
  params: { projectId: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = projects.find((p) => p.id === params.projectId);

  // Filter products for the current project
  const projectProducts = productsData.filter(
    (product: Item) => product.projectId === params.projectId
  );

  if (!project) return notFound();

  // TODO: Add logic to fetch department name based on project.departmentId if needed
  // const departmentName = departments.find(d => d.id === project.departmentId)?.name;

  return (
    <div className="p-4">
      <div className="mx-auto bg-background overflow-hidden w-full h-full border border-input rounded-lg">
        {/* Cover Image and Action Buttons */}
        <div className="relative h-64 w-full  overflow-hidden mb-6">
          {project.image ? (
            <Image
              src={project.image}
              alt={`${project.name} cover image`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted rounded-md border border-input">
              <PiKanbanDuotone className="w-24 h-24 text-muted-foreground/60" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-1 bg-background/80 p-1 rounded">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Project</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share Project</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="h-4 w-4" />
              <span className="sr-only">Archive Project</span>
            </Button>
          </div>
        </div>

        {/* Project Details Section */}
        <div className="flex flex-col gap-4 px-4 py-4">
          {/* Project Name */}
          <h1 className="text-2xl font-bold">{project.name}</h1>

          {/* Optional: Display Department Name here if needed */}
          {/* <p className="text-sm text-gray-500">Department: {departmentName || 'N/A'}</p> */}

          {/* Description */}
          <p className="flex items-start gap-2 text-muted-foreground">
            <Text className="w-5 h-5 mt-1 flex-shrink-0" />
            <span>{project.description}</span>
          </p>

          {/* Date */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <CalendarClock className="w-4 h-4" />
            <span>{project.date}</span>
          </div>

          {/* Members */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Members:</span>
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {project.members.slice(0, 4).map((member, index) => (
                <Image
                  key={index}
                  className="w-10 h-10 border-2 border-white rounded-full dark:border-gray-800"
                  src={member.src}
                  alt={member.name}
                  width={40}
                  height={40}
                />
              ))}
              {project.membersCount > 4 && (
                <a
                  className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
                  href="#" // Link to a members page or modal
                >
                  +{project.membersCount - 4}
                </a>
              )}
            </div>
            {project.membersCount === 0 && (
              <span className="text-sm text-muted-foreground">
                No members yet.
              </span>
            )}
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
