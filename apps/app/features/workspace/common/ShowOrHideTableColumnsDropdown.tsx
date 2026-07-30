"use client";

import { ColumnsThreeCogIcon, Refresh04Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Table, Column } from "@tanstack/react-table";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@uprevit/ui/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@uprevit/ui/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";

type ColumnLabelMeta = {
  label?: string;
};

const getColumnLabel = <TData,>(column: Column<TData, unknown>) => {
  const meta = column.columnDef.meta as ColumnLabelMeta | undefined;
  return meta?.label ?? column.id;
};

function ShowOrHideTableColumnsDropdown<TData>({
  table,
  onResetDefault,
}: {
  table: Table<TData>;
  onResetDefault?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon-xs"
              className="text-muted-foreground/60 hover:text-muted-foreground"
            >
              <Icon
                icon={ColumnsThreeCogIcon}
                size={16}
                className="transition-colors delay-100 duration-200 ease-in-out"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show or hide table columns</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{ boxShadow: "0 12px 28px rgba(0, 0, 0, 0.18)" }}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Fixed columns</DropdownMenuLabel>

          {table
            .getAllColumns()
            .filter((column) => !column.getCanHide())
            .map((column) => {
              return (
                <FieldGroup
                  key={column.id}
                  className="mx-auto w-56 flex-flex-col focus:bg-accent focus:text-accent-foreground text-foreground relative flex cursor-default items-center gap-1 rounded-md py-1.5 pr-2 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Field orientation="horizontal">
                    <Checkbox checked={column.getIsVisible()} disabled />
                    <FieldLabel
                      htmlFor="terms-checkbox-basic"
                      className="font-normal"
                    >
                      {getColumnLabel(column)}
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              );
            })}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuLabel>Active columns</DropdownMenuLabel>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <FieldGroup
                  key={column.id}
                  className="mx-auto w-56 flex-flex-col focus:bg-accent focus:text-accent-foreground text-foreground relative flex cursor-default items-center gap-1 rounded-md py-1.5 pr-2 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Field orientation="horizontal">
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    />
                    <FieldLabel
                      htmlFor="terms-checkbox-basic"
                      className="font-normal"
                    >
                      {getColumnLabel(column)}
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              );
            })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="group">
          <DropdownMenuItem
            onClick={() => {
              if (onResetDefault) {
                onResetDefault();
                return;
              }
              table.resetColumnVisibility();
            }}
          >
            <Icon
              icon={Refresh04Icon}
              size={14}
              strokeWidth={2}
              className="text-muted-foreground/60 group-hover:text-foreground transition-colors delay-100 duration-200 ease-in-out"
            />
            Reset Default
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ShowOrHideTableColumnsDropdown;
