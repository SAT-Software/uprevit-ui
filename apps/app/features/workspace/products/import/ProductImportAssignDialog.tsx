"use client";

import { useEffect, useMemo, useState, type UIEvent } from "react";
import { Cancel01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Dialog } from "@uprevit/ui/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { useGetProjectsInfinite } from "@/hooks/project/useGetProjectsInfinite";
import type { Project } from "@/types/project";
import type { ImportProjectChoice } from "@/types/product-import";

interface ProductImportAssignDialogProps {
  open: boolean;
  count: number;
  onOpenChange: (open: boolean) => void;
  onAssign: (project: ImportProjectChoice) => void;
  onCloseAutoFocus: (event: Event) => void;
}

export function ProductImportAssignDialog({ open, count, onOpenChange, onAssign, onCloseAutoFocus }: ProductImportAssignDialogProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<ImportProjectChoice | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setSearch("");
      setSelected(null);
    }
    onOpenChange(next);
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isPending, isError } =
    useGetProjectsInfinite({ enabled: open, search: debouncedSearch });
  const projects = useMemo(
    () => data?.pages.flatMap((page) => (page.result?.projects ?? []) as Project[]) ?? [],
    [data],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 40 && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent
        title="Assign a project"
        description={`The ${count === 1 ? "selected product goes" : `${count} selected products go`} into this project and its department.`}
        size="md"
        onCloseAutoFocus={onCloseAutoFocus}
        primaryAction={{
          label: "Assign project",
          icon: CheckmarkCircle02Icon,
          disabled: !selected,
          onClick: () => {
            if (!selected) return;
            onAssign(selected);
            handleOpenChange(false);
          },
        }}
        secondaryAction={{ label: "Cancel", icon: Cancel01Icon }}
      >
        <div className="p-4">
          <Command shouldFilter={false} className="rounded-lg border border-border">
            <CommandInput placeholder="Search projects…" value={search} onValueChange={setSearch} aria-label="Search projects" />
            <CommandList onScroll={handleScroll} className="max-h-72">
              <CommandEmpty>
                {isPending ? "Loading projects…" : isError ? "Projects couldn't be loaded. Close this dialog and try again." : "No project matches your search."}
              </CommandEmpty>
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project._id}
                    value={project._id}
                    onSelect={() => setSelected({ _id: project._id!, project_name: project.project_name, project_number: project.project_number })}
                    className="justify-between"
                  >
                    <span className="min-w-0 truncate" title={project.project_name}>{project.project_name}</span>
                    <span className="flex shrink-0 items-center gap-2 text-muted-foreground text-xs tabular-nums">
                      {project.project_number}
                      {selected?._id === project._id && (
                        <>
                          <Icon icon={CheckmarkCircle02Icon} className="text-primary" />
                          <span className="sr-only">Selected</span>
                        </>
                      )}
                    </span>
                  </CommandItem>
                ))}
                {isFetchingNextPage && (
                  <div className="flex justify-center py-2">
                    <Spinner className="size-4" />
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
