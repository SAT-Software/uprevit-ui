import { cn } from "@uprevit/ui/lib/utils";
import Image from "next/image";
import {
  PiBoundingBoxDuotone,
  PiGearSixDuotone,
  PiHouseDuotone,
  PiImageDuotone,
  PiPencilSimpleDuotone,
  PiMagnifyingGlassDuotone,
  PiTrashDuotone,
  PiStackDuotone,
  PiEyeDuotone,
  PiFloppyDiskDuotone,
} from "react-icons/pi";
import { useTouchCardActivation } from "./useTouchCardActivation";

interface LabelDataTaggingCardProps {
  className?: string;
}

export function LabelDataTaggingCard({ className }: LabelDataTaggingCardProps) {
  const {
    isTouchActive,
    activateTouch,
    deactivateTouch,
    scheduleTouchDeactivate,
  } = useTouchCardActivation();

  return (
    <div
      onTouchStart={activateTouch}
      onTouchEnd={scheduleTouchDeactivate}
      onTouchCancel={deactivateTouch}
      data-active={isTouchActive ? "true" : undefined}
      className={cn(
        "h-125 lg:h-full group bg-background p-4 md:p-4 lg:p-8 rounded-xl border border-border flex flex-col relative overflow-hidden",
        className,
      )}
    >
      <div className="mb-6 z-10 w-full max-w-lg">
        <h3 className="text-base md:text-base lg:text-lg font-semibold text-foreground mb-2">
          Label data tagging
        </h3>
        <p className="text-xs md:text-sm lg:text-base text-muted-foreground w-full">
          Generate perfect label samples and mock-ups by tagging existing,
          approved master label elements.
        </p>
      </div>

      <div className="p-1 bg-accent w-full lg:w-[90%] rounded-2xl border border-border ml-0 lg:ml-20">
        <div className="flex-1 w-full bg-background rounded-[15px] border border-border relative overflow-hidden p-3 md:p-4 lg:p-6 flex items-center justify-center">
          <div
            className="absolute inset-0 text-border/50"
            style={{
              backgroundImage:
                "repeating-linear-gradient(35deg, transparent, transparent 5px, currentColor 5px, currentColor 6px)",
            }}
          />
          <div className="w-full h-full relative flex flex-col border py-2 rounded-xl bg-background">
            <span className="text-xs font-semibold text-muted-foreground mb-2 block ml-4">
              Shelf Carton Label
            </span>

            <div className="flex-1 relative flex items-start justify-start">
              {/* Image Container */}
              <div className="relative ml-4 w-full max-w-[280px] sm:max-w-[320px] lg:w-100 lg:h-100 aspect-square overflow-hidden max-h-[300px]">
                <Image
                  src="/MDR_Label.webp"
                  alt="MDR Label"
                  fill
                  className="object-contain drop-shadow-sm dark:brightness-[0.82] dark:contrast-[0.92]"
                />
                <div className="pointer-events-none absolute inset-0 hidden dark:block bg-gradient-to-b from-slate-950/10 via-slate-950/18 to-slate-950/22" />

                <div className="absolute w-0 h-0 hidden sm:block sm:top-12 sm:left-1 sm:w-36 sm:h-7 border border-transparent bg-transparent group-hover:border-blue-500 group-hover:bg-blue-500/10 group-data-[active=true]:border-blue-500 group-data-[active=true]:bg-blue-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-400" />
                <div className="absolute w-0 h-0 hidden sm:block   sm:top-20 sm:left-8.5 sm:w-22 sm:h-5.5 border bg-transparent border-transparent group-hover:border-red-500 group-hover:bg-red-500/10 group-data-[active=true]:border-red-500 group-data-[active=true]:bg-red-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-500" />
                <div className="absolute w-0 h-0 hidden sm:block   sm:top-29 sm:left-8.5 sm:w-16 sm:h-5.5 border bg-transparent border-transparent group-hover:border-red-500 group-hover:bg-red-500/10 group-data-[active=true]:border-red-500 group-data-[active=true]:bg-red-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-600" />
                <div className="absolute w-0 h-0 hidden sm:block  sm:bottom-7 sm:right-4.5 sm:w-9 sm:h-9 border border-transparent bg-transparent group-hover:border-yellow-500 group-hover:bg-yellow-500/10 group-data-[active=true]:border-yellow-500 group-data-[active=true]:bg-yellow-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-700" />
              </div>
            </div>

            <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 bg-accent/40 backdrop-blur-sm border border-border p-1.5 lg:p-2 rounded-lg text-xs shadow-sm flex flex-col gap-1.5 lg:gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[0.2rem] border border-border bg-accent group-hover:border-red-500 group-hover:bg-red-500/20 group-data-[active=true]:border-red-500 group-data-[active=true]:bg-red-500/20 transition-all ease-in-out duration-300 delay-75" />
                <span className="text-foreground text-[10px]">
                  Variable Data
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[0.2rem] border border-border bg-accent group-hover:border-blue-500 group-hover:bg-blue-500/20 group-data-[active=true]:border-blue-500 group-data-[active=true]:bg-blue-500/20 transition-all ease-in-out duration-300 delay-75" />
                <span className="text-foreground text-[10px]">
                  Constant Data
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[0.2rem] border border-border bg-accent group-hover:border-yellow-500 group-hover:bg-yellow-500/20 group-data-[active=true]:border-yellow-500 group-data-[active=true]:bg-yellow-500/20 transition-all ease-in-out duration-300 delay-75" />
                <span className="text-foreground text-[10px]">UDI Barcode</span>
              </div>
            </div>

            {/* Toolbar - Right Side */}
            <div className="absolute top-20 right-1.5 lg:top-22 lg:right-2 flex flex-col gap-1 p-1 bg-background border border-border rounded-lg shadow-sm">
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiPencilSimpleDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiHouseDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiImageDuotone size={16} />
              </button>
              <button className="p-1 rounded-xl text-foreground/70 bg-accent group-hover:text-blue-500 group-hover:bg-blue-500/10 group-data-[active=true]:text-blue-500 group-data-[active=true]:bg-blue-500/10 transition-all ease-in-out duration-300 delay-100">
                <PiBoundingBoxDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiMagnifyingGlassDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiStackDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiEyeDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiFloppyDiskDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiTrashDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiGearSixDuotone size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
