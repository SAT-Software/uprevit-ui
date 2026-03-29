import { PiLinkDuotone, PiCopyDuotone, PiCheckDuotone } from "react-icons/pi";
import { PiShareNetworkDuotone, PiXCircleDuotone } from "react-icons/pi";
import { useState, useMemo } from "react";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ShareDepartmentDialog({
  department,
}: {
  department?: { _id: string; department_name?: string };
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const departmentLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "/departments/sample-id";
    }
    return department?._id
      ? `${window.location.origin}/departments/${department._id}`
      : "/departments/sample-id";
  }, [department?._id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(departmentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PiShareNetworkDuotone className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <p>Share Department</p>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Share this department with others by copying the link below.
        </DialogDescription>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department-link">Department Link</Label>
            <div className="flex items-center space-x-2">
              <InputGroup>
                <InputGroupInput
                  id="department-link"
                  value={departmentLink}
                  readOnly
                  className="pl-10"
                />
                <InputGroupAddon>
                  <PiLinkDuotone size={16} />
                </InputGroupAddon>
              </InputGroup>
              <Button size="sm" onClick={handleCopyLink} className="shrink-0">
                {copied ? (
                  <>
                    <PiCheckDuotone size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <PiCopyDuotone size={16} className="mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {department?.department_name && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium text-sm">
                {department.department_name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Department ID: {department._id}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button variant="secondary" size="sm">
              <PiXCircleDuotone />
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
