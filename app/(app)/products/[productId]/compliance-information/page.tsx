"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2Icon, EllipsisIcon } from "lucide-react";
import AddStandardDialog from "@/features/products/product/compliance-information/AddStandardDialog";
import { useParams } from "next/navigation";
import { useGetProductTabData } from "@/hooks/product/useGetProductTabData";

interface ComplianceItem {
  _id: string;
  standard: string;
  standard_description: string;
}

function RowActions({ id }: { id: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2" asChild>
        <div className="flex justify-end ">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit - {id}</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archive</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Move to project</DropdownMenuItem>
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Advanced options</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Share</DropdownMenuItem>
          <DropdownMenuItem>Add to favorites</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Page() {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductTabData(
    productId as string,
    "compliance-information"
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        Loading compliance standards...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-3 p-4 text-destructive">
        Error loading compliance standards: {error.message}
      </div>
    );
  }

  const standards = (data?.data?.data as ComplianceItem[]) || [];

  console.log("standards", standards);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 justify-end">
        <AddStandardDialog />
        {/* <Link href={`/products/${productId}/product-data`}>
          <Button size="sm" variant="outline" className="text-xs">
            Next Page
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </Link> */}
      </div>
      {standards.map((item) => (
        <div
          key={item._id}
          className="flex items-center bg-card border rounded-md px-4 py-2 min-h-[64px] w-full"
        >
          <CheckCircle2Icon
            className="text-green-500 mr-4 shrink-0"
            size={16}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium text-base truncate">
              {item.standard}
            </span>
            <span className="text-muted-foreground text-xs truncate">
              {item.standard_description}
            </span>
          </div>
          <div className="ml-4 flex-shrink-0">
            <RowActions id={item._id} />
          </div>
        </div>
      ))}
    </div>
  );
}
