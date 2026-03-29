import { Button, buttonVariants } from "@/components/ui/button";
import { useScrollTo } from "@/lib/scroll-context";
import Link from "next/link";

export default function HeroSection() {
  const scrollTo = useScrollTo();

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[800px] h-[800px]">
      <div className="flex items-center mb-4 py-1 px-2 rounded-full border text-xs font-semibold bg-white dark:bg-black text-foreground shadow-lg shadow-foreground">
        <div className="mr-2 h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold">For The Future</span>
      </div>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-bold text-center tracking-tighter">
          Your QMS, Digitized <br />
          <span className="text-muted-foreground/70 tracking-tighter">
            Your Labeling, Validated
          </span>
        </h1>
        <div className="flex flex-col gap-1 items-center mt-4">
          <p className="text-xl font-normal text-black dark:text-white text-center tracking-tight leading-tight">
            The unified cloud-based platform for total labeling governance
          </p>

          <p className="w-[80%] text-center text-muted-foreground dark:text-muted-foreground/60">
            Forget document-level risk: Streamline your global labeling process
            with a unified, intuitive platform that manages labels at the data
            level. Built by compliance experts, designed for Medical devices.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={() => scrollTo("demo")} variant="outline" size="lg">
            Learn More
          </Button>
          <Link
            href="/contact"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
