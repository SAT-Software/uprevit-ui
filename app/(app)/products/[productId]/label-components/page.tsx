import ProductComponentDetailsTable from "@/features/products/product/component-details/ProductComponentDetailsTable";
import AddComponentDialog from "@/features/products/product/component-details/AddComponentDialog";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-end">
        <AddComponentDialog />
        {/* <Link href={`/products/${productId}/compliance-information`}>
          <Button size="sm" variant="outline" className="text-xs">
            Next Page
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </Link> */}
      </div>
      <ProductComponentDetailsTable />
    </div>
  );
}
