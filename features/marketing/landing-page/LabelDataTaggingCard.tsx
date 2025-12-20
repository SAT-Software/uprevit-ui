import { cn } from "@/lib/utils";
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

interface LabelDataTaggingCardProps {
  className?: string;
}

export function LabelDataTaggingCard({ className }: LabelDataTaggingCardProps) {
  return (
    <div
      className={cn(
        "h-full group bg-background p-8 rounded-xl border border-border flex flex-col relative overflow-hidden",
        className
      )}
    >
      <div className="mb-6 z-10 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Label data tagging
        </h3>
        <p className="text-muted-foreground w-full">
          Generate perfect label samples and mock-ups by tagging existing,
          approved master label elements.
        </p>
      </div>

      <div className="p-1 bg-accent w-[90%] rounded-2xl border border-border ml-20">
        <div className="flex-1 w-full bg-background rounded-[15px] border border-border relative overflow-hidden p-6 flex items-center justify-center">
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
              <div className="relative w-100 h-100 shadow-lg rounded-md overflow-hidden bg-white max-h-[300px]">
                <Image
                  src="/MDR_Label.webp"
                  alt="MDR Label"
                  fill
                  className="object-contain"
                />

                <div className="absolute top-8 left-6 w-36 h-9 border border-transparent bg-transparent group-hover:border-blue-500 group-hover:bg-blue-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-400" />
                <div className="absolute top-18 left-14 w-24 h-5.5 border bg-transparent border-transparent group-hover:border-red-500 group-hover:bg-red-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-500" />
                <div className="absolute top-28 left-14 w-18 h-5.5 border bg-transparent border-transparent group-hover:border-red-500 group-hover:bg-red-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-600" />
                <div className="absolute bottom-3.5 right-10 w-9.5 h-9.5 border border-transparent bg-transparent group-hover:border-neutral-500 group-hover:bg-neutral-500/10 rounded sm:rounded-md transition-all duration-300 ease-in-out delay-700" />
              </div>
            </div>

            <div className="absolute top-2 right-2 bg-accent/40 backdrop-blur-sm border border-border p-2 rounded-lg text-xs shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 rounded border border-border bg-accent group-hover:border-red-500 group-hover:bg-red-500/20 transition-all ease-in-out duration-300 delay-75" />
                <span className="text-foreground text-[10px]">
                  Variable Data
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 rounded border border-border bg-accent group-hover:border-blue-500 group-hover:bg-blue-500/20 transition-all ease-in-out duration-300 delay-75" />
                <span className="text-foreground text-[10px]">Family Data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 rounded border border-border bg-accent group-hover:border-neutral-500 group-hover:bg-neutral-500/20 transition-all ease-in-out duration-300 delay-75" />
                <span className="text-foreground text-[10px]">UDI Barcode</span>
              </div>
            </div>

            {/* Toolbar - Right Side */}
            <div className="absolute top-22 right-2 flex flex-col gap-1 p-1 bg-background border border-border rounded-lg shadow-sm">
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiPencilSimpleDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiHouseDuotone size={16} />
              </button>
              <button className="p-1 hover:bg-accent rounded-xl text-foreground/70 hover:text-foreground transition-colors">
                <PiImageDuotone size={16} />
              </button>
              <button className="p-1 rounded-xl text-foreground/70 bg-accent group-hover:text-blue-500 group-hover:bg-blue-500/10 transition-all ease-in-out duration-300 delay-100">
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
