import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 h-screen">
      <h1 className="text-6xl font-bold text-center">
        AI-Powered Labeling Documentation Platform for Medical Devices
      </h1>
      <p className="w-[60%] text-center">
        Create, manage and track medical device labeling documentation with
        ease. Collaborate seamlessly across teams and effortlessly track your
        departments, projects and products - all in one place.
      </p>
      <Link href="/dashboard">
        <Button variant="default" className="w-fit mt-4">
          Get Started
        </Button>
      </Link>
    </div>
  );
}
