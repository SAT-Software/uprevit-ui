import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@uprevit/ui/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@uprevit/ui/components/ui/dialog";
import { Label } from "@uprevit/ui/components/ui/label";
import { Input } from "@uprevit/ui/components/ui/input";
import { useAddSourceFilesFolder } from "@/hooks/source-files/useAddSourceFilesFolder";
import { useGetAllProducts } from "@/hooks/product/useGetAllProducts";
import {
  PiPlusCircleDuotone,
  PiXCircleDuotone,
  PiFolderPlusDuotone,
} from "react-icons/pi";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { SourceFilesDuplicateProductLinkAlert } from "@/features/workspace/source-files/SourceFilesDuplicateProductLinkAlert";

interface FormValues {
  folderName: string;
}

type ProductLinkItem = {
  _id: string;
  product_name: string;
};

export default function DialogAddProductFolder({
  parentId,
  folderId,
}: {
  parentId?: string;
  folderId?: string;
}) {
  const { mutate: addSourceFilesFolder, isPending } =
    useAddSourceFilesFolder(folderId);
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const workspaceId = auth?.user?.profile?.workspaceId;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      folderName: "",
    },
    mode: "onSubmit",
  });

  const { data: productsData, isLoading: productsLoading } =
    useGetAllProducts();
  const products =
    (productsData?.result?.products as ProductLinkItem[]) ?? [];
  const [selectedProductId, setSelectedProductId] = useState("");
  const noneProductValue = "none";

  const folderName = watch("folderName");
  const isRootFolder = !parentId;
  const selectedProduct = products.find(
    (product) => product._id === selectedProductId,
  );

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const sourceFilesFolderData = {
      workspace_id: workspaceId as string,
      name: data.folderName,
      type: "folder",
      parentId: parentId,
      ...(selectedProductId && { product_id: selectedProductId }),
    };

    addSourceFilesFolder(sourceFilesFolderData, {
      onSuccess: () => {
        reset();
        setSelectedProductId("");
        setOpen(false);
      },
      onError: () => {
        reset();
        setSelectedProductId("");
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          reset();
          setSelectedProductId("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PiFolderPlusDuotone className="w-5 h-5" />
          Add Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiFolderPlusDuotone className="w-5 h-5 text-muted-foreground" />
              <p>Add New Folder</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter a name for the new folder in your source files.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-folder-form"
          className="overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </Label>
              <Input
                id="folderName"
                placeholder="e.g. 'Marketing Materials'"
                {...register("folderName", {
                  required: "Folder name is required.",
                })}
              />
              {errors.folderName && (
                <p className="text-xs text-destructive">
                  {errors.folderName.message}
                </p>
              )}
            </div>
            {isRootFolder && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Link to Product (optional)
                </Label>
                <Select
                  value={selectedProductId || noneProductValue}
                  onValueChange={(value) =>
                    setSelectedProductId(value === noneProductValue ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={noneProductValue}>No product</SelectItem>
                    {productsLoading && (
                      <SelectItem disabled value="loading">
                        Loading products...
                      </SelectItem>
                    )}
                    {!productsLoading && products.length === 0 && (
                      <SelectItem disabled value="empty">
                        No products found
                      </SelectItem>
                    )}
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.product_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedProductId && (
                  <SourceFilesDuplicateProductLinkAlert
                    productId={selectedProductId}
                    productName={selectedProduct?.product_name}
                  />
                )}
              </div>
            )}
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="mr-2" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            form="add-folder-form"
            disabled={!folderName || isPending}
          >
            {isPending ? <Spinner /> : <PiPlusCircleDuotone className="mr-2" />}
            {isPending ? "Adding..." : "Add Folder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
