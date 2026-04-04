"use client";

import * as Flags from "country-flag-icons/react/3x2";
import { PiGlobeDuotone } from "react-icons/pi";

import { COUNTRIES } from "@/data/countries";
import { cn } from "@uprevit/ui/lib/utils";

type CountryFlagProps = {
  country?: string;
  className?: string;
  iconClassName?: string;
};

const COUNTRY_CODE_BY_NAME = new Map(
  COUNTRIES.map(({ name, code }) => [name.trim().toLowerCase(), code])
);

export function CountryFlag({
  country,
  className,
  iconClassName,
}: CountryFlagProps) {
  const countryCode = country
    ? COUNTRY_CODE_BY_NAME.get(country.trim().toLowerCase())
    : undefined;
  const FlagComponent = countryCode
    ? Flags[countryCode as keyof typeof Flags]
    : null;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-4 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-border/70 bg-muted/40",
        className
      )}
    >
      {FlagComponent ? (
        <FlagComponent className="h-full w-full" />
      ) : (
        <PiGlobeDuotone
          className={cn("h-3 w-3 text-muted-foreground", iconClassName)}
        />
      )}
    </span>
  );
}
