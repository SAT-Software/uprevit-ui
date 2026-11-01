"use client";

import { ErrorState } from "@/components/common/ErrorState";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorState
      variant="panel"
      icon={AlertCircleIcon}
      title="Something went wrong"
      description="This page failed to load. Please try again."
      onRetry={reset}
      fill
    />
  );
}
