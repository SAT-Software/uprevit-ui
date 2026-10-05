"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@uprevit/ui/components/ui/table";
import { TableBodySkeleton } from "@/components/table/TableBodySkeleton";
import { WorkflowDecisionBadge } from "@/features/workspace/workflows/WorkflowDecisionBadge";
import { WorkflowStatusBadge } from "@/features/workspace/workflows/WorkflowStatusBadge";
import type { Workflow, WorkflowDecision } from "@/types/workflow";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";

const getMyDecision = (
  workflow: Workflow,
  userId: string | undefined,
): WorkflowDecision => {
  const decisions = workflow.assignments
    .filter((assignment) => assignment.userId === userId)
    .map((assignment) => assignment.decision);
  if (decisions.includes("rejected")) return "rejected";
  if (decisions.includes("changes_requested")) return "changes_requested";
  if (decisions.includes("pending")) return "pending";
  return "approved";
};

export function WorkflowsTable({
  workflows,
  isPending,
  showMyDecision = false,
  userId,
}: {
  workflows: Workflow[];
  isPending: boolean;
  showMyDecision?: boolean;
  userId?: string;
}) {
  const router = useRouter();

  return (
    <Table className="min-w-250">
      <TableHeader className="bg-muted">
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[14%]">Number</TableHead>
          <TableHead className="w-[32%]">Name</TableHead>
          <TableHead className="w-[14%]">Status</TableHead>
          {showMyDecision ? (
            <TableHead className="w-[12%]">Your Decision</TableHead>
          ) : null}
          <TableHead className="w-[8%]">Products</TableHead>
          <TableHead className="w-[14%]">Initiator</TableHead>
          <TableHead className="w-[18%]">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          <TableBodySkeleton columnCount={showMyDecision ? 7 : 6} />
        ) : (
          workflows.map((workflow) => (
            <TableRow
              key={workflow._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => router.push(`/workflows/${workflow._id}`)}
            >
              <TableCell className="whitespace-nowrap font-mono text-sm">
                {workflow.numberLabel}
              </TableCell>
              <TableCell>
                <Link
                  href={`/workflows/${workflow._id}`}
                  className="block truncate text-sm font-medium rounded-sm hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title={workflow.name}
                  onClick={(event) => event.stopPropagation()}
                >
                  {workflow.name}
                </Link>
              </TableCell>
              <TableCell>
                <WorkflowStatusBadge status={workflow.status} />
              </TableCell>
              {showMyDecision ? (
                <TableCell>
                  <WorkflowDecisionBadge
                    decision={getMyDecision(workflow, userId)}
                    closed={workflow.status !== "in_review"}
                  />
                </TableCell>
              ) : null}
              <TableCell className="tabular-nums">
                {workflow.products.length}
              </TableCell>
              <TableCell title={workflow.initiator.email}>
                {workflow.initiator.name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatToLocalDateTime(workflow.dates.createdAt)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
