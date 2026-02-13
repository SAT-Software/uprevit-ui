"use client";

import { useParams } from "next/navigation";
import { ActivityLogsPanel } from "@/features/workspace/logs/ActivityLogsPanel";

export default function ProductLogsPage() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  if (!productId) {
    return (
      <div className="flex flex-col gap-2 p-2 h-full">
        <div className="flex items-center justify-center h-full border border-border rounded-xl bg-background text-sm text-muted-foreground">
          Product not found.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2 h-full min-h-0">
      <div className="flex flex-col border border-border bg-background rounded-xl p-4 w-full h-full min-h-0 overflow-hidden">
        <ActivityLogsPanel
          scopeType="product"
          scopeId={productId}
          title="Product Logs"
          description="Track who changed product data, what changed, where, and when."
        />
      </div>
    </div>
  );
}
