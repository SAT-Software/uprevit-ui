import { ProductHeader } from "@/features/workspace/products/product/ProductHeader";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProductHeader />
      <div className="flex flex-1 flex-col h-full bg-accent/60">{children}</div>
    </>
  );
}
