"use client";

import ProductsPageProductTable from "@/features/products/ProductsPageProductTable";
import CreateProductDialog from "@/features/products/CreateProductDialog";
import { sampleProducts } from "./data";

function ProductsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <p className="text-base font-semibold">All Products</p>
          <CreateProductDialog />
        </div>
        {/* <Departments departments={departments} /> */}
        <ProductsPageProductTable sampleProducts={sampleProducts} />
      </div>
    </div>
  );
}

export default ProductsPage;
