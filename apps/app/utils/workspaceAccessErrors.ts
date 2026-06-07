export class WorkspaceAccessFrozenError extends Error {
  constructor(message = "Workspace access is frozen") {
    super(message);
    this.name = "WorkspaceAccessFrozenError";
  }
}

export function isWorkspaceAccessFrozenError(error: unknown): boolean {
  if (error instanceof WorkspaceAccessFrozenError) return true;

  if (error instanceof Error) {
    return error.message.toLowerCase().includes("workspace access is frozen");
  }

  return false;
}
