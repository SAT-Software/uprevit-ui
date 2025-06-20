"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyIcon } from "lucide-react";
import { useId, useState } from "react";

// Import actual data from the pages
import { departments } from "@/app/(app)/departments/page";
import { projects } from "@/app/(app)/projects/page";
import { Item } from "./ProductsPageProductTable";

export interface UpdateProductDialogProps {
  product: Item;
}

export default function DialogDuplicateProduct({
  product,
}: UpdateProductDialogProps) {
  const id = useId();
  const [productId, setProductId] = useState(product.productId);
  const [productName, setProductName] = useState(product.productName);
  const [description, setDescription] = useState(product.description);
  const [departmentId, setDepartmentId] = useState(product.departmentId);
  const [projectId, setProjectId] = useState(product.projectId);
  const [version, setVersion] = useState(product.version);
  const [status, setStatus] = useState(product.status);

  // Find the department and project names based on IDs
  const department = departments.find((dept) => dept.id === departmentId);
  const project = projects.find((proj) => proj.id === projectId);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="focus:bg-accent hover:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          key={product.productId}
        >
          <CopyIcon className=" h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Update Product
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Update product details.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-ppn`}>Product Plan Number (PPN)</Label>
                <Input
                  id={`${id}-ppn`}
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-product-name`}>Product Name</Label>
                <Input
                  id={`${id}-product-name`}
                  placeholder="Enter product name"
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Enter product description"
                  className="min-h-[100px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-department`}>Department</Label>
                  <Input
                    id={`${id}-department`}
                    value={department?.name || departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-project`}>Project</Label>
                  <Input
                    id={`${id}-project`}
                    value={project?.name || projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    type="text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-version`}>Version</Label>
                  <Input
                    id={`${id}-version`}
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${id}-status`}>Status</Label>
                  <Input
                    id={`${id}-status`}
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "Submitted" | "Draft" | "Archived"
                      )
                    }
                    type="text"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Update Product</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
