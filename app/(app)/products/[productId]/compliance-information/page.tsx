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

const complianceStandards = [
  {
    id: "iso9001",
    name: "ISO 9001",
    description: "Quality management systems standard for organizations.",
  },
  {
    id: "iso14001",
    name: "ISO 14001",
    description: "Environmental management systems standard.",
  },
  {
    id: "iso45001",
    name: "ISO 45001",
    description: "Occupational health and safety management systems standard.",
  },
  {
    id: "iso13485",
    name: "ISO 13485",
    description: "Quality management systems standard for medical devices.",
  },
  {
    id: "iec60601",
    name: "IEC 60601",
    description:
      "International standard for safety and performance of medical electrical equipment.",
  },
  {
    id: "mdr2017745",
    name: "MDR (EU 2017/745)",
    description:
      "European Union Medical Device Regulation for placing devices on the EU market.",
  },
  {
    id: "fda21cfr820",
    name: "FDA 21 CFR Part 820",
    description:
      "US FDA Quality System Regulation for medical device manufacturers.",
  },
];

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
      {complianceStandards.map((item) => (
        <div
          key={item.id}
          className="flex items-center bg-card border rounded-md px-4 py-2 min-h-[64px] w-full"
        >
          <CheckCircle2Icon
            className="text-green-500 mr-4 shrink-0"
            size={16}
          />
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium text-base truncate">{item.name}</span>
            <span className="text-muted-foreground text-xs truncate">
              {item.description}
            </span>
          </div>
          <div className="ml-4 flex-shrink-0">
            <RowActions id={item.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
