"use client";

import { useId, useMemo, useState } from "react";

import { CountryFlag } from "@/components/common/CountryFlag";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  COMPLIANCE_LANGUAGES,
  COMPLIANCE_LANGUAGE_GROUPS,
} from "@/data/compliance-languages";
import { useUpdateProductTabData } from "@/hooks/product/useUpdateProductTabData";
import { cn } from "@/lib/utils";
import {
  PiCheckCircleDuotone,
  PiGlobeDuotone,
  PiPlusCircleDuotone,
  PiXCircleDuotone,
} from "react-icons/pi";

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
    const entries = [...COMPLIANCE_LANGUAGES, ...selectedLanguages].map((item) => [
      item.code.toUpperCase(),
      {
        code: item.code.toUpperCase(),
        name: item.name,
        ...(item.country ? { country: item.country } : {}),
      },
    ] as const);

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

  const selectedCodeSet = useMemo(() => new Set(selectedCodes), [selectedCodes]);
  const visibleCodes = filteredLanguages.map((item) => item.code);
  const allVisibleSelected =
    visibleCodes.length > 0 && visibleCodes.every((code) => selectedCodeSet.has(code));

  const selectedLanguageItems = useMemo(() => {
    return sortLanguages(
      selectedCodes
        .map((code) => catalog.get(code))
        .filter((item): item is LanguageRecord => Boolean(item))
    );
  }, [catalog, selectedCodes]);

  const selectedCountLabel = useMemo(() => {
    if (selectedLanguageItems.length === 0) {
      return "No languages selected";
    }

    return `${selectedLanguageItems.length} language${selectedLanguageItems.length === 1 ? "" : "s"} selected`;
  }, [selectedLanguageItems]);

  const selectedPreview = useMemo(() => {
    const previewCodes = selectedLanguageItems.slice(0, 6).map((item) => item.code);
    const remainingCount = selectedLanguageItems.length - previewCodes.length;

    if (previewCodes.length === 0) {
      return "Choose individual languages or apply a market group.";
    }

    return `${previewCodes.join(", ")}${remainingCount > 0 ? ` +${remainingCount} more` : ""}`;
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
        .filter((item): item is LanguageRecord => Boolean(item))
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
      }
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setSearch("");
      setSelectedCodes(selectedLanguages.map((item) => item.code.toUpperCase()));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="flex items-center gap-2"
          disabled={isSubmitted}
        >
          <PiPlusCircleDuotone className="h-4 w-4" />
          Manage Languages
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl [&>button:last-child]:hidden">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="flex w-full items-center justify-between border-b bg-accent px-4 py-4 text-sm">
            <div className="flex items-center gap-2">
              <PiGlobeDuotone className="h-4 w-4" />
              <span>Manage Product Languages</span>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Select individual languages or apply preset market language groups.
        </DialogDescription>

        <div className="grid gap-4 overflow-hidden p-4 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
          <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-background">
            <div className="flex flex-col gap-3 border-b bg-muted/30 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Language Catalog</p>
                <p className="text-xs text-muted-foreground">
                  Search by code, language, or country. Click anywhere on a row to select or clear it.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSelectAllVisible}
                disabled={!visibleCodes.length}
              >
                {allVisibleSelected ? "Clear Visible" : "Select Visible"}
              </Button>
            </div>

            <div className="border-b px-4 py-3">
              <Input
                id={`${id}-language-search`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by code, language, or country"
              />
            </div>

            <ScrollArea className="h-[420px] overflow-hidden">
              <div className="pb-1">
                {filteredLanguages.length === 0 ? (
                  <div className="px-4 py-10 text-center text-sm text-muted-foreground">
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
                          "flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors",
                          index !== filteredLanguages.length - 1 && "border-b border-border",
                          isSelected ? "bg-accent/50" : "hover:bg-accent/30"
                        )}
                      >
                        <div className="mt-0.5">
                          <Checkbox
                            id={checkboxId}
                            checked={isSelected}
                            onCheckedChange={() => toggleLanguage(language.code)}
                          />
                        </div>
                        <CountryFlag country={language.country} className="mt-0.5" />
                        <div className="min-w-[2.75rem] shrink-0 pt-0.5 text-xs font-medium tracking-wide text-muted-foreground">
                          {language.code}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{language.name}</p>
                          {language.country && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {language.country}
                            </p>
                          )}
                        </div>
                        <PiCheckCircleDuotone
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0 transition-opacity",
                            isSelected ? "text-primary opacity-100" : "opacity-0"
                          )}
                        />
                      </label>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border bg-background">
            <div className="space-y-1 border-b bg-primary/5 px-4 py-4">
              <p className="text-sm font-medium text-foreground">Market Groups</p>
              <p className="text-xs text-muted-foreground">
                Add common packaging and labeling sets for major launch regions.
              </p>
            </div>

            <ScrollArea className="h-[420px] overflow-hidden">
              <div className="pb-1">
                {COMPLIANCE_LANGUAGE_GROUPS.map((group, index) => {
                  const selectedCount = group.languages.filter((code) =>
                    selectedCodeSet.has(code.toUpperCase())
                  ).length;
                  const allGroupLanguagesSelected =
                    selectedCount === group.languages.length;

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        "px-4 py-3 transition-colors",
                        allGroupLanguagesSelected && "bg-muted/25",
                        index !== COMPLIANCE_LANGUAGE_GROUPS.length - 1 &&
                          "border-b border-border"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{group.name}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {group.description}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {group.languages.join(", ")}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplyGroup(group.languages)}
                            disabled={allGroupLanguagesSelected}
                          >
                            {allGroupLanguagesSelected ? "Added" : "Add"}
                          </Button>
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

        <div className="border-t bg-muted/20 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 rounded-md bg-primary/10 p-1 text-primary">
                <PiCheckCircleDuotone className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{selectedCountLabel}</p>
                <p className="truncate text-xs text-muted-foreground">{selectedPreview}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{visibleCodes.length} visible in current search</p>
          </div>
        </div>

        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setSelectedCodes([])}
            disabled={isPending || selectedLanguageItems.length === 0}
          >
            Clear All
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm" disabled={isPending}>
              <PiXCircleDuotone />
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
            {isPending ? <Spinner /> : <PiCheckCircleDuotone />}
            {isPending ? "Saving..." : "Save Languages"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
