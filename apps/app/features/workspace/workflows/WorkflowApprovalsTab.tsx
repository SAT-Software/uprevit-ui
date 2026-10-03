"use client";

import { useState } from "react";
import {
  Blockchain03Icon,
  Cancel01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import {
  InputGroup,
  InputGroupInput,
} from "@uprevit/ui/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import { cn } from "@uprevit/ui/lib/utils";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import ProductMemberCombobox from "@/features/workspace/products/ProductMemberCombobox";
import { ProductMemberAvatar } from "@/features/workspace/products/ProductMemberAvatar";
import { useUpdateWorkflow } from "@/hooks/workflow/useWorkflows";
import type {
  WorkflowAssignment,
  WorkflowDetail,
  WorkflowProductDetail,
} from "@/types/workflow";
import { WORKFLOW_RELATIONSHIP_LABELS } from "@/utils/workflow/workflow-labels";
import { ConfirmWorkflowRemovalDialog } from "./ConfirmWorkflowRemovalDialog";
import { WorkflowDecisionBadge } from "./WorkflowDecisionBadge";

type UpdateWorkflow = ReturnType<typeof useUpdateWorkflow>;

const GROUP_GRID =
  "grid gap-x-6 gap-y-1 px-4 py-2 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto]";

type RemovalTarget = { assignment: WorkflowAssignment; groupLabel: string };

function AddApproverButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon-xs"
          aria-label="Add approver"
          {...props}
        >
          <Icon icon={UserAdd01Icon} size={14} strokeWidth={2} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Add approver</TooltipContent>
    </Tooltip>
  );
}

function AssignmentRow({
  assignment,
  groupLabel,
  canEdit,
  disabled,
  onRemove,
}: {
  assignment: WorkflowAssignment;
  groupLabel: string;
  canEdit: boolean;
  disabled: boolean;
  onRemove: (target: RemovalTarget) => void;
}) {
  const { name, email } = assignment.userSnapshot;

  return (
    <li className="flex min-h-9 items-center gap-2.5">
      <ProductMemberAvatar member={{ name }} />
      <p className="min-w-0 flex-1 truncate text-sm" title={email}>
        <span className="font-medium">{name}</span>
        {assignment.relationship ? (
          <span className="text-muted-foreground">
            {" · "}
            {WORKFLOW_RELATIONSHIP_LABELS[assignment.relationship]}
          </span>
        ) : null}
      </p>
      <WorkflowDecisionBadge decision={assignment.decision} />
      {canEdit ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              size="icon-xs"
              variant="destructive"
              aria-label={`Remove ${name} from ${groupLabel}`}
              disabled={disabled}
              onClick={() => onRemove({ assignment, groupLabel })}
            >
              <Icon icon={Cancel01Icon} size={14} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove approver</TooltipContent>
        </Tooltip>
      ) : null}
    </li>
  );
}

function AssignmentList({
  assignments,
  groupLabel,
  canEdit,
  disabled,
  onRemove,
  emptyText,
}: {
  assignments: WorkflowAssignment[];
  groupLabel: string;
  canEdit: boolean;
  disabled: boolean;
  onRemove: (target: RemovalTarget) => void;
  emptyText: string;
}) {
  return (
    <div className="flex min-w-0 flex-col">
      {assignments.length ? (
        <ul>
          {assignments.map((assignment) => (
            <AssignmentRow
              key={assignment._id}
              assignment={assignment}
              groupLabel={groupLabel}
              canEdit={canEdit}
              disabled={disabled}
              onRemove={onRemove}
            />
          ))}
        </ul>
      ) : (
        <p className="flex min-h-9 items-center text-sm text-amber-600 dark:text-amber-400">
          {emptyText}
        </p>
      )}
    </div>
  );
}

function GroupAction({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-9 items-center self-start md:-ml-3.5 md:justify-self-end">
      {children}
    </div>
  );
}

function ProductTeamPicker({
  product,
  assignedIds,
  update,
}: {
  product: WorkflowProductDetail;
  assignedIds: string[];
  update: UpdateWorkflow;
}) {
  const [open, setOpen] = useState(false);
  const candidates = product.team.filter(
    (member) => !assignedIds.includes(member._id),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <AddApproverButton disabled={update.isPending} />
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>
              {product.team.length
                ? "Everyone on this Product Team is assigned."
                : "This Product has no active owner or contributors."}
            </CommandEmpty>
            <CommandGroup>
              {candidates.map((member) => (
                <CommandItem
                  key={member._id}
                  value={member._id}
                  onSelect={() => {
                    update.mutate({
                      action: "add-assignment",
                      functionType: "product_team",
                      lineageId: product.lineageId,
                      userId: member._id,
                    });
                    setOpen(false);
                  }}
                >
                  <ProductMemberAvatar member={member} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{member.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {WORKFLOW_RELATIONSHIP_LABELS[member.relationship]}
                    </span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function SectionHeader({
  title,
  info,
  children,
}: {
  title: string;
  info: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-10 items-center justify-between gap-2 border-b border-border bg-muted/60 pl-3 pr-4">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium">{title}</p>
        <InfoTooltip content={info} />
      </div>
      {children}
    </div>
  );
}

function EmptyLine({ children }: { children: React.ReactNode }) {
  return <p className="px-4 py-3 text-sm text-muted-foreground">{children}</p>;
}

export function WorkflowApprovalsTab({
  workflow,
}: {
  workflow: WorkflowDetail;
}) {
  const update = useUpdateWorkflow(workflow._id);
  const [functionLabel, setFunctionLabel] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RemovalTarget | null>(
    null,
  );
  const { canEdit } = workflow;

  const requestRemoval = (target: RemovalTarget) => {
    setRemoveTarget(target);
    setRemoveOpen(true);
  };

  const confirmRemoval = () => {
    if (!removeTarget) return;
    update.mutate(
      {
        action: "remove-assignment",
        assignmentId: removeTarget.assignment._id,
      },
      { onSuccess: () => setRemoveOpen(false) },
    );
  };

  const productTeams = workflow.products.map((product) => ({
    product,
    assignments: workflow.assignments.filter(
      (assignment) =>
        assignment.functionType === "product_team" &&
        assignment.lineageId === product.lineageId,
    ),
  }));
  const coveredCount = productTeams.filter(
    (team) => team.assignments.length > 0,
  ).length;

  const functionGroups = [
    ...workflow.assignments
      .filter((assignment) => assignment.functionType === "function")
      .reduce((groups, assignment) => {
        const key = assignment.functionLabel.toLowerCase();
        groups.set(key, [...(groups.get(key) ?? []), assignment]);
        return groups;
      }, new Map<string, WorkflowAssignment[]>())
      .values(),
  ];

  const addFunctionApprover = (label: string, userId: string) =>
    update.mutate(
      {
        action: "add-assignment",
        functionType: "function",
        functionLabel: label,
        userId,
      },
      { onSuccess: () => setFunctionLabel("") },
    );

  return (
    <div className="flex flex-col gap-4">
      <section className="overflow-hidden rounded-2xl border border-border bg-background">
        <SectionHeader
          title="Product Team"
          info="Each Product needs at least one approver from its own Product Owner or Contributors."
        >
          {productTeams.length ? (
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                coveredCount === productTeams.length
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              {coveredCount} of {productTeams.length} Products covered
            </span>
          ) : null}
        </SectionHeader>
        {productTeams.length === 0 ? (
          <EmptyLine>Add Products first.</EmptyLine>
        ) : (
          <div className="divide-y divide-border">
            {productTeams.map(({ product, assignments }) => (
              <div key={product.lineageId} className={GROUP_GRID}>
                <div className="flex min-h-9 min-w-0 items-center gap-2.5 self-start">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Icon icon={Blockchain03Icon} size={14} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-medium"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {product.planNumber} · v{product.version}
                    </p>
                  </div>
                </div>
                <AssignmentList
                  assignments={assignments}
                  groupLabel={product.name}
                  canEdit={canEdit}
                  disabled={update.isPending}
                  onRemove={requestRemoval}
                  emptyText="No approver yet"
                />
                {canEdit ? (
                  <GroupAction>
                    <ProductTeamPicker
                      product={product}
                      assignedIds={assignments.map((item) => item.userId)}
                      update={update}
                    />
                  </GroupAction>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-background">
        <SectionHeader
          title="Functions"
          info="Approve the whole package, e.g. Quality or Regulatory. The same person can be assigned under more than one Function."
        />
        <div className="divide-y divide-border">
          {functionGroups.length === 0 && !canEdit ? (
            <EmptyLine>No Function approvers yet.</EmptyLine>
          ) : null}
          {functionGroups.map((assignments) => {
            const label = assignments[0].functionLabel;
            return (
              <div key={label} className={GROUP_GRID}>
                <p className="flex min-h-9 min-w-0 items-center self-start text-sm font-medium">
                  <span className="truncate" title={label}>
                    {label}
                  </span>
                </p>
                <AssignmentList
                  assignments={assignments}
                  groupLabel={label}
                  canEdit={canEdit}
                  disabled={update.isPending}
                  onRemove={requestRemoval}
                  emptyText="No approver yet"
                />
                {canEdit ? (
                  <GroupAction>
                    <ProductMemberCombobox
                      placeholder="Add approver"
                      excludeIds={assignments.map((item) => item.userId)}
                      onSelect={(member) =>
                        addFunctionApprover(label, member._id)
                      }
                      trigger={
                        <AddApproverButton disabled={update.isPending} />
                      }
                    />
                  </GroupAction>
                ) : null}
              </div>
            );
          })}
          {canEdit ? (
            <div className={cn(GROUP_GRID, "bg-muted/30 py-3")}>
              <InputGroup size="md" className="bg-background">
                <InputGroupInput
                  aria-label="New Function name"
                  placeholder="New Function, e.g. Quality"
                  maxLength={60}
                  value={functionLabel}
                  onChange={(event) => setFunctionLabel(event.target.value)}
                />
              </InputGroup>
              <div className="w-full max-w-64">
                <ProductMemberCombobox
                  placeholder={
                    functionLabel.trim()
                      ? "Pick the first approver…"
                      : "Name the Function first"
                  }
                  disabled={!functionLabel.trim() || update.isPending}
                  onSelect={(member) =>
                    addFunctionApprover(functionLabel.trim(), member._id)
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {canEdit ? (
        <ConfirmWorkflowRemovalDialog
          open={removeOpen}
          onOpenChange={setRemoveOpen}
          title="Remove Approver"
          message={
            <>
              Are you sure you want to remove{" "}
              <strong>{removeTarget?.assignment.userSnapshot.name}</strong> as
              an approver for <strong>{removeTarget?.groupLabel}</strong>?
            </>
          }
          onConfirm={confirmRemoval}
          isPending={update.isPending}
        />
      ) : null}
    </div>
  );
}
