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
import { useState, useEffect } from "react";
import { sampleProducts } from "@/app/(app)/products/page";

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
  const [product, setProduct] = useState<Item | null>(null);

  // Get current tab from pathname
  const getCurrentTab = () => {
    const pathSegments = pathname.split("/");
    return pathSegments[pathSegments.length - 1];
  };

  const currentTab = getCurrentTab();
  const productId = params.productId as string;

  // Load product data
  useEffect(() => {
    if (productId) {
      const foundProduct = sampleProducts.find(
        (p) => p.productId === productId
      );
      setProduct(foundProduct || null);
    }
  }, [productId]);

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

    const updatedProduct = {
      ...product,
      tabsCompleted: updatedTabsCompleted,
      completionPercentage: newCompletionPercentage,
    };

    setProduct(updatedProduct);

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
        "flex  w-full shrink-0 items-center justify-between px-4 gap-2 border-b border-input transition-[width,height] ease-linear ",
        "h-12 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Create new version
        </Button>
        <Select>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">Export as PDF</SelectItem>
            <SelectItem value="excel">Export as Excel</SelectItem>
            <SelectItem value="csv">Export as CSV</SelectItem>
            <SelectItem value="json">Export as JSON</SelectItem>
          </SelectContent>
        </Select>
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
        <Select>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="View Redlines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Redlines</SelectItem>
            <SelectItem value="pending">Pending Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
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
