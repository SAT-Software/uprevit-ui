"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { GlobalSearchDialog } from "./GlobalSearchDialog";

const GlobalSearchContext = createContext<() => void>(() => {});

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      event.preventDefault();
      setOpen((current) => !current);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <GlobalSearchContext.Provider value={() => setOpen(true)}>
      {children}
      <GlobalSearchDialog open={open} onOpenChange={setOpen} />
    </GlobalSearchContext.Provider>
  );
}

export const useOpenGlobalSearch = () => useContext(GlobalSearchContext);
