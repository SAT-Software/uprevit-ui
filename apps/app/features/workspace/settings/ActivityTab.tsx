"use client";

import { ActivityLogsPanel } from "@/features/workspace/logs/ActivityLogsPanel";

export default function ActivityTab() {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-border bg-background p-4">
      <ActivityLogsPanel
        scopeType="workspace"
        title="Workspace Activity"
        description="Every recorded change in this workspace: products, projects, departments, source files, workflows, members, and workspace settings."
      />
    </div>
  );
}
