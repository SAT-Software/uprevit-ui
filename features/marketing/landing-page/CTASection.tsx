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
            <div className="w-full bg-foreground dark:bg-background rounded-[14px] h-120 text-background dark:text-foreground p-10 gap-20 flex items-center justify-between">
              <div className="w-full flex flex-col items-start justify-between">
                <h2 className="text-5xl font-bold">
                  Master Your Labeling Compliance{" "}
                  <span className="text-accent/60 dark:text-foreground/40">
                    Today
                  </span>
                </h2>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-foreground/70 dark:text-foreground/80"
                  >
                    Learn More
                  </Button>
                  <Button size="lg">Get Started</Button>
                </div>
              </div>
              <div className="w-full flex justify-center md:justify-end">
                <div className="relative w-[300px] sm:w-[360px] md:w-[420px] lg:w-[480px]">
                  <div className="absolute -bottom-10 -left-6 h-40 w-56 rounded-full bg-accent/30 blur-3xl" />
                  <div
                    className="relative overflow-hidden rounded-2xl border border-border/40 bg-background/5 shadow-[0_45px_110px_-70px_rgba(0,0,0,0.95)]"
                    style={{
                      transform:
                        "perspective(1400px) rotateX(30deg) rotateY(-10deg) rotateZ(-18deg)",
                      transformOrigin: "center",
                    }}
                  >
                    <Image
                      src="/features/feature-3.png"
                      alt="Uprevit compliance workspace preview"
                      width={1200}
                      height={800}
                      className="h-auto w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(255,255,255,0.08),_transparent_55%)]" />
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
