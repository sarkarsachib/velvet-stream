import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X, SlidersHorizontal, Film } from "lucide-react";
import { catalog, genres, titleHead } from "@/lib/catalog";
import { MovieCard } from "@/components/catalog-ui";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/discover")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
    genre: typeof s["genre"] === "string" ? s["genre"] : "",
    kind: typeof s["kind"] === "string" ? s["kind"] : "all",
  }),
  head: () =>
    titleHead(
      "Discover your next story",
      "Search NOCTRA’s original sample catalog by title, genre, movies, series and anime.",
    ),
  component: Discover,
});
function Discover() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const update = (patch: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...patch }, replace: true });
  const matches = catalog.filter(
    (t) =>
      (search.kind === "all" || t.kind === search.kind) &&
      (!search.genre || t.genre === search.genre) &&
      `${t.name} ${t.genre} ${t.synopsis}`.toLowerCase().includes(search.q.toLowerCase()),
  );
  return (
    <main className="page content-wrap">
      <div className="eyebrow mb-4">
        <SlidersHorizontal size={14} />
        YOUR NEXT OBSESSION
      </div>
      <h1>Discover something extraordinary.</h1>
      <p className="page-subtitle">New worlds. Unexpected stories. Find your kind of escape.</p>
      <div className="discovery-form">
        <div className="search-field">
          <Search size={21} />
          <input
            aria-label="Search movies, series and anime"
            placeholder="Search movies, series, anime…"
            value={search.q}
            onChange={(e) => update({ q: e.target.value })}
          />
          {search.q && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => update({ q: "" })}
              aria-label="Clear search"
            >
              <X />
            </Button>
          )}
        </div>
        <div className="filters">
          {["all", "Movie", "Series", "Anime"].map((kind) => (
            <Button
              key={kind}
              variant="filter"
              data-active={search.kind === kind}
              onClick={() => update({ kind })}
            >
              {kind === "all"
                ? "All titles"
                : kind === "Movie"
                  ? "Movies"
                  : kind === "Series"
                    ? "Series"
                    : "Anime"}
            </Button>
          ))}
          <span className="w-px bg-border mx-2" />
          {genres.map((genre) => (
            <Button
              key={genre}
              variant="filter"
              data-active={search.genre === genre}
              onClick={() => update({ genre: search.genre === genre ? "" : genre })}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>
      <div className="section-heading">
        <h2>
          {search.q
            ? "Search results"
            : search.genre
              ? search.genre
              : search.kind === "all"
                ? "The collection"
                : search.kind === "Movie"
                  ? "Movies"
                  : search.kind}
        </h2>
        <span className="section-action">
          {matches.length} {matches.length === 1 ? "title" : "titles"} · Sample catalog
        </span>
      </div>
      {matches.length ? (
        <div className="catalog-grid">
          {matches.map((t) => (
            <MovieCard key={t.id} title={t} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Film size={40} />
          <h2>No stories found. Yet.</h2>
          <p>Try another title or explore a different genre.</p>
          <Button variant="glass" onClick={() => update({ q: "", genre: "", kind: "all" })}>
            Reset filters
          </Button>
        </div>
      )}
    </main>
  );
}
