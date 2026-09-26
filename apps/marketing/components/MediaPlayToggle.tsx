import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";

export function MediaPlayToggle({
  playing,
  onToggle,
  label,
}: {
  playing: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={onToggle}
      aria-label={`${playing ? "Pause" : "Play"} ${label}`}
      className="absolute right-3 bottom-3 z-10 bg-background/80 backdrop-blur-sm"
    >
      <Icon icon={playing ? PauseIcon : PlayIcon} size={16} strokeWidth={2} />
    </Button>
  );
}
