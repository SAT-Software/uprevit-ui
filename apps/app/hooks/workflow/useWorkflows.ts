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
  WorkflowDetail,
  WorkflowReadinessCheck,
  WorkflowStatus,
  WorkflowView,
} from "@/types/workflow";

const WORKFLOWS_QUERY_KEY = ["workflows"];

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
