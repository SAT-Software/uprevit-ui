import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[850px] h-[850px]">
      <div className="flex items-center mb-4 py-1 px-2 rounded-full border text-xs font-semibold bg-white text-foreground shadow-lg shadow-foreground">
        <div className="mr-2 h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold">For The Future</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold text-center tracking-tighter">
          Master Your Labels:{" "}
          <span className="text-muted-foreground/60 tracking-tighter">
            Master Your Compliance
          </span>
        </h1>
        <div className="flex flex-col gap-1 items-center mt-4">
          <p className="text-xl font-normal text-black text-center tracking-tight leading-tight">
            The unified cloud-based platform for total labeling governance
          </p>

          <p className="w-[80%] text-center text-muted-foreground">
            Forget document-level risk: Streamline your global labeling process
            with a unified, intuitive platform that manages labels at the data
            level. Built by compliance experts, designed for everyone.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
          <Button size="lg">Get Started</Button>
        </div>
      </div>
    </div>
  );
}
