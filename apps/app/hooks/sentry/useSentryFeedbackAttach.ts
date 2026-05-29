"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useRef, useState } from "react";

const FEEDBACK_FORM_TITLE = "Submit Feedback";

export function useSentryFeedbackAttach<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [feedback] = useState(() => Sentry.getFeedback());

  useEffect(() => {
    if (!feedback || !ref.current) return;
    return feedback.attachTo(ref.current, {
      formTitle: FEEDBACK_FORM_TITLE,
    });
  }, [feedback]);

  return ref;
}
