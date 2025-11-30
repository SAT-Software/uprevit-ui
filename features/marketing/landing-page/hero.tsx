import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center h-[calc(100vh)]">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold text-center">
          Master Your Labels:{" "}
          <span className="text-muted-foreground/60">
            Master Your Compliance
          </span>
        </h1>
        <div className="flex flex-col gap-1 items-center mt-4">
          <p className="text-xl font-normal text-black text-center">
            The unified cloud-based platform for total labeling governance
          </p>

          <p className="w-[80%] text-center text-muted-foreground">
            Forget document-level risk: Streamline your global labeling process
            with a unified, intuitive platform that manages labels at the data
            level. Built by compliance experts, designed for everyone.
          </p>
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Button variant="outline">Learn More</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </div>
  );
}
