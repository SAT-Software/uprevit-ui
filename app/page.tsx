"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "react-oidc-context";

export default function Home() {
	const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p>Loading...</p>
      </div>
    );
  }

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
            Go to Dashboard
          </Button>
        </Link>
    </div>
  );
}
