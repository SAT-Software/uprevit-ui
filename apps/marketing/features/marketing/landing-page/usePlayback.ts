import * as React from "react";
import { useInView } from "motion/react";

export function usePlayback(reduceMotion: boolean, shownMs = 8000, hiddenMs = 900) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    let id: ReturnType<typeof setTimeout>;
    const play = (next: boolean) => {
      setShown(next);
      id = setTimeout(() => play(!next), next ? shownMs : hiddenMs);
    };
    play(true);
    return () => clearTimeout(id);
  }, [inView, reduceMotion, shownMs, hiddenMs]);

  return [ref, reduceMotion || shown] as const;
}
