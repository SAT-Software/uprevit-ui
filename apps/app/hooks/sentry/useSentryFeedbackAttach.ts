"use client";

import * as Sentry from "@sentry/nextjs";
import { SENTRY_FEEDBACK_FORM_TITLE } from "@/lib/sentry/feedbackLabels";
import { useEffect, useRef, useState } from "react";

export function useSentryFeedbackAttach<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [feedback] = useState(() => Sentry.getFeedback());

  useEffect(() => {
    if (!feedback || !ref.current) return;
    return feedback.attachTo(ref.current, {
      formTitle: SENTRY_FEEDBACK_FORM_TITLE,
    });
  }, [feedback]);

  return ref;
}
