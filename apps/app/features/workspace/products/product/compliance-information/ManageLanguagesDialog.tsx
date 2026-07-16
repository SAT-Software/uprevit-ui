"use client";

import { useId, useMemo, useState } from "react";

import { CountryFlag } from "@/components/common/CountryFlag";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import { Button } from "@uprevit/ui/components/ui/button";
import { Checkbox } from "@uprevit/ui/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogTrigger,
} from "@uprevit/ui/components/ui/dialog";
import { AppDialogContent } from "@uprevit/ui/components/common/app-dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { ScrollArea } from "@uprevit/ui/components/ui/scroll-area";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@uprevit/ui/components/ui/tooltip";
import {
  COMPLIANCE_LANGUAGES,
  COMPLIANCE_LANGUAGE_GROUPS,
} from "@/data/compliance-languages";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { cn } from "@uprevit/ui/lib/utils";
import { Icon } from "@uprevit/ui/components/common/Icon";
import {
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  Delete02Icon,
  LanguageSquareIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

type ManageLanguagesDialogProps = {
  productId: string;
  selectedLanguages: Array<{
    code: string;
    name: string;
    country?: string;
  }>;
  isSubmitted?: boolean;
};

type LanguageRecord = {
  code: string;
  name: string;
  country?: string;
};

const sortLanguages = (languages: LanguageRecord[]) => {
  return [...languages].sort((a, b) => a.name.localeCompare(b.name));
};

export default function ManageLanguagesDialog({
  productId,
  selectedLanguages,
  isSubmitted = false,
}: ManageLanguagesDialogProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const { mutate: updateLanguages, isPending } = useUpdateProductTabData();

  const catalog = useMemo(() => {
    const entries = [...COMPLIANCE_LANGUAGES, ...selectedLanguages].map(
      (item) =>
        [
          item.code.toUpperCase(),
          {
            code: item.code.toUpperCase(),
            name: item.name,
            ...(item.country ? { country: item.country } : {}),
          },
        ] as const,
    );

    return new Map<string, LanguageRecord>(entries);
  }, [selectedLanguages]);

  const orderedLanguages = useMemo(() => {
    return sortLanguages(Array.from(catalog.values()));
  }, [catalog]);

  const filteredLanguages = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    if (!searchValue) return orderedLanguages;

    return orderedLanguages.filter((item) => {
      return [item.code, item.name, item.country]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(searchValue));
    });
  }, [orderedLanguages, search]);

  const selectedCodeSet = useMemo(
    () => new Set(selectedCodes),
    [selectedCodes],
  );
  const visibleCodes = filteredLanguages.map((item) => item.code);
  const allVisibleSelected =
    visibleCodes.length > 0 &&
    visibleCodes.every((code) => selectedCodeSet.has(code));

  const selectedLanguageItems = useMemo(() => {
    return sortLanguages(
      selectedCodes
        .map((code) => catalog.get(code))
        .filter((item): item is LanguageRecord => Boolean(item)),
    );
  }, [catalog, selectedCodes]);

  const selectedCountLabel = useMemo(() => {
    if (selectedLanguageItems.length === 0) {
      return "No languages selected";
    }

    return `${selectedLanguageItems.length} language${selectedLanguageItems.length === 1 ? "" : "s"} selected`;
  }, [selectedLanguageItems]);

  const toggleLanguage = (code: string) => {
    setSelectedCodes((current) => {
      const normalizedCode = code.toUpperCase();
      if (current.includes(normalizedCode)) {
        return current.filter((item) => item !== normalizedCode);
      }

      return [...current, normalizedCode];
    });
  };

  const handleSelectAllVisible = () => {
    setSelectedCodes((current) => {
      const currentSet = new Set(current);

      if (allVisibleSelected) {
        return current.filter((code) => !visibleCodes.includes(code));
      }

      visibleCodes.forEach((code) => {
        currentSet.add(code);
      });

      return Array.from(currentSet);
    });
  };

  const handleApplyGroup = (codes: string[]) => {
    setSelectedCodes((current) => {
      const next = new Set(current);

      codes.forEach((code) => {
        next.add(code.toUpperCase());
      });

      return Array.from(next);
    });
  };

  const handleSave = () => {
    const languages = sortLanguages(
      selectedCodes
        .map((code) => catalog.get(code))
        .filter((item): item is LanguageRecord => Boolean(item)),
    );

    updateLanguages(
      {
        id: productId,
        action: "update_languages_information",
        tab: "languages-information",
        data: { languages },
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update languages information:", error);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setSearch("");
      setSelectedCodes(
        selectedLanguages.map((item) => item.code.toUpperCase()),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <DialogTrigger asChild>
          <TooltipTrigger asChild>
            <Button size="sm" variant="secondary" disabled={isSubmitted}>
              <Icon icon={LanguageSquareIcon} />
              Manage Languages
            </Button>
          </TooltipTrigger>
        </DialogTrigger>
        <TooltipContent side="bottom">
          {isSubmitted
            ? "Submitted products can't be edited"
            : "Manage product languages for packaging and labeling"}
        </TooltipContent>
      </Tooltip>
      <AppDialogContent
        title="Manage Product Languages"
        description="Select individual languages or apply preset market language groups."
        variant="custom"
        className="sm:max-w-4xl"
        bodyClassName="overflow-hidden p-0"
        footer={
          <>
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isPending}
              >
                <Icon icon={Cancel01Icon} size={16} strokeWidth={2} />
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <Spinner />
              ) : (
                <Icon icon={CheckmarkCircle01Icon} size={16} strokeWidth={2} />
              )}
              {isPending ? "Saving..." : "Save Languages"}
            </Button>
          </>
        }
      >
        <div className="flex h-[560px] flex-col">
          <div className="grid min-h-0 flex-1 divide-x divide-border lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
            <section className="flex min-h-0 flex-col">
              <div className="flex h-10 shrink-0 items-center justify-between border-b bg-muted/30 px-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    Language Catalog
                  </p>
                  <InfoTooltip content="Search by code, language, or country. Click anywhere on a row to select or clear it." />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedCodes([])}
                    disabled={isPending || selectedLanguageItems.length === 0}
                  >
                    <Icon icon={Delete02Icon} size={16} strokeWidth={2} />
                    Clear All
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleSelectAllVisible}
                    disabled={!visibleCodes.length}
                  >
                    <Icon
                      icon={allVisibleSelected ? Cancel01Icon : Tick01Icon}
                      size={16}
                      strokeWidth={2}
                    />
                    {allVisibleSelected ? "Clear Visible" : "Select Visible"}
                  </Button>
                </div>
              </div>

              <div className="shrink-0 border-b px-3 py-2">
                <Input
                  id={`${id}-language-search`}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by code, language, or country"
                />
              </div>

              <ScrollArea className="min-h-0 flex-1">
                <div className="pb-1">
                  {filteredLanguages.length === 0 ? (
                    <div className="px-3 py-10 text-center text-sm text-muted-foreground">
                      No languages match your search.
                    </div>
                  ) : (
                    filteredLanguages.map((language, index) => {
                      const isSelected = selectedCodeSet.has(language.code);
                      const checkboxId = `${id}-${language.code.toLowerCase()}`;

                      return (
                        <label
                          key={language.code}
                          htmlFor={checkboxId}
                          className={cn(
                            "flex w-full cursor-pointer items-start gap-3 px-3 py-3 text-left transition-colors",
                            index !== filteredLanguages.length - 1 &&
                              "border-b border-border",
                            isSelected ? "bg-accent/50" : "hover:bg-accent/30",
                          )}
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={isSelected}
                            onCheckedChange={() =>
                              toggleLanguage(language.code)
                            }
                          />
                          <CountryFlag country={language.country} />
                          <div className="min-w-11 shrink-0 text-xs font-medium tracking-wide text-muted-foreground">
                            {language.code}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {language.name}
                            </p>
                            {language.country && (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {language.country}
                              </p>
                            )}
                          </div>
                          <Icon
                            icon={CheckmarkCircle01Icon}
                            size={16}
                            strokeWidth={2}
                            className={cn(
                              "shrink-0 transition-opacity",
                              isSelected
                                ? "text-primary opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </label>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </section>

            <section className="flex min-h-0 flex-col">
              <div className="flex h-10 shrink-0 items-center border-b bg-muted/30 px-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    Market Groups
                  </p>
                  <InfoTooltip content="Add common packaging and labeling sets for major launch regions." />
                </div>
              </div>

              <ScrollArea className="min-h-0 flex-1">
                <div className="pb-1">
                  {COMPLIANCE_LANGUAGE_GROUPS.map((group, index) => {
                    const selectedCount = group.languages.filter((code) =>
                      selectedCodeSet.has(code.toUpperCase()),
                    ).length;
                    const allGroupLanguagesSelected =
                      selectedCount === group.languages.length;

                    return (
                      <div
                        key={group.id}
                        className={cn(
                          "px-3 py-3 transition-colors",
                          allGroupLanguagesSelected && "bg-muted/25",
                          index !== COMPLIANCE_LANGUAGE_GROUPS.length - 1 &&
                            "border-b border-border",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground">
                                {group.name}
                              </p>
                              <InfoTooltip content={group.description} />
                            </div>
                            <p className="mt-1.5 text-xs text-muted-foreground w-[80%]">
                              {group.languages.join(", ")}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  size="icon-xs"
                                  variant="outline"
                                  onClick={() =>
                                    handleApplyGroup(group.languages)
                                  }
                                  disabled={allGroupLanguagesSelected}
                                  aria-label={
                                    allGroupLanguagesSelected
                                      ? `${group.name} languages added`
                                      : `Add ${group.name} languages`
                                  }
                                >
                                  <Icon
                                    icon={
                                      allGroupLanguagesSelected
                                        ? CheckmarkCircle01Icon
                                        : Add01Icon
                                    }
                                    size={14}
                                    strokeWidth={2}
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                {allGroupLanguagesSelected
                                  ? "All languages added"
                                  : "Add languages"}
                              </TooltipContent>
                            </Tooltip>
                            <p className="text-[11px] text-muted-foreground">
                              {selectedCount}/{group.languages.length} selected
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </section>
          </div>

          <div className="flex h-10 shrink-0 items-center border-t bg-muted/20 px-3">
            <p className="text-sm font-medium text-foreground">
              {selectedCountLabel}
            </p>
          </div>
        </div>
      </AppDialogContent>
    </Dialog>
  );
}
