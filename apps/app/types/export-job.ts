export type ExportJobFormat = "pdf" | "excel";

export type ExportJobStatus = "queued" | "processing" | "completed" | "failed";

export type ExportJobTarget =
  | "product"
  | "product_specifications"
  | "operational_parameters"
  | "report";

export interface ExportJobSummary {
  jobId: string;
  target: ExportJobTarget;
  targetId?: string;
  workspaceId: string;
  format: ExportJobFormat;
  status: ExportJobStatus;
  attempts: number;
  fileName?: string;
  contentType?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  expiresAt: string;
}

export interface ExportJobPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ExportEnqueueResponse {
  message: string;
  result: {
    jobId: string;
    status: ExportJobStatus;
  };
}

export interface GetExportJobsResponse {
  message: string;
  result: {
    jobs: ExportJobSummary[];
    hasActiveJobs?: boolean;
    activeJobsCount?: number;
    pagination: ExportJobPagination;
  };
}

export interface GetExportJobResponse {
  message: string;
  result: ExportJobSummary;
}

export interface DownloadExportJobResponse {
  message: string;
  result: {
    jobId: string;
    downloadUrl: string;
    fileName?: string;
    contentType?: string;
    expiresAt: string;
  };
}

export type EnqueueProductExportResponse = ExportEnqueueResponse;

export type EnqueueReportExportResponse = ExportEnqueueResponse;

export type GetProductExportJobsResponse = GetExportJobsResponse;

export type GetReportExportJobsResponse = GetExportJobsResponse;

export type GetProductExportJobResponse = GetExportJobResponse;

export type GetReportExportJobResponse = GetExportJobResponse;

export type DownloadProductExportJobResponse = DownloadExportJobResponse;

export type DownloadReportExportJobResponse = DownloadExportJobResponse;
