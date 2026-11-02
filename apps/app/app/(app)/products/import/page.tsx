import { ProductImportFlow } from "@/features/workspace/products/import/ProductImportFlow";

export default function ProductImportPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <h1 className="sr-only">Import products</h1>
      <ProductImportFlow />
    </div>
  );
}
