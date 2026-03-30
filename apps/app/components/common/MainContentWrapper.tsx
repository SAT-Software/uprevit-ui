"use client";

import { useParams } from "next/navigation";
import { cn } from "@uprevit/ui/lib/utils";

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const params = useParams();

  const productId =
    typeof params.productId === "string"
      ? params.productId
      : Array.isArray(params.productId)
        ? params.productId[0]
        : undefined;

  const isProductPage = Boolean(productId);

  return (
    <div
      className={cn(
        "flex flex-1 flex-col bg-sidebar min-h-0 overflow-auto",
        // Dynamic top padding based on header height
        isProductPage
          ? "pt-12 group-has-[data-collapsible=icon]/sidebar-wrapper:pt-12 gap-0"
          : "pt-12 group-has-[data-collapsible=icon]/sidebar-wrapper:pt-12 gap-2",
      )}
    >
      {children}
    </div>
  );
}
