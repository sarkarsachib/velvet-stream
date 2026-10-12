import {
  type LucideIcon,
  Home,
  Search,
  Layers3,
  Bookmark,
  Settings2,
  Shuffle,
  Rocket,
  Ghost,
  Swords,
  Drama,
  Orbit,
  Clapperboard,
} from "lucide-react";
export const depthIcons = {
  home: Home,
  search: Search,
  categories: Layers3,
  list: Bookmark,
  settings: Settings2,
  shuffle: Shuffle,
  scifi: Rocket,
  thriller: Ghost,
  anime: Swords,
  drama: Drama,
  fantasy: Orbit,
  adventure: Clapperboard,
};
export function DepthIcon({
  icon: Icon,
  tone = "violet",
}: {
  icon: LucideIcon;
  tone?: "violet" | "cyan";
}) {
  return (
    <span className={`depth-icon depth-${tone}`} aria-hidden="true">
      <span className="depth-icon-back">
        <Icon />
      </span>
      <Icon className="depth-icon-front" />
      <span className="depth-icon-shine" />
    </span>
  );
}
