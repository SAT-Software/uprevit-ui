"use client";

import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

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
        "flex flex-1 flex-col gap-4 bg-muted h-full",
        // Dynamic top padding based on header height
        isProductPage
          ? "pt-12 group-has-[data-collapsible=icon]/sidebar-wrapper:pt-12"
          : "pt-16 group-has-[data-collapsible=icon]/sidebar-wrapper:pt-16"
      )}
    >
      {children}
    </div>
  );
}
