"use client";

import { useEffect, useState, type UIEvent } from "react";
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
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

const ALL = "all";

export function AnalyticsFilterCombobox({
  label,
  allLabel,
  value,
  selectedLabel,
  options,
  isPending,
  isError,
  hasNextPage,
  isFetching,
  isFetchingNextPage,
  fetchNextPage,
  onSearchChange,
  onChange,
}: {
  label: string;
  allLabel: string;
  value?: string;
  selectedLabel?: string;
  options: { value: string; label: string }[];
  isPending: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onSearchChange: (search: string) => void;
  onChange: (value?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => onSearchChange(search), 300);
    return () => window.clearTimeout(timer);
  }, [search, onSearchChange]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40 &&
      hasNextPage &&
      !isFetching
    ) {
      fetchNextPage();
    }
  };

  const select = (next?: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          className="h-8 w-auto max-w-56 justify-between font-normal"
        >
          <span className="truncate">
            {value
              ? selectedLabel ??
                options.find((option) => option.value === value)?.label ??
                "…"
              : allLabel}
          </span>
          <Icon icon={UnfoldMoreIcon} size={16} className="shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="start"
        onWheel={(event) => event.stopPropagation()}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${label.toLowerCase()}s…`}
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList onScroll={handleScroll}>
            <CommandEmpty>
              {isPending
                ? "Loading…"
                : isError
                  ? `Failed to load ${label.toLowerCase()}s.`
                  : `No ${label.toLowerCase()} found.`}
            </CommandEmpty>
            <CommandGroup>
              {!search && (
                <CommandItem value={ALL} onSelect={() => select(undefined)}>
                  {allLabel}
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => select(option.value)}
                >
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center py-2">
                  <Spinner className="size-4" />
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
