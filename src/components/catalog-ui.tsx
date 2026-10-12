import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Play, Star, Info, Sparkles } from "lucide-react";
import { useRef, useState, useEffect, type ReactNode, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { type Title } from "@/lib/catalog";
import { useProgress } from "@/lib/progress";
import { DepthIcon } from "@/components/depth-icon";
import { SaveTitle } from "@/components/library-actions";
export function MovieCard({ title, progress }: { title: Title; progress?: number | undefined }) {
  const [loaded, setLoaded] = useState(false),
    [failed, setFailed] = useState(false);
  const poster = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete) {
      setLoaded(true);
      setFailed(image.current.naturalWidth === 0);
    }
  }, [title.image]);
  function tilt(e: PointerEvent<HTMLAnchorElement>) {
    if (
      e.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset["motion"] === "calm"
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    poster.current?.style.setProperty(
      "--tilt-x",
      `${(-(e.clientY - rect.top - rect.height / 2) / rect.height) * 9}deg`,
    );
    poster.current?.style.setProperty(
      "--tilt-y",
      `${((e.clientX - rect.left - rect.width / 2) / rect.width) * 12}deg`,
    );
  }
  function reset() {
    poster.current?.style.setProperty("--tilt-x", "0deg");
    poster.current?.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <article className="movie-card">
      <Link
        to="/title/$id"
        params={{ id: title.id }}
        viewTransition
        aria-label={`More about ${title.name}`}
        onPointerMove={tilt}
        onPointerLeave={reset}
      >
        <div className="poster" ref={poster} data-loaded={loaded}>
          <img
            ref={image}
            src={title.image}
            alt={`${title.name} — original demo artwork`}
            loading="lazy"
            width={400}
            height={600}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(true);
              setFailed(true);
            }}
            className={failed ? "hidden" : ""}
          />
          {failed && <span className="artwork-fallback">Artwork unavailable</span>}
          <div className="poster-top">
            <span className="poster-badge">DEMO</span>
            {title.fresh && <span className="poster-badge new">NEW</span>}
          </div>
          <span className="poster-title">{title.name}</span>
          <span className="card-play">
            <DepthIcon icon={Play} />
          </span>
          <span className="poster-reveal">
            {title.duration} · {title.language}
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
      <SaveTitle id={title.id} compact />
    </article>
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
  const [edges, setEdges] = useState({ left: false, right: false });
  const progress = useProgress();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () =>
      setEdges({
        left: el.scrollLeft > 4,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [titles]);
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
          <span className="rail-heading-icon">{icon}</span>
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
            disabled={!edges.left}
            onClick={() => scroll(-1)}
          >
            <ArrowLeft />
          </Button>
          <Button
            className="arrow-control"
            variant="ghost"
            size="icon"
            aria-label={`Next ${name}`}
            disabled={!edges.right}
            onClick={() => scroll(1)}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      {titles.length ? (
        <div className="rail-shell" data-left={edges.left} data-right={edges.right}>
          <div className="rail" ref={ref} tabIndex={0} aria-label={`${name} titles`}>
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
        </div>
      ) : (
        children
      )}
    </section>
  );
}
export function Hero({
  title,
  detail = false,
  slides,
}: {
  title: Title;
  detail?: boolean;
  slides?: Title[];
}) {
  const [selected, setSelected] = useState(title.id);
  const active = slides?.find((t) => t.id === selected) || title;
  const hero = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true),
    [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (
      !slides?.length ||
      !visible ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset["motion"] === "calm"
    )
      return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setSelected((id) => {
        const i = slides.findIndex((t) => t.id === id);
        return slides[(i + 1) % slides.length]?.id || title.id;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [slides, visible, paused, title.id]);
  function parallax(e: PointerEvent<HTMLElement>) {
    if (
      e.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset["motion"] === "calm"
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty(
      "--parallax-x",
      `${((e.clientX - rect.left - rect.width / 2) / rect.width) * 12}px`,
    );
    e.currentTarget.style.setProperty(
      "--parallax-y",
      `${((e.clientY - rect.top - rect.height / 2) / rect.height) * 8}px`,
    );
  }
  return (
    <section
      ref={hero}
      className="hero"
      onPointerMove={parallax}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        hero.current?.style.setProperty("--parallax-x", "0px");
        hero.current?.style.setProperty("--parallax-y", "0px");
      }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      {(slides || [title]).map((t) => (
        <img
          key={t.id}
          className="hero-art"
          data-active={active.id === t.id}
          src={t.cover || t.image}
          alt={active.id === t.id ? `${t.name} original concept artwork` : ""}
          width={1920}
          height={1024}
          loading={t.id === title.id ? "eager" : "lazy"}
          fetchPriority={t.id === title.id ? "high" : "low"}
        />
      ))}
      <div className="hero-copy" key={active.id}>
        <div className="eyebrow">
          <DepthIcon icon={Sparkles} tone="cyan" />
          {detail ? "NOCTRA COLLECTION" : "TONIGHT’S SPOTLIGHT"}
          <span className="text-muted-foreground ml-2">ORIGINAL DEMO</span>
        </div>
        <h1 className="hero-title">
          {active.id === "beyond-the-horizon" ? (
            <>
              Beyond the<span>Horizon</span>
            </>
          ) : (
            active.name
          )}
        </h1>
        <div className="metadata">
          <span className="rating">
            <Star size={12} fill="currentColor" />
            {active.rating}
            <span className="text-muted-foreground font-normal">sample rating</span>
          </span>
          <span>{active.year}</span>
          <span>{active.duration}</span>
          <span className="cert">{active.language}</span>
        </div>
        <p className="hero-synopsis">{active.synopsis}</p>
        <div className="hero-buttons">
          <Button variant="cinematic" asChild>
            <Link to="/watch/$id" params={{ id: active.id }}>
              <DepthIcon icon={Play} />
              {active.source ? "Play" : "Play preview"}
            </Link>
          </Button>
          <Button variant="glass" asChild>
            <Link to="/title/$id" params={{ id: active.id }} viewTransition>
              <DepthIcon icon={Info} tone="cyan" />
              Details
            </Link>
          </Button>
          {detail && <SaveTitle id={active.id} />}
        </div>
      </div>
      <div className="hero-bottom">
        <span className="hero-note">
          <span className="h-1 w-1 rounded-full bg-ice" />
          {active.genre} <span className="mx-1">·</span> {active.kind}{" "}
          <span className="mx-1">·</span> Original sample story
        </span>
        {slides && (
          <div className="spotlight-controls">
            {slides.map((t, i) => (
              <Button
                key={t.id}
                variant="ghost"
                className="spotlight-dot"
                aria-label={`Spotlight ${t.name}`}
                aria-pressed={active.id === t.id}
                onClick={() => {
                  setSelected(t.id);
                  setPaused(true);
                }}
              >
                <span />
                <small>0{i + 1}</small>
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              aria-label={paused ? "Resume spotlight rotation" : "Pause spotlight rotation"}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play size={12} /> : <span className="pause-symbol" />}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
