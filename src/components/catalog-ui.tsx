import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Play, Star, Info, Sparkles } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { type Title } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
export function MovieCard({ title, progress }: { title: Title; progress?: number | undefined }) {
  return (
    <Link
      to="/title/$id"
      params={{ id: title.id }}
      className="movie-card"
      aria-label={`More about ${title.name}`}
    >
      <div className="poster">
        <img
          src={title.image}
          alt={`${title.name} — original demo artwork`}
          loading="lazy"
          width={400}
          height={600}
        />
        <div className="poster-top">
          <span className="poster-badge">{title.kind === "Anime" ? "ANIME" : "DEMO"}</span>
          {title.fresh && <span className="poster-badge new">NEW</span>}
        </div>
        <span className="poster-title">{title.name}</span>
        <span className="card-play">
          <Play size={20} fill="currentColor" />
        </span>
        {progress !== undefined && (
          <span className="progress-track">
            <progress value={progress} max={100} aria-label="Playback progress" />
          </span>
        )}
      </div>
      <h3 className="card-name">{title.name}</h3>
      <div className="card-meta">
        <span>
          {title.year} <span className="mx-1">·</span> {title.genre}
        </span>
        <span className="score">
          <Star size={10} />
          {title.rating}
        </span>
      </div>
    </Link>
  );
}
export function Rail({
  name,
  icon,
  titles,
  genre = "",
  kind = "all",
  children,
}: {
  name: string;
  icon?: ReactNode;
  titles: Title[];
  genre?: string;
  kind?: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useProgress();
  function scroll(dir: number) {
    ref.current?.scrollBy({
      left: dir * ref.current.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <section className="section">
      <div className="section-heading">
        <h2>
          {icon}
          {name}
        </h2>
        <div className="rail-controls">
          <Link to="/discover" search={{ q: "", kind, genre }} className="section-action">
            View all <ArrowRight size={13} />
          </Link>
          <Button
            className="arrow-control"
            variant="ghost"
            size="icon"
            aria-label={`Previous ${name}`}
            onClick={() => scroll(-1)}
          >
            <ArrowLeft />
          </Button>
          <Button
            className="arrow-control"
            variant="ghost"
            size="icon"
            aria-label={`Next ${name}`}
            onClick={() => scroll(1)}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      {titles.length ? (
        <div className="rail" ref={ref}>
          {titles.map((t) => (
            <MovieCard
              key={t.id}
              title={t}
              progress={
                name === "Continue Watching" && progress[t.id]
                  ? ((progress[t.id]?.time || 0) / (progress[t.id]?.duration || 1)) * 100
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        children
      )}
    </section>
  );
}
export function Hero({ title, detail = false }: { title: Title; detail?: boolean }) {
  return (
    <section className="hero">
      <img
        className="hero-art"
        src={title.cover || title.image}
        alt={`${title.name} original concept artwork`}
        width={1920}
        height={1024}
        fetchPriority="high"
      />
      <div className="hero-copy">
        <div className="eyebrow">
          <Sparkles size={13} />
          {detail ? "NOCTRA COLLECTION" : "TONIGHT’S SPOTLIGHT"}
          <span className="text-muted-foreground ml-2">ORIGINAL DEMO</span>
        </div>
        <h1 className="hero-title">
          {title.id === "beyond-the-horizon" ? (
            <>
              Beyond the<span>Horizon</span>
            </>
          ) : (
            title.name
          )}
        </h1>
        <div className="metadata">
          <span className="rating">
            <Star size={12} fill="currentColor" />
            {title.rating}
            <span className="text-muted-foreground font-normal">sample rating</span>
          </span>
          <span>{title.year}</span>
          <span className="cert">16+</span>
          <span>{title.duration}</span>
          <span className="cert">4K concept</span>
        </div>
        <p className="hero-synopsis">{title.synopsis}</p>
        <div className="hero-buttons">
          <Button variant="cinematic" asChild>
            <Link to="/watch/$id" params={{ id: title.id }}>
              <Play fill="currentColor" />
              Play preview
            </Link>
          </Button>
          <Button variant="glass" asChild>
            {detail ? (
              <Link to="/discover" search={{ q: "", kind: "all", genre: "" }}>
                <Info />
                Explore more
              </Link>
            ) : (
              <Link to="/title/$id" params={{ id: title.id }}>
                <Info />
                More info
              </Link>
            )}
          </Button>
        </div>
      </div>
      <div className="hero-bottom">
        <span className="hero-note">
          <span className="h-1 w-1 rounded-full bg-ice" />
          {title.genre} <span className="mx-1">·</span> {title.kind} <span className="mx-1">·</span>{" "}
          Original sample story
        </span>
        <div className="slide-indicators" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
