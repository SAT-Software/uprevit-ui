import Image from "next/image";
import { cn } from "@uprevit/ui/lib/utils";

type UprevitLogoProps = {
  className?: string;
};

export function UprevitLogo({ className }: UprevitLogoProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-square size-8 shrink-0 items-center justify-center",
        className,
      )}
    >
      <Image
        src="/uprevit-logo-black.svg"
        alt="Uprevit logo"
        fill
        className="object-contain p-0.5 dark:hidden"
      />
      <Image
        src="/uprevit-logo-white.svg"
        alt="Uprevit logo"
        fill
        className="hidden object-contain p-0.5 dark:block"
      />
    </div>
  );
}
