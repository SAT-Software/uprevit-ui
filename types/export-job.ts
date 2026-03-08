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

export interface EnqueueProductExportResponse {
  message: string;
  result: {
    jobId: string;
    status: ExportJobStatus;
  };
}

export interface GetProductExportJobsResponse {
  message: string;
  result: {
    jobs: ExportJobSummary[];
    hasActiveJobs?: boolean;
    activeJobsCount?: number;
    pagination: ExportJobPagination;
  };
}

export interface GetProductExportJobResponse {
  message: string;
  result: ExportJobSummary;
}

export interface DownloadProductExportJobResponse {
  message: string;
  result: {
    jobId: string;
    downloadUrl: string;
    fileName?: string;
    contentType?: string;
    expiresAt: string;
  };
}
