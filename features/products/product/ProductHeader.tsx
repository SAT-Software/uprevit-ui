"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import { Product } from "@/types/product";

export type Item = {
  productId: string;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
  productName: string;
  description: string;
  projectId: string;
  departmentId: string;
  version: string;
  status: "Submitted" | "Draft" | "Archived";
  targetDate: number;
  completionDate: number | null;
  delayReason: string | null;
  tabsCompleted: string[];
  completionPercentage: number;
};

const TOTAL_TABS = 7;

export function ProductHeader() {
  const params = useParams();
  const pathname = usePathname();
  const { data: productsData } = useGetAllProducts();

  // Get current tab from pathname
  const getCurrentTab = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const currentTab = getCurrentTab();
  const productId = params.productId as string;

  // Get current product directly from the API data
  const foundProduct =
    productId && productsData?.result.products
      ? productsData.result.products.find((p: Product) => p._id === productId)
      : null;

  // Map the real API product to our local Item type for compatibility
  const product: Item | null = foundProduct
    ? {
        productId: foundProduct._id || "",
        createdOn: foundProduct.action_at || "",
        createdBy: foundProduct.action_by || "",
        modifiedOn: foundProduct.action_at || "",
        modifiedBy: foundProduct.action_by || "",
        productName: foundProduct.product_name || "",
        description: "",
        projectId: foundProduct.project_id || "",
        departmentId: foundProduct.department_id || "",
        version: foundProduct.master_version || "1.0",
        status:
          (foundProduct.status as "Submitted" | "Draft" | "Archived") ||
          "Draft",
        targetDate: foundProduct.target_date || "N/A",
        completionDate: foundProduct.target_date || "N/A",
        delayReason: null,
        tabsCompleted: [], // This would need to be calculated from the actual product data
        completionPercentage: 0, // This would need to be calculated from the actual product data
      }
    : null;

  // Use stored completion percentage, fallback to calculation if not available
  const completionPercentage =
    product?.completionPercentage ??
    (product
      ? Math.round((product.tabsCompleted.length / TOTAL_TABS) * 100)
      : 0);

  const isCurrentTabCompleted =
    product && currentTab ? product.tabsCompleted.includes(currentTab) : false;

  const handleToggleTab = () => {
    if (!currentTab || !product) return;

    // Create updated product with toggled tab completion
    const updatedTabsCompleted = isCurrentTabCompleted
      ? product.tabsCompleted.filter((tab) => tab !== currentTab)
      : [...product.tabsCompleted, currentTab];

    const newCompletionPercentage = Math.round(
      (updatedTabsCompleted.length / TOTAL_TABS) * 100
    );

    // Here you would typically also update the data source (API call, etc.)
    // For now, we'll just update local state
    console.log(
      `Tab "${currentTab}" ${
        isCurrentTabCompleted ? "uncompleted" : "completed"
      } for product ${productId}`
    );
    console.log(`New completion percentage: ${newCompletionPercentage}%`);
  };

  return (
    <header
      className={cn(
        "flex w-full shrink-0 items-center justify-between px-4 gap-2 border-b border-input transition-[width,height] ease-linear ",
        "h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Create new version
        </Button>
        <Button variant="outline" size="sm">
          Export Product Plan
        </Button>
        <Select>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="View Versions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="v1.0">Version 1.0</SelectItem>
            <SelectItem value="v1.1">Version 1.1</SelectItem>
            <SelectItem value="v1.2">Version 1.2</SelectItem>
            <SelectItem value="v2.0">Version 2.0 (Current)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "text-xs font-medium",
              completionPercentage === 100
                ? "text-green-600"
                : completionPercentage >= 50
                ? "text-yellow-600"
                : "text-muted-foreground"
            )}
          >
            Progress: {completionPercentage}%
          </div>
          <div className="text-xs text-muted-foreground">
            {product?.tabsCompleted.length || 0}/{TOTAL_TABS}
          </div>
        </div>

        <Button
          variant={isCurrentTabCompleted ? "default" : "outline"}
          size="sm"
          onClick={handleToggleTab}
          disabled={!currentTab || !product}
          className={cn(
            "gap-2 text-xs",
            isCurrentTabCompleted
              ? "bg-slate-100 hover:bg-slate-200 text-foreground"
              : "border-none text-slate-800 hover:bg-slate-50"
          )}
        >
          {isCurrentTabCompleted ? (
            <>
              <CheckCircle size={10} />
              Mark Incomplete
            </>
          ) : (
            <>
              <Circle size={10} />
              Mark Complete
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
