"use client";

import { useId, useState } from "react";
import Link from "next/link";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowUpRight01Icon,
  Cancel01Icon,
  RefreshIcon,
  UserEdit01Icon,
} from "@hugeicons/core-free-icons";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Badge } from "@uprevit/ui/components/ui/badge";
import { Button } from "@uprevit/ui/components/ui/button";
import { Dialog, DialogTrigger } from "@uprevit/ui/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@uprevit/ui/components/ui/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "@uprevit/ui/components/ui/radio-group";
import { ScrollArea } from "@uprevit/ui/components/ui/scroll-area";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@uprevit/ui/components/ui/tabs";
import { useMemberAccessBlockers } from "@/hooks/user/useMemberAccessBlockers";
import {
  MemberAccessBlockedError,
  useUpdateUserAccess,
} from "@/hooks/user/useUpdateUserAccess";
import type { MemberAccess, MemberAccessBlockers, User } from "@/types/user";
import {
  MEMBER_ACCESS_OPTIONS,
  getMemberAccessOption,
  getMemberAccessOptionValue,
  type MemberAccessOptionValue,
} from "./memberAccessOptions";
import { UserTypeBadge } from "./UserTypeBadge";

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function DialogChangeMemberAccess({ user }: { user: User }) {
  const id = useId();
  const current = getMemberAccessOptionValue({
    userType: user.userType === "admin" ? null : (user.userType ?? null),
    isManager: user.isManager === true,
  });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MemberAccessOptionValue>(current);
  const { mutate: updateAccess, isPending } = useUpdateUserAccess();

  const next: MemberAccess = getMemberAccessOption(selected).access;
  const changed = selected !== current;
  const losesEditAccess = next.userType !== "user";
  const blockersQuery = useMemberAccessBlockers(
    user._id,
    next,
    open && changed && losesEditAccess,
  );
  const blockers = blockersQuery.data;
  const blockerCount = blockers
    ? blockers.products.length + blockers.workflows.length
    : 0;
  const checking = changed && losesEditAccess && blockersQuery.isFetching;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setSelected(current);
  }

  function handleConfirm() {
    if (!changed || !user._id) return;
    updateAccess(
      { userId: user._id, access: next },
      {
        onSuccess: () => setOpen(false),
        onError: (error) => {
          if (error instanceof MemberAccessBlockedError) {
            blockersQuery.refetch();
          }
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 max-w-full gap-1 px-1"
          aria-label={`Change access for ${user.name}`}
        >
          <UserTypeBadge userType={user.userType} isManager={user.isManager} />
          <Icon icon={ArrowDown01Icon} size={12} strokeWidth={2} />
        </Button>
      </DialogTrigger>
      <AppDialogContent
        title="Change access"
        description={`Choose what ${user.name} can do in this workspace.`}
        subtitle="Access changes can affect your usage limits and pricing."
        variant="form"
        size="lg"
        primaryAction={{
          label: "Save access",
          loadingLabel: "Saving…",
          onClick: handleConfirm,
          loading: isPending,
          disabled:
            isPending ||
            !changed ||
            checking ||
            blockerCount > 0 ||
            (losesEditAccess && blockersQuery.isError),
          icon: UserEdit01Icon,
        }}
        secondaryAction={{
          label: "Cancel",
          disabled: isPending,
          icon: Cancel01Icon,
        }}
      >
        <div className="space-y-4 p-4">
          <RadioGroup
            value={selected}
            onValueChange={(value) =>
              setSelected(value as MemberAccessOptionValue)
            }
            aria-label="Access"
            className="gap-2 sm:grid-cols-2"
          >
            {MEMBER_ACCESS_OPTIONS.map((option) => (
              <FieldLabel
                key={option.value}
                htmlFor={`${id}-${option.value}`}
                className="w-full last:sm:col-span-2"
              >
                <Field orientation="horizontal" className="p-3!">
                  <RadioGroupItem
                    value={option.value}
                    id={`${id}-${option.value}`}
                  />
                  <FieldContent className="gap-0.5">
                    <FieldTitle>
                      {option.label}
                      {option.value === current ? (
                        <Badge variant="outline" className="font-normal">
                          Current
                        </Badge>
                      ) : null}
                    </FieldTitle>
                    <FieldDescription className="text-xs">
                      {option.description}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>

          {changed && losesEditAccess ? (
            checking && !blockers ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Checking {user.name}&apos;s Products and workflows…
              </p>
            ) : blockersQuery.isError ? (
              <p className="text-sm text-muted-foreground">
                Couldn&apos;t check {user.name}&apos;s Products and workflows.{" "}
                <button
                  type="button"
                  className="underline underline-offset-2"
                  onClick={() => blockersQuery.refetch()}
                >
                  Try again
                </button>
              </p>
            ) : blockers && blockerCount > 0 ? (
              <MemberAccessBlockersPanel
                name={user.name}
                blockers={blockers}
                checking={checking}
                onRecheck={() => blockersQuery.refetch()}
              />
            ) : null
          ) : null}
        </div>
      </AppDialogContent>
    </Dialog>
  );
}

function MemberAccessBlockersPanel({
  name,
  blockers,
  checking,
  onRecheck,
}: {
  name: string;
  blockers: MemberAccessBlockers;
  checking: boolean;
  onRecheck: () => void;
}) {
  const summary = [
    blockers.products.length > 0
      ? plural(blockers.products.length, "Product")
      : null,
    blockers.workflows.length > 0
      ? plural(blockers.workflows.length, "active workflow")
      : null,
  ]
    .filter(Boolean)
    .join(" and ");

  const groups = [
    {
      value: "workflows",
      label: "Workflows",
      items: blockers.workflows.map((workflow) => ({
        id: workflow._id,
        href: `/workflows/${workflow._id}`,
        name: `${workflow.numberLabel} ${workflow.name}`,
        role: workflow.relationship === "initiator" ? "Initiator" : "Approver",
      })),
    },
    {
      value: "products",
      label: "Products",
      items: blockers.products.map((product) => ({
        id: product._id,
        href: `/products/${product._id}/product-information`,
        name: product.name,
        role: product.relationship === "owner" ? "Owner" : "Contributor",
      })),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <div className="overflow-hidden rounded-md border border-amber-500/30 bg-amber-500/10">
      <div className="flex items-start gap-3 p-3">
        <Icon
          icon={Alert02Icon}
          size={18}
          strokeWidth={2}
          className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400"
        />
        <div className="min-w-0 flex-1 space-y-1 text-sm">
          <p className="font-medium">
            {name} is still on {summary}
          </p>
          <p className="text-muted-foreground">
            Assign someone else to these first. Links open in a new tab.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 bg-background"
          onClick={onRecheck}
          disabled={checking}
        >
          <Icon
            icon={RefreshIcon}
            size={14}
            strokeWidth={2}
            className={checking ? "animate-spin" : undefined}
          />
          Check again
        </Button>
      </div>
      <Tabs
        key={groups.map((group) => group.value).join()}
        defaultValue={groups[0]?.value}
        className="gap-0 border-t border-amber-500/30 bg-background"
      >
        {groups.length > 1 ? (
          <TabsList variant="line" className="w-full justify-start border-b px-2">
            {groups.map((group) => (
              <TabsTrigger key={group.value} value={group.value} className="flex-none">
                {group.label}
                <Badge variant="secondary" className="font-normal">
                  {group.items.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        ) : null}
        {groups.map((group) => (
          <TabsContent key={group.value} value={group.value}>
            <ScrollArea viewportClassName="max-h-48" scrollFade>
              <ul className="divide-y">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {item.name}
                      </span>
                      <Badge variant="outline" className="shrink-0 font-normal">
                        {item.role}
                      </Badge>
                      <Icon
                        icon={ArrowUpRight01Icon}
                        size={14}
                        strokeWidth={2}
                        className="shrink-0 text-muted-foreground group-hover:text-foreground"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
