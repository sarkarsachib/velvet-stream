import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X, SlidersHorizontal, Film } from "lucide-react";
import { catalog, genres, moods, filterCatalog, titleHead } from "@/lib/catalog";
import { MovieCard } from "@/components/catalog-ui";
import { Button } from "@/components/ui/button";
import { DepthIcon } from "@/components/depth-icon";
import { SurpriseMe } from "@/components/library-actions";
export const Route = createFileRoute("/discover")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
    genre: typeof s["genre"] === "string" ? s["genre"] : "",
    kind: typeof s["kind"] === "string" ? s["kind"] : "all",
    ...(typeof s["year"] === "string" ? { year: s["year"] } : {}),
    ...(typeof s["language"] === "string" ? { language: s["language"] } : {}),
    ...(typeof s["mood"] === "string" ? { mood: s["mood"] } : {}),
  }),
  head: () =>
    titleHead(
      "Discover your next story",
      "Search NOCTRA’s sample collection by title, genre, year, type, language or mood.",
    ),
  component: Discover,
});
function Discover() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const update = (patch: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...patch }, replace: true, resetScroll: false });
  const reset = () =>
    void navigate({ search: { q: "", genre: "", kind: "all" }, replace: true, resetScroll: false });
  const matches = filterCatalog(search);
  const years = [...new Set(catalog.map((t) => t.year))];
  const languages = [...new Set(catalog.flatMap((t) => (t.language ? [t.language] : [])))];
  return (
    <main className="page content-wrap">
      <div className="eyebrow mb-4">
        <DepthIcon icon={SlidersHorizontal} tone="cyan" />
        YOUR NEXT OBSESSION
      </div>
      <div className="section-heading">
        <div className="min-w-0">
          <h1>Discover something extraordinary.</h1>
          <p className="page-subtitle">New worlds. Unexpected stories. Find your kind of escape.</p>
        </div>
        <SurpriseMe />
      </div>
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
              aria-pressed={search.kind === kind}
              data-active={search.kind === kind}
              onClick={() => update({ kind })}
            >
              {kind === "all" ? "All titles" : kind === "Movie" ? "Movies" : kind}
            </Button>
          ))}
          <span className="filter-divider" />
          {genres.map((genre) => (
            <Button
              key={genre}
              variant="filter"
              aria-pressed={search.genre === genre}
              data-active={search.genre === genre}
              onClick={() => update({ genre: search.genre === genre ? "" : genre })}
            >
              {genre}
            </Button>
          ))}
        </div>
        <div className="filter-details">
          <label className="filter-select">
            Year
            <select
              aria-label="Filter by year"
              value={search.year || ""}
              onChange={(e) => update({ year: e.target.value })}
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-select">
            Language
            <select
              aria-label="Filter by language"
              value={search.language || ""}
              onChange={(e) => update({ language: e.target.value })}
            >
              <option value="">All languages</option>
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <div className="mood-chips">
            <span>Tonight’s mood</span>
            {moods.map((mood) => (
              <Button
                key={mood}
                size="sm"
                variant="filter"
                aria-pressed={search.mood === mood}
                data-active={search.mood === mood}
                onClick={() => update({ mood: search.mood === mood ? "" : mood })}
              >
                {mood}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="section-heading">
        <h2>{search.q ? "Search results" : search.genre || "The collection"}</h2>
        <span className="section-action" role="status">
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
          <DepthIcon icon={Film} />
          <h2>No stories found. Yet.</h2>
          <p>Try another title or explore a different genre.</p>
          <Button variant="glass" onClick={reset}>
            Reset filters
          </Button>
        </div>
      )}
    </main>
  );
}
