"use client";

import {
  useEffect,
  useMemo,
  useState,
  type UIEvent,
} from "react";

import { cn } from "@uprevit/ui/lib/utils";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@uprevit/ui/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@uprevit/ui/components/ui/popover";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Tick01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { useGetProductsInfinite } from "@/hooks/product/useGetProductsInfinite";

export type ProductComboboxItem = {
  _id: string;
  product_name?: string;
  product_plan_number?: string;
  status?: string;
};

export type ProductComboboxProps = {
  value: string;
  onValueChange: (
    productId: string,
    product?: ProductComboboxItem,
  ) => void;
  allowNone?: boolean;
  enabled?: boolean;
  placeholder?: string;
  noneLabel?: string;
  initialSelectedLabel?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

function ProductStatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  return (
    <Badge
      variant={
        status === "submitted"
          ? "green"
          : status === "draft"
            ? "blue"
            : "gray"
      }
      className="ml-2 shrink-0 font-normal capitalize"
    >
      <div
        className={cn("h-2 w-2 rounded-full", {
          "bg-green-500 dark:bg-green-400": status === "submitted",
          "bg-blue-500 dark:bg-blue-400": status === "draft",
          "bg-gray-500 dark:bg-gray-400": status === "archived",
        })}
      />
      {status}
    </Badge>
  );
}

export function ProductCombobox({
  value,
  onValueChange,
  allowNone = false,
  enabled = true,
  placeholder = "Select a product",
  noneLabel = "No product",
  initialSelectedLabel,
  id,
  disabled = false,
  className,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
  } = useGetProductsInfinite({
    enabled: enabled && open,
    search: debouncedSearch,
  });

  const products = useMemo(
    () =>
      productsData?.pages.flatMap(
        (page) => (page.result?.products as ProductComboboxItem[]) ?? [],
      ) ?? [],
    [productsData],
  );

  const isLoadingProducts =
    isPending || (isFetching && !isFetchingNextPage && products.length === 0);

  const selectedProduct = products.find((product) => product._id === value);

  const displayLabel = value
    ? selectedProduct?.product_name ||
      selectedLabel ||
      initialSelectedLabel ||
      placeholder
    : allowNone
      ? noneLabel
      : placeholder;

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  const handleSelect = (product: ProductComboboxItem | null) => {
    if (!product) {
      onValueChange("", undefined);
      setSelectedLabel("");
      setOpen(false);
      return;
    }

    onValueChange(product._id, product);
    setSelectedLabel(product.product_name ?? "");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          size="default"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between bg-background font-normal",
            className,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <Icon
            icon={UnfoldMoreIcon}
            size={16}
            className="ml-2 shrink-0 opacity-50"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        onWheel={(event) => event.stopPropagation()}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search products..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList onScroll={handleListScroll}>
            {isLoadingProducts ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Loading products...
              </div>
            ) : (
              <>
                <CommandEmpty>
                  {isError
                    ? "Failed to load products."
                    : "No product found."}
                </CommandEmpty>
                <CommandGroup>
                  {allowNone ? (
                    <CommandItem
                      value={noneLabel}
                      onSelect={() => handleSelect(null)}
                    >
                      <span className="flex-1 truncate">{noneLabel}</span>
                      <Icon
                        icon={Tick01Icon}
                        size={16}
                        className={cn(
                          "ml-2",
                          !value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ) : null}
                  {products.map((product) => (
                    <CommandItem
                      key={product._id}
                      value={product.product_name || product._id}
                      onSelect={() => handleSelect(product)}
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {product.product_name || "Unnamed Product"}
                      </span>
                      <ProductStatusBadge status={product.status} />
                      <Icon
                        icon={Tick01Icon}
                        size={16}
                        className={cn(
                          "ml-2 shrink-0",
                          value === product._id ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                  {isFetchingNextPage ? (
                    <div className="flex items-center justify-center py-2">
                      <Spinner className="size-4" />
                    </div>
                  ) : null}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
