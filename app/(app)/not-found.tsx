"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PiArrowLeft, PiHouseLine } from "react-icons/pi";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-8xl font-bold text-foreground mb-2">404</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Page Not Found
          </h1>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been removed, renamed, or didn&apos;t exist in the first
            place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Button asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <PiHouseLine className="text-base" />
              Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <PiArrowLeft className="text-base" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
