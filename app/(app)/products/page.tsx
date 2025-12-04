"use client";

import ProductsPageProductTable from "@/features/workspace/products/ProductsPageProductTable";
import CreateProductDialog from "@/features/workspace/products/CreateProductDialog";

function ProductsPage() {
  return (
    <div className="flex flex-col gap-2 p-2 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-border bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold">All Products</h1>
            <div className="w-1 h-1 bg-border border border-border rounded-full hidden sm:block" />
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Manage and view all products in your workspace
            </p>
          </div>
          <CreateProductDialog />
        </div>
        <ProductsPageProductTable />
      </div>
    </div>
  );
}

export default ProductsPage;
