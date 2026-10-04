"use client";

import { useState } from "react";
import { useAuth } from "react-oidc-context";
import {
  Blockchain03Icon,
  Cancel01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  MessageEdit01Icon,
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
  WorkflowAssignmentDetail,
  WorkflowDetail,
  WorkflowProductDetail,
} from "@/types/workflow";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { WORKFLOW_RELATIONSHIP_LABELS } from "@/utils/workflow/workflow-labels";
import { ApproveAssignmentDialog } from "./ApproveAssignmentDialog";
import { ConfirmWorkflowRemovalDialog } from "./ConfirmWorkflowRemovalDialog";
import { RejectWorkflowDialog } from "./RejectWorkflowDialog";
import { RequestChangesDialog } from "./RequestChangesDialog";
import { WorkflowDecisionBadge } from "./WorkflowDecisionBadge";

type UpdateWorkflow = ReturnType<typeof useUpdateWorkflow>;

const GROUP_GRID =
  "grid gap-x-6 gap-y-1 px-4 py-2 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto]";

type RemovalTarget = {
  assignment: WorkflowAssignmentDetail;
  groupLabel: string;
};
type DecisionTarget = RemovalTarget & {
  decision: "approve" | "reject" | "request_changes";
};

type RowContext = {
  canEdit: boolean;
  disabled: boolean;
  isInReview: boolean;
  isActive: boolean;
  isEnded: boolean;
  currentUserId?: string;
  onRemove: (target: RemovalTarget) => void;
  onDecide: (target: DecisionTarget) => void;
};

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

const plural = (count: number, noun: string) =>
  `${count} ${count === 1 ? noun : `${noun}s`}`;

function ChangeRequestStatus({
  assignment,
  isMine,
  isActive,
}: {
  assignment: WorkflowAssignmentDetail;
  isMine: boolean;
  isActive: boolean;
}) {
  if (assignment.decision !== "changes_requested") return null;
  const open = assignment.openChangeRequestCount ?? 0;
  if (!isActive && !open) return null;

  return (
    <p className="text-xs text-orange-600 dark:text-orange-400">
      {open
        ? `${plural(open, "open change request")}${isMine && isActive ? ", waiting to be addressed" : ""}`
        : `Addressed, waiting for ${isMine ? "your" : "their"} decision`}
    </p>
  );
}

function AssignmentRow({
  assignment,
  groupLabel,
  context,
}: {
  assignment: WorkflowAssignmentDetail;
  groupLabel: string;
  context: RowContext;
}) {
  const { name, email } = assignment.userSnapshot;
  const {
    canEdit,
    disabled,
    isInReview,
    isActive,
    isEnded,
    currentUserId,
    onRemove,
    onDecide,
  } = context;
  const isMine = assignment.userId === currentUserId;
  const isUndecided =
    assignment.decision === "pending" ||
    assignment.decision === "changes_requested";
  const canDecide = isInReview && isMine && isUndecided;
  const canApprove = canDecide && !assignment.openChangeRequestCount;
  const canRequestChanges =
    isActive && isMine && assignment.decision !== "rejected";
  const canApproveAgain =
    isActive &&
    isMine &&
    assignment.decision === "approved" &&
    !!assignment.contentChangedSinceDecision;
  const note = assignment.reason ?? assignment.comment;

  return (
    <li className="flex items-start gap-2.5">
      <span className="flex h-9 shrink-0 items-center">
        <ProductMemberAvatar member={{ name }} />
      </span>
      <div className="min-w-0 flex-1 py-2">
        <p className="truncate text-sm leading-5" title={email}>
          <span className="font-medium">{name}</span>
          {assignment.relationship ? (
            <span className="text-muted-foreground">
              {" · "}
              {WORKFLOW_RELATIONSHIP_LABELS[assignment.relationship]}
            </span>
          ) : null}
        </p>
        {assignment.decidedAt ? (
          <p className="text-xs text-muted-foreground">
            {formatToLocalDateTime(assignment.decidedAt)}
          </p>
        ) : null}
        <ChangeRequestStatus
          assignment={assignment}
          isMine={isMine}
          isActive={isActive}
        />
        {assignment.contentChangedSinceDecision ? (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Content changed since this approval
          </p>
        ) : null}
        {note ? (
          <p className="mt-1 whitespace-pre-wrap break-words border-l-2 border-border pl-2 text-xs text-foreground/80">
            {note}
          </p>
        ) : null}
      </div>
      <div className="flex h-9 shrink-0 items-center gap-1.5">
        {canRequestChanges ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={() =>
              onDecide({ assignment, groupLabel, decision: "request_changes" })
            }
          >
            <Icon icon={MessageEdit01Icon} size={14} />
            Request Changes
          </Button>
        ) : null}
        {canDecide ? (
          <>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={disabled}
              onClick={() =>
                onDecide({ assignment, groupLabel, decision: "reject" })
              }
            >
              <Icon icon={CancelCircleIcon} size={14} />
              Reject
            </Button>
            {canApprove ? (
              <Button
                type="button"
                size="sm"
                disabled={disabled}
                onClick={() =>
                  onDecide({ assignment, groupLabel, decision: "approve" })
                }
              >
                <Icon icon={CheckmarkCircle02Icon} size={14} />
                Approve
              </Button>
            ) : null}
          </>
        ) : (
          <>
            {canApproveAgain ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() =>
                  onDecide({ assignment, groupLabel, decision: "approve" })
                }
              >
                <Icon icon={CheckmarkCircle02Icon} size={14} />
                Approve again
              </Button>
            ) : null}
            <WorkflowDecisionBadge
              decision={assignment.decision}
              closed={isEnded}
            />
          </>
        )}
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
      </div>
    </li>
  );
}

function AssignmentList({
  assignments,
  groupLabel,
  context,
  emptyText,
}: {
  assignments: WorkflowAssignmentDetail[];
  groupLabel: string;
  context: RowContext;
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
              context={context}
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

function ApprovalProgress({ workflow }: { workflow: WorkflowDetail }) {
  const total = workflow.assignments.length;
  const approved = workflow.assignments.filter(
    (assignment) => assignment.decision === "approved",
  ).length;
  const pending = workflow.assignments.filter(
    (assignment) =>
      assignment.decision === "pending" ||
      assignment.decision === "changes_requested",
  ).length;
  const openRequests = workflow.assignments.reduce(
    (count, assignment) => count + (assignment.openChangeRequestCount ?? 0),
    0,
  );
  const percentage = total ? Math.round((approved / total) * 100) : 0;

  return (
    <section className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-border bg-background px-4 py-3">
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-medium tabular-nums">
          {approved} of {total} approved
        </span>
        {workflow.status === "in_review" ? (
          <span className="text-xs text-muted-foreground tabular-nums">
            · {pending} pending
          </span>
        ) : null}
        {openRequests ? (
          <span className="text-xs text-orange-600 tabular-nums dark:text-orange-400">
            · {plural(openRequests, "open change request")}
          </span>
        ) : null}
      </div>
      <div
        className="h-1.5 min-w-40 flex-1 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Approvals"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={approved}
      >
        <div
          className="h-full rounded-full bg-teal-500 transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}

export function WorkflowApprovalsTab({
  workflow,
}: {
  workflow: WorkflowDetail;
}) {
  const auth = useAuth();
  const update = useUpdateWorkflow(workflow._id);
  const [functionLabel, setFunctionLabel] = useState("");
  const [decisionOpen, setDecisionOpen] = useState(false);
  const [decisionTarget, setDecisionTarget] = useState<DecisionTarget | null>(
    null,
  );
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<RemovalTarget | null>(
    null,
  );
  const { canEdit } = workflow;
  const isStarted = workflow.status !== "draft";
  const rowContext: RowContext = {
    canEdit,
    disabled: update.isPending,
    isInReview: workflow.status === "in_review",
    isActive:
      workflow.status === "in_review" ||
      workflow.status === "ready_to_complete",
    isEnded: ["completed", "rejected", "cancelled"].includes(workflow.status),
    currentUserId: auth.user?.profile?.userId as string | undefined,
    onRemove: (target) => {
      setRemoveTarget(target);
      setRemoveOpen(true);
    },
    onDecide: (target) => {
      setDecisionTarget(target);
      setDecisionOpen(true);
    },
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
      }, new Map<string, WorkflowAssignmentDetail[]>())
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
      {isStarted ? <ApprovalProgress workflow={workflow} /> : null}

      <section className="overflow-hidden rounded-2xl border border-border bg-background">
        <SectionHeader
          title="Product Team"
          info="Each Product needs at least one approver from its own Product Owner or Contributors."
        >
          {productTeams.length && !isStarted ? (
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
                  context={rowContext}
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
          info="Approve the whole workflow, e.g. Quality or Regulatory. The same person can be assigned under more than one Function."
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
                  context={rowContext}
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

      {decisionTarget?.decision === "approve" ? (
        <ApproveAssignmentDialog
          workflowId={workflow._id}
          assignment={decisionTarget.assignment}
          groupLabel={decisionTarget.groupLabel}
          open={decisionOpen}
          onOpenChange={setDecisionOpen}
        />
      ) : decisionTarget?.decision === "reject" ? (
        <RejectWorkflowDialog
          workflow={workflow}
          assignment={decisionTarget.assignment}
          open={decisionOpen}
          onOpenChange={setDecisionOpen}
        />
      ) : decisionTarget?.decision === "request_changes" ? (
        <RequestChangesDialog
          key={decisionTarget.assignment._id}
          workflow={workflow}
          assignment={decisionTarget.assignment}
          open={decisionOpen}
          onOpenChange={setDecisionOpen}
        />
      ) : null}

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
