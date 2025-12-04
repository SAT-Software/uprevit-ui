import { LinkIcon, CopyIcon, CheckIcon } from "lucide-react";
import { PiShareNetworkDuotone } from "react-icons/pi";
import { useState, useMemo } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export default function DialogShareDepartment({
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
    <AlertDialog>
      <AlertDialogTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm">
              <PiShareNetworkDuotone className="h-4 w-4" />
              Share
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share Department</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <PiShareNetworkDuotone size={20} />
            Share Department
          </AlertDialogTitle>
          <AlertDialogDescription>
            Share this department with others by copying the link below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
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
                  <LinkIcon size={16} />
                </InputGroupAddon>
              </InputGroup>
              <Button size="sm" onClick={handleCopyLink} className="shrink-0">
                {copied ? (
                  <>
                    <CheckIcon size={16} className="mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <CopyIcon size={16} className="mr-1" />
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

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
