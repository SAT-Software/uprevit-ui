"use client";

import {
  useEffect,
  useMemo,
  useState,
  type UIEvent,
} from "react";

import { cn } from "@uprevit/ui/lib/utils";
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
import { ProductStatusBadge } from "@/components/common/ProductStatusBadge";
import type { ProductStatus } from "@/types/product";

export type ProductComboboxItem = {
  _id: string;
  product_name?: string;
  product_plan_number?: string;
  product_lineage_id?: string;
  status?: ProductStatus;
};

export type ProductComboboxProps = {
  value: string;
  onValueChange: (
    productId: string,
    product?: ProductComboboxItem,
  ) => void;
  allowNone?: boolean;
  enabled?: boolean;
  statuses?: ProductStatus[];
  excludeIds?: string[];
  placeholder?: string;
  noneLabel?: string;
  initialSelectedLabel?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
};

export function ProductCombobox({
  value,
  onValueChange,
  allowNone = false,
  enabled = true,
  statuses,
  excludeIds,
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
    status: statuses,
  });

  const products = useMemo(
    () =>
      (
        productsData?.pages.flatMap(
          (page) => (page.result?.products as ProductComboboxItem[]) ?? [],
        ) ?? []
      ).filter(
        (product) =>
          !excludeIds?.includes(product._id) &&
          !excludeIds?.includes(product.product_lineage_id ?? ""),
      ),
    [productsData, excludeIds],
  );

  const isLoadingProducts =
    isPending || (isFetching && !isFetchingNextPage && products.length === 0);

  useEffect(() => {
    if (open && products.length < 5 && hasNextPage && !isFetching && !isError) {
      fetchNextPage();
    }
  }, [open, products.length, hasNextPage, isFetching, isError, fetchNextPage]);

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
            placeholder="Search products…"
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList onScroll={handleListScroll}>
            {isLoadingProducts ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Loading products…
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
                      <ProductStatusBadge
                        status={product.status}
                        className="ml-2 shrink-0"
                      />
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
