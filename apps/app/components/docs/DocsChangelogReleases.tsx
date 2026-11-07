"use client";

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { DocsPage } from "fumadocs-ui/layouts/docs/page";
import { Button } from "@uprevit/ui/components/ui/button";

const PAGE_SIZE = 10;

const VisibleReleasesContext = createContext<{
  visible: number;
  setVisible: (visible: number) => void;
}>({ visible: Infinity, setVisible: () => {} });

export function DocsChangelogPage({
  toc = [],
  ...props
}: ComponentProps<typeof DocsPage>) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  let releases = 0;
  const visibleToc = toc.filter(
    (item) => (item.depth <= 2 ? ++releases : releases) <= visible,
  );

  return (
    <VisibleReleasesContext.Provider value={{ visible, setVisible }}>
      <DocsPage toc={visibleToc} {...props} />
    </VisibleReleasesContext.Provider>
  );
}

export function DocsChangelogReleases({ children }: { children: ReactNode }) {
  const releases = Children.toArray(children).filter(isValidElement);
  const { visible, setVisible } = useContext(VisibleReleasesContext);
  const [linkedId, setLinkedId] = useState<string | null>(null);

  useEffect(() => {
    const showLinkedRelease = () => {
      const hash = window.location.hash.slice(1);
      let id = hash;
      try {
        id = decodeURIComponent(hash);
      } catch {}
      if (!id || document.getElementById(id)) return;
      setVisible(Infinity);
      setLinkedId(id);
    };
    showLinkedRelease();
    window.addEventListener("hashchange", showLinkedRelease);
    return () => window.removeEventListener("hashchange", showLinkedRelease);
  }, [setVisible]);

  useEffect(() => {
    if (!linkedId) return;
    const timeout = setTimeout(() => {
      document.getElementById(linkedId)?.scrollIntoView();
      setLinkedId(null);
    }, 100);
    return () => clearTimeout(timeout);
  }, [linkedId]);

  return (
    <>
      {releases.slice(0, visible)}
      {releases.length > visible ? (
        <div className="not-prose flex justify-center">
          <Button
            variant="outline"
            onClick={() => setVisible(visible + PAGE_SIZE)}
          >
            Show older releases
          </Button>
        </div>
      ) : null}
    </>
  );
}
