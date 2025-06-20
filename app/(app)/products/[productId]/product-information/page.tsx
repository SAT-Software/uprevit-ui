import { departments } from "@/app/(app)/departments/page";
import { projects } from "@/app/(app)/projects/page";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";
import { sampleProducts } from "../../page";
import ProductInformationCard from "@/features/products/product/product-information/ProductInformationCard";
import EditProductDialog from "@/features/products/product/product-information/ProductInformationEditProductDialog";

import { PiCirclesThreePlusDuotone, PiKanbanDuotone } from "react-icons/pi";

interface PageProps {
  params: {
    productId: string;
  };
}

export default function Page({ params }: PageProps) {
  const { productId } = params;

  const productData = sampleProducts.find(
    (product) => product.productId === productId
  );

  const departmentData = departments.find(
    (department) => department.id === productData?.departmentId
  );

  const projectData = projects.find(
    (project) => project.id === productData?.projectId
  );

  // console.log(departmentData);
  // console.log(projectData);

  return (
    <div className="w-full">
      <div className="flex flex-col mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-semibold mb-4">
            {productData?.productName}
          </h1>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={
                      departmentData ? `/departments/${departmentData.id}` : "#"
                    }
                  >
                    <Button size="icon" variant="ghost">
                      <PiCirclesThreePlusDuotone className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{departmentData?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={projectData ? `/projects/${projectData.id}` : "#"}
                  >
                    <Button size="icon" variant="ghost">
                      <PiKanbanDuotone className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{projectData?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <EditProductDialog product={productData!} />
            {/* <Link href={`/products/${productId}/component-details`}>
              <Button size="sm" variant="outline" className="text-xs">
                Next Page
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </Link> */}
          </div>
        </div>
        <div className="flex  gap-4">
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />{" "}
              <span>Created On: {productData?.createdOn}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />{" "}
              <span>Created By: {productData?.createdBy}</span>
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />{" "}
              <span>Updated On: {productData?.modifiedOn}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />{" "}
              <span>Updated By: {productData?.modifiedBy}</span>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-base font-medium mb-1">Description</h2>
          <p className="text-sm text-muted-foreground">
            The Echo Beats Festival brings together a stellar lineup of artists
            across EDM, pop, and hip-hop genres. Prepare to experience a night
            of electrifying music, vibrant light shows, and unforgettable
            performances under the stars. Explore food trucks, art
            installations, and VIP lounges for an elevated experience.
          </p>
        </div>
      </div>
      <ProductInformationCard />
    </div>
  );
}

// TODO
// 1. Edit option open new modal and can edit directly
// 2. Give form to add new inputs in product info tab (can add label and then later on can add the value). This will be apart from what we are giving in Project info tab.
