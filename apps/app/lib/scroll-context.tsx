"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type RefObject,
} from "react";

type ScrollSections = Record<string, RefObject<HTMLDivElement | null>>;

interface ScrollContextValue {
  registerSection: (key: string) => RefObject<HTMLDivElement | null>;
  scrollTo: (key: string) => void;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const sectionsRef = useRef<ScrollSections>({});

  const registerSection = useCallback((key: string) => {
    if (!sectionsRef.current[key]) {
      sectionsRef.current[key] = { current: null };
    }
    return sectionsRef.current[key];
  }, []);

  const scrollTo = useCallback((key: string) => {
    sectionsRef.current[key]?.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  return (
    <ScrollContext value={{ registerSection, scrollTo }}>
      {children}
    </ScrollContext>
  );
}

export function useScrollTo() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollTo must be used within a ScrollProvider");
  }
  return context.scrollTo;
}

export function useScrollSection(key: string) {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScrollSection must be used within a ScrollProvider");
  }
  return context.registerSection(key);
}
