import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <div className="w-full mt-40 mb-20">
      <div className="relative w-full">
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
            <div className="w-full">
              TODO: Here we need to add some image from the app
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-border/60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-border/60" />
      </div>
    </div>
  );
}
