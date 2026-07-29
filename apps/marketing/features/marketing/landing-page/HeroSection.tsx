import { Button } from "@uprevit/ui/components/ui/button";
import { useScrollTo } from "@/lib/scroll-context";
import { ArrowDown01Icon, Mail01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import Link from "next/link";

export default function HeroSection() {
  const scrollTo = useScrollTo();

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[650px] md:min-h-[800px] h-[400px] md:h-[800px]">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-center tracking-tighter">
          Your QMS, Digitized <br />
          <span className="text-muted-foreground/70 tracking-tighter">
            Your Labeling, Validated
          </span>
        </h1>
        <div className="flex flex-col gap-1 items-center mt-4">
          <p className="text-base md:text-lg lg:text-xl font-normal text-foreground text-center tracking-tight leading-tight">
            The unified cloud-based platform for total labeling governance
          </p>

          <p className="w-[80%] text-xs md:text-sm lg:text-base text-center text-muted-foreground/80 dark:text-muted-foreground/80">
            Forget document-level risk: Streamline your global labeling process
            with a unified, intuitive platform that manages labels at the data
            level. Built by compliance experts, designed for Medical devices.
          </p>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={() => scrollTo("demo")} variant="outline" size="lg">
            Learn More
            <Icon icon={ArrowDown01Icon} size={16} strokeWidth={2} />
          </Button>
          <Button asChild size="lg">
            <Link href="/contact">
              Contact Us
              <Icon icon={Mail01Icon} size={16} strokeWidth={2} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
