"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";
import { useAuth } from "react-oidc-context";
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
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { useGetUsersInfinite } from "@/hooks/user/useGetUsersInfinite";
import type { ProductTeamMember } from "@/types/product";
import { ProductMemberAvatar } from "./ProductMemberAvatar";

const MIN_VISIBLE_MEMBERS = 5;

interface ProductMemberComboboxProps {
  id?: string;
  value?: ProductTeamMember | null;
  placeholder: string;
  excludeIds?: string[];
  disabled?: boolean;
  onSelect: (member: ProductTeamMember) => void;
  trigger?: ReactNode;
}

export default function ProductMemberCombobox({
  id,
  value,
  placeholder,
  excludeIds = [],
  disabled,
  onSelect,
  trigger,
}: ProductMemberComboboxProps) {
  const auth = useAuth();
  const currentUserId = auth.user?.profile?.userId as string | undefined;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isPending,
    isError,
  } = useGetUsersInfinite({
    enabled: open,
    search: debouncedSearch,
    activeOnly: true,
  });

  const members = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.result?.users ?? []) ?? []).filter(
        (user) => user._id && !excludeIds.includes(user._id),
      ),
    [data, excludeIds],
  );

  useEffect(() => {
    if (open && members.length < MIN_VISIBLE_MEMBERS && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [open, members.length, hasNextPage, isFetching, fetchNextPage]);

  const handleListScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 40;
    if (nearBottom && hasNextPage && !isFetching) fetchNextPage();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button
            id={id}
            type="button"
            variant="outline"
            size="default"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="w-full justify-between bg-background font-normal"
          >
            <span className="flex min-w-0 items-center gap-2">
              {value ? <ProductMemberAvatar member={value} /> : null}
              <span className="truncate">
                {value
                  ? `${value.name}${value._id === currentUserId ? " (Me)" : ""}`
                  : placeholder}
              </span>
            </span>
            <Icon icon={UnfoldMoreIcon} size={16} className="shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className={
          trigger ? "w-72 p-0" : "w-(--radix-popover-trigger-width) p-0"
        }
        align="start"
        onWheel={(event) => event.stopPropagation()}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search members…"
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList onScroll={handleListScroll}>
            <CommandEmpty>
              {isPending
                ? "Loading members…"
                : isError
                  ? "Failed to load members."
                  : "No member found."}
            </CommandEmpty>
            <CommandGroup>
              {members.map((user) => (
                <CommandItem
                  key={user._id}
                  value={user._id}
                  onSelect={() => {
                    onSelect({
                      _id: user._id!,
                      name: user.name,
                      email: user.email,
                      profileAvatar: user.profileAvatar,
                    });
                    setOpen(false);
                  }}
                >
                  <ProductMemberAvatar member={user} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">
                      {user.name}
                      {user._id === currentUserId ? " (Me)" : ""}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </span>
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
