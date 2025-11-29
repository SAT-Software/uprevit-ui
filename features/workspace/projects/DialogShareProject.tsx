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

export default function DialogShareProject({
  project,
}: {
  project?: { _id: string; project_name?: string };
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const projectLink = useMemo(() => {
    if (typeof window === "undefined") {
      return "/projects/sample-id";
    }
    return project?._id
      ? `${window.location.origin}/projects/${project._id}`
      : "/projects/sample-id";
  }, [project?._id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectLink);
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
            <Button variant="ghost" size="sm">
              <PiShareNetworkDuotone className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share Project</p>
          </TooltipContent>
        </Tooltip>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <PiShareNetworkDuotone size={20} />
            Share Project
          </AlertDialogTitle>
          <AlertDialogDescription>
            Share this project with others by copying the link below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-link">Project Link</Label>
            <div className="flex items-center space-x-2">
              <InputGroup>
                <InputGroupInput
                  id="project-link"
                  value={projectLink}
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

          {project?.project_name && (
            <div className="rounded-lg border p-3 bg-muted/50">
              <h4 className="font-medium text-sm">{project.project_name}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Project ID: {project._id}
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
