import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Flame,
  Sparkles,
  Clock3,
  Gem,
  Orbit,
  Tv,
  Rocket,
  Swords,
  Drama,
  Ghost,
  Clapperboard,
  Film,
} from "lucide-react";
import { catalog, featured, genres, titleHead } from "@/lib/catalog";
import { Hero, Rail } from "@/components/catalog-ui";
import { AdSlot } from "@/components/ad-slot";
import { DepthIcon } from "@/components/depth-icon";
import { SurpriseMe } from "@/components/library-actions";
import { useProgress } from "@/lib/progress";
export const Route = createFileRoute("/")({
  head: () =>
    titleHead(
      "A different kind of movie night",
      "Discover original demo films, anime and extraordinary stories. Explore NOCTRA without accounts or interruptions.",
    ),
  component: Index,
});
function Index() {
  const progress = useProgress();
  const continuing = catalog.filter(
    (t) =>
      progress[t.id] &&
      (progress[t.id]?.time || 0) > 0 &&
      (progress[t.id]?.time || 0) < (progress[t.id]?.duration || 0) - 10,
  );
  const icons = [Rocket, Ghost, Swords, Clapperboard, Drama, Orbit];
  return (
    <main>
      <Hero title={featured} slides={[featured,catalog[0],catalog[3]]} />
      <div className="content-wrap">
        <Rail name="Trending Now" icon={<Flame />} titles={catalog} />
        <AdSlot placement="home" />
        {continuing.length > 0 && (
          <Rail name="Continue Watching" icon={<Clock3 />} titles={continuing} />
        )}
        <Rail
          name="Hidden Gems"
          icon={<Gem />}
          titles={[catalog[3], catalog[4], catalog[0], catalog[5], catalog[1], catalog[2]]}
        />
        <section className="section">
          <div className="section-heading">
            <h2>
              <Orbit />
              Find your universe
            </h2>
            <SurpriseMe/>
          </div>
          <div className="genre-grid">
            {genres.map((g, i) => {
              const Icon = icons[i] || Orbit;
              return (
                <Link
                  key={g}
                  to="/discover"
                  search={{ q: "", genre: g, kind: "all" }}
                  className="genre-tile"
                >
                  <DepthIcon icon={Icon} tone="cyan"/>
                  {g}
                </Link>
              );
            })}
          </div>
        </section>
        <Rail
          name="Anime Universe"
          icon={<Sparkles />}
          titles={catalog.filter((t) => t.kind === "Anime")}
          kind="Anime"
        />
        <AdSlot placement="between-rails" />
        <Rail name="Recently Added" icon={<Film />} titles={[...catalog].reverse()} />
        <Rail
          name="Popular Series"
          icon={<Tv />}
          titles={catalog.filter((t) => t.kind === "Series")}
          kind="Series"
        />
      </div>
    </main>
  );
}
