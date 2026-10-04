import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AuthContextProps, useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { getErrorMessage, getResponseErrorMessage } from "@/lib/api-error";
import type {
  GetWorkflowsResponse,
  UpdateWorkflowInput,
  Workflow,
  WorkflowCompletionMode,
  WorkflowDecisionInput,
  WorkflowDetail,
  WorkflowEvent,
  WorkflowReadinessCheck,
  WorkflowStatus,
  WorkflowView,
} from "@/types/workflow";

const WORKFLOWS_QUERY_KEY = ["workflows"];
const ACTIVE_POLL_INTERVAL_MS = 30_000;
const LIST_POLL_INTERVAL_MS = 60_000;

const isActiveWorkflow = (status?: WorkflowStatus) =>
  status === "in_review" || status === "ready_to_complete";
const PRODUCT_QUERY_KEYS = [
  ["all-products"],
  ["products-infinite"],
  ["product-tab-data"],
  ["product-versions-infinite"],
  ["all-bookmarked-products"],
  ["products-in-bookmark-folder"],
];

export type WorkflowListParams = {
  view: WorkflowView;
  page: number;
  limit: number;
  search?: string;
  status?: WorkflowStatus;
  productLineageId?: string;
};

async function workflowRequest<T>(
  path: string,
  auth: AuthContextProps,
  fallbackMessage: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`/api/workflows${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.user?.access_token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(await getResponseErrorMessage(res, fallbackMessage));
  }
  return res.json();
}

export function useWorkflows(params: WorkflowListParams, enabled = true) {
  const auth = useAuth();

  return useQuery({
    queryKey: [...WORKFLOWS_QUERY_KEY, "list", params],
    queryFn: ({ signal }) => {
      const search = new URLSearchParams({
        view: params.view,
        page: String(params.page),
        limit: String(params.limit),
      });
      if (params.search) search.set("search", params.search);
      if (params.status) search.set("status", params.status);
      if (params.productLineageId)
        search.set("productLineageId", params.productLineageId);

      return workflowRequest<GetWorkflowsResponse>(
        `?${search.toString()}`,
        auth,
        "Failed to fetch workflows",
        { signal },
      );
    },
    placeholderData: keepPreviousData,
    enabled: auth.isAuthenticated && enabled,
    refetchInterval: LIST_POLL_INTERVAL_MS,
  });
}

export function useWorkflow(workflowId: string) {
  const auth = useAuth();

  return useQuery({
    queryKey: [...WORKFLOWS_QUERY_KEY, "detail", workflowId],
    queryFn: ({ signal }) =>
      workflowRequest<{ workflow: WorkflowDetail }>(
        `/${workflowId}`,
        auth,
        "Failed to fetch workflow",
        { signal },
      ),
    enabled: auth.isAuthenticated && !!workflowId,
    refetchInterval: (query) =>
      isActiveWorkflow(query.state.data?.workflow.status)
        ? ACTIVE_POLL_INTERVAL_MS
        : false,
  });
}

export function useWorkflowReadiness(workflowId: string, enabled = true) {
  const auth = useAuth();

  return useQuery({
    queryKey: [...WORKFLOWS_QUERY_KEY, "readiness", workflowId],
    queryFn: ({ signal }) =>
      workflowRequest<{
        readiness: { ready: boolean; checks: WorkflowReadinessCheck[] };
      }>(`/${workflowId}/readiness`, auth, "Failed to check readiness", {
        signal,
      }),
    enabled: auth.isAuthenticated && !!workflowId && enabled,
  });
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: (body: {
      name: string;
      description: string;
      completionMode: WorkflowCompletionMode;
    }) =>
      workflowRequest<{ workflow: Workflow }>(
        "",
        auth,
        "Failed to create workflow",
        { method: "POST", body: JSON.stringify(body) },
      ),
    onSuccess: ({ workflow }) => {
      toast.success(`Workflow ${workflow.numberLabel} created`);
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create workflow"));
    },
  });
}

export function useUpdateWorkflow(workflowId: string) {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: (body: UpdateWorkflowInput) =>
      workflowRequest<{ workflow: Workflow }>(
        `/${workflowId}`,
        auth,
        "Failed to update workflow",
        { method: "PATCH", body: JSON.stringify(body) },
      ),
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update workflow"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY });
    },
  });
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: (workflowId: string) =>
      workflowRequest(`/${workflowId}`, auth, "Failed to delete workflow", {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Workflow draft deleted");
      queryClient.invalidateQueries({
        queryKey: [...WORKFLOWS_QUERY_KEY, "list"],
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete workflow"));
    },
  });
}

export function useWorkflowHistory(
  workflowId: string,
  status: WorkflowStatus,
) {
  const auth = useAuth();

  return useQuery({
    queryKey: [...WORKFLOWS_QUERY_KEY, "history", workflowId],
    queryFn: ({ signal }) =>
      workflowRequest<{ events: WorkflowEvent[] }>(
        `/${workflowId}/history`,
        auth,
        "Failed to fetch workflow history",
        { signal },
      ),
    enabled: auth.isAuthenticated && !!workflowId && status !== "draft",
    refetchInterval: isActiveWorkflow(status) ? ACTIVE_POLL_INTERVAL_MS : false,
  });
}

function useWorkflowAction<TVariables>(
  workflowId: string,
  request: (variables: TVariables) => { path: string; body: unknown },
  messages: {
    success: (variables: TVariables, workflow: Workflow) => string;
    error: string;
  },
) {
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation({
    mutationFn: (variables: TVariables) => {
      const { path, body } = request(variables);
      return workflowRequest<{ workflow: Workflow }>(
        `/${workflowId}${path}`,
        auth,
        messages.error,
        { method: "POST", body: JSON.stringify(body) },
      );
    },
    onSuccess: ({ workflow }, variables) => {
      toast.success(messages.success(variables, workflow));
      for (const queryKey of PRODUCT_QUERY_KEYS) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, messages.error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: WORKFLOWS_QUERY_KEY });
    },
  });
}

export function useStartWorkflow(workflowId: string) {
  return useWorkflowAction(
    workflowId,
    () => ({ path: "/start", body: {} }),
    { success: () => "Workflow started", error: "Failed to start workflow" },
  );
}

export function useDecideWorkflowAssignment(workflowId: string) {
  return useWorkflowAction(
    workflowId,
    ({
      assignmentId,
      ...body
    }: WorkflowDecisionInput & { assignmentId: string }) => ({
      path: `/assignments/${assignmentId}/decision`,
      body,
    }),
    {
      success: ({ decision }, workflow) =>
        decision === "reject"
          ? "Workflow rejected"
          : workflow.status === "completed"
            ? "Approved. The workflow is complete and its Products are Released"
            : workflow.status === "ready_to_complete"
              ? "Approved. The workflow is ready to complete"
              : "Approved",
      error: "Failed to record decision",
    },
  );
}

export function useCancelWorkflow(workflowId: string) {
  return useWorkflowAction(
    workflowId,
    (reason: string) => ({ path: "/cancel", body: { reason } }),
    { success: () => "Workflow cancelled", error: "Failed to cancel workflow" },
  );
}

export function useCompleteWorkflow(workflowId: string) {
  return useWorkflowAction(
    workflowId,
    () => ({ path: "/complete", body: {} }),
    {
      success: () => "Workflow completed. Its Products are Released",
      error: "Failed to complete workflow",
    },
  );
}
