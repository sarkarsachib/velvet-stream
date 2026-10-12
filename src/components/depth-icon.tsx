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
  Play,
  Info,
  Sparkles,
  Film,
  SlidersHorizontal,
} from "lucide-react";
import homeAsset from "@/assets/icon-home.webp";
import searchAsset from "@/assets/icon-search.webp";
import categoriesAsset from "@/assets/icon-categories.webp";
import bookmarkAsset from "@/assets/icon-bookmark.webp";
import settingsAsset from "@/assets/icon-settings.webp";
import shuffleAsset from "@/assets/icon-shuffle.webp";
import rocketAsset from "@/assets/icon-rocket.webp";
import ghostAsset from "@/assets/icon-ghost.webp";
import swordsAsset from "@/assets/icon-swords.webp";
import dramaAsset from "@/assets/icon-drama.webp";
import orbitAsset from "@/assets/icon-orbit.webp";
import clapperboardAsset from "@/assets/icon-clapperboard.webp";
import playAsset from "@/assets/icon-play.webp";
import infoAsset from "@/assets/icon-info.webp";
import sparklesAsset from "@/assets/icon-sparkles.webp";
import filmAsset from "@/assets/icon-film.webp";
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
const assets = new Map<LucideIcon, string>([
  [Home, homeAsset],
  [Search, searchAsset],
  [Layers3, categoriesAsset],
  [Bookmark, bookmarkAsset],
  [Settings2, settingsAsset],
  [Shuffle, shuffleAsset],
  [Rocket, rocketAsset],
  [Ghost, ghostAsset],
  [Swords, swordsAsset],
  [Drama, dramaAsset],
  [Orbit, orbitAsset],
  [Clapperboard, clapperboardAsset],
  [Play, playAsset],
  [Info, infoAsset],
  [Sparkles, sparklesAsset],
  [Film, filmAsset],
  [SlidersHorizontal, settingsAsset],
]);
export function DepthIcon({
  icon: Icon,
  tone = "violet",
}: {
  icon: LucideIcon;
  tone?: "violet" | "cyan";
}) {
  const asset = assets.get(Icon);
  return (
    <span className={`depth-icon depth-${tone}`} aria-hidden="true">
      {asset ? <img src={asset} width={144} height={144} alt="" decoding="async" /> : <Icon />}
    </span>
  );
}
