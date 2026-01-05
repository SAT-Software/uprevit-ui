import { ProductHeader } from "@/features/workspace/products/product/ProductHeader";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ProductHeader />
      <div className="flex flex-1 flex-col min-h-0 bg-accent/60">
        {children}
      </div>
    </div>
  );
}
