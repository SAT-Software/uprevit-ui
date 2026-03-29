import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DecorativeCornerCircleCustom } from "@/components/ui/DecorativeCornerCircle";

export default function CTASection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="relative w-full">
        <div className="max-w-6xl mx-auto relative">
          {/* Bottom-left corner (large size, custom rotation) */}
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-14 -left-16"
            rotation={224}
            size="lg"
          />
          {/* Bottom-right corner (large size, custom rotation) */}
          <DecorativeCornerCircleCustom
            positionClassName="-bottom-14 -right-16"
            rotation={135}
            size="lg"
          />

          <div className="p-1 bg-accent rounded-2xl max-w-6xl mx-auto border border-border">
            <div className="w-full bg-foreground dark:bg-background rounded-[14px] h-120 text-background dark:text-foreground p-10 gap-10 flex items-center justify-between overflow-hidden">
              <div className="w-full min-w-[30%] flex flex-col items-start justify-between">
                <h2 className="text-5xl font-bold">
                  Master Your Labeling Compliance{" "}
                  <span className="text-accent/60 dark:text-foreground/40">
                    Today
                  </span>
                </h2>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button size="lg">Get Started</Button>
                </div>
              </div>
              <div className="w-full flex justify-center md:justify-end">
                <div className="relative w-[560px] sm:w-[640px] md:w-[720px] lg:w-[900px] -mr-10">
                  {/* <div className="absolute -bottom-10 -left-6 h-40 w-56 rounded-full bg-accent/30 blur-3xl" /> */}
                  <div
                    className="relative top-25"
                    style={{
                      transform:
                        "perspective(900px) rotateX(20deg) rotateY(-5deg) rotateZ(5deg) translateX(-20px)",
                      transformOrigin: "center right",
                    }}
                  >
                    <div className="absolute -left-25 -top-25 overflow-hidden rounded-2xl border border-neutral-800/40 bg-background/5 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.45)]">
                      <Image
                        src="/uprevit-demo2.png"
                        alt="Uprevit compliance workspace preview"
                        width={1200}
                        height={800}
                        className="h-auto w-full object-cover"
                      />
                      {/* Top fade */}
                      <div className="absolute top-0 inset-x-0 h-50 bg-gradient-to-b from-foreground dark:from-background to-transparent z-10 pointer-events-none" />
                      {/* Left fade */}
                      <div className="absolute left-0 inset-y-0 w-50 bg-gradient-to-r from-foreground dark:from-background to-transparent z-10 pointer-events-none" />
                      {/* Bottom fade */}
                      <div className="absolute bottom-5 inset-x-0 h-78 bg-gradient-to-t from-foreground dark:from-background to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.08),_transparent_55%)]" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.05),_transparent_55%)]" />
                    </div>
                    <div className="relative z-10 overflow-hidden rounded-2xl border border-neutral-800/50 bg-background/5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
                      <Image
                        src="/Dashboard-Dark.png"
                        alt="Uprevit compliance workspace preview"
                        width={1200}
                        height={800}
                        className="h-auto w-full object-cover"
                      />
                      {/* Top fade */}
                      <div className="absolute top-0 inset-x-0 h-50 bg-gradient-to-b from-foreground dark:from-background to-transparent z-10 pointer-events-none" />
                      {/* Left fade */}
                      <div className="absolute left-0 inset-y-0 w-50 bg-gradient-to-r from-foreground dark:from-background to-transparent z-10 pointer-events-none" />
                      {/* Bottom fade */}
                      <div className="absolute bottom-5 inset-x-0 h-78 bg-gradient-to-t from-foreground dark:from-background to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.08),_transparent_55%)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
