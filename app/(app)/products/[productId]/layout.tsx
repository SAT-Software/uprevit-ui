import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProductHeader } from "@/features/products/product/ProductHeader";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarInset>
        <ProductHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 h-full bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
