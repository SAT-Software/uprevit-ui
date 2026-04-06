"use client";

import * as React from "react";

const TOUCH_ACTIVE_DURATION = 900;

export function useTouchCardActivation() {
  const [isTouchActive, setIsTouchActive] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const clearTouchTimeout = React.useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => clearTouchTimeout();
  }, [clearTouchTimeout]);

  const activateTouch = React.useCallback(() => {
    clearTouchTimeout();
    setIsTouchActive(true);
  }, [clearTouchTimeout]);

  const deactivateTouch = React.useCallback(() => {
    clearTouchTimeout();
    setIsTouchActive(false);
  }, [clearTouchTimeout]);

  const scheduleTouchDeactivate = React.useCallback(() => {
    clearTouchTimeout();
    timeoutRef.current = window.setTimeout(() => {
      setIsTouchActive(false);
      timeoutRef.current = null;
    }, TOUCH_ACTIVE_DURATION);
  }, [clearTouchTimeout]);

  return {
    isTouchActive,
    activateTouch,
    deactivateTouch,
    scheduleTouchDeactivate,
  };
}
