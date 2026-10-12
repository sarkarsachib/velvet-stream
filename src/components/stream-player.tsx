import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Film, LoaderCircle, AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Title, type MediaSource } from "@/lib/catalog";
import { readProgress, saveProgress } from "@/lib/progress";
export function StreamPlayer({ title, parentId }: { title: Title; parentId?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<MediaSource | undefined>(title.source);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [speed, setSpeed] = useState("1");
  const position = useRef<{ time: number; resume: boolean } | undefined>(undefined);
  const retry = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (status !== "loading" || !source) return;
    const timeout = setTimeout(() => setStatus("error"), 20000);
    return () => clearTimeout(timeout);
  }, [status, source, attempt]);
  useEffect(() => {
    if (status === "error") retry.current?.focus();
  }, [status]);
  useEffect(() => {
    const v = video.current;
    if (!v || !source) return;
    let disposed = false;
    let cleanup = () => {};
    setStatus("loading");
    const load = async () => {
      try {
        if (source.type === "hls" && !v.canPlayType("application/vnd.apple.mpegurl")) {
          const { default: Hls } = await import("hls.js");
          if (disposed) return;
          if (!Hls.isSupported()) {
            setStatus("error");
            return;
          }
          const hls = new Hls();
          hls.loadSource(source.url);
          hls.attachMedia(v);
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) setStatus("error");
          });
          cleanup = () => hls.destroy();
        } else {
          v.src = source.url;
          v.load();
        }
      } catch {
        if (!disposed) setStatus("error");
      }
    };
    void load();
    return () => {
      disposed = true;
      saveProgress(title.id, v.currentTime, v.duration);
      cleanup();
      v.removeAttribute("src");
      v.load();
    };
  }, [source, attempt, title.id]);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const persist = () => saveProgress(title.id, v.currentTime, v.duration);
    window.addEventListener("pagehide", persist);
    return () => {
      persist();
      window.removeEventListener("pagehide", persist);
    };
  }, [title.id, source]);
  const lastSaved = useRef(0);
  if (!source)
    return (
      <div className="player-shell">
        <img className="player-poster" src={title.cover || title.image} alt="" />
        <div className="player-preview">
          <div className="preview-icon">
            <Film size={28} />
          </div>
          <span className="eyebrow justify-center">AUTHORIZED MEDIA PLACEHOLDER</span>
          <h2>This story is still a preview.</h2>
          <p>
            {title.name} is original sample content. No playable media is connected. A verified,
            authorized video source is required before streaming can begin.
          </p>
          <Button asChild variant="glass">
            <Link to="/title/$id" params={{ id: parentId || title.id }}>
              <ArrowLeft />
              Back to title
            </Link>
          </Button>
        </div>
      </div>
    );
  return (
    <>
      <div className="player-shell">
        <video
          ref={video}
          className="video-element"
          controls
          playsInline
          preload="metadata"
          poster={title.cover || title.image}
          aria-label={`${title.name} player`}
          id="noctra-video"
          tabIndex={0}
          onLoadedMetadata={() => {
            const v = video.current;
            if (!v) return;
            const p = readProgress()[title.id];
            const switchPosition = position.current;
            if (switchPosition && Number.isFinite(v.duration)) {
              v.currentTime = Math.min(switchPosition.time, Math.max(0, v.duration - 0.1));
              position.current = undefined;
              if (switchPosition.resume) void v.play().catch(() => {});
            } else if (p && p.time < v.duration - 10) v.currentTime = p.time;
            v.playbackRate = Number(speed);
            setStatus("ready");
          }}
          onCanPlay={() => setStatus("ready")}
          onWaiting={() => setStatus("loading")}
          onPlaying={() => setStatus("ready")}
          onError={() => setStatus("error")}
          onPause={() => {
            const v = video.current;
            if (v) saveProgress(title.id, v.currentTime, v.duration);
          }}
          onTimeUpdate={() => {
            const v = video.current;
            if (v && Date.now() - lastSaved.current > 5000) {
              saveProgress(title.id, v.currentTime, v.duration);
              lastSaved.current = Date.now();
            }
          }}
          onKeyDown={(e) => {
            const v = video.current;
            if (!v || e.target !== v) return;
            if (e.key === " " || e.key === "k") {
              e.preventDefault();
              if (v.paused) void v.play().catch(() => setStatus("error"));
              else v.pause();
            }
            if (e.key === "ArrowRight" && Number.isFinite(v.duration)) {
              e.preventDefault();
              v.currentTime = Math.min(v.duration, v.currentTime + 5);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              v.currentTime = Math.max(0, v.currentTime - 5);
            }
            if (e.key === "m") v.muted = !v.muted;
            if (e.key === "f") void v.requestFullscreen?.().catch(() => {});
          }}
        >
          {source.subtitles?.map((s) => (
            <track
              key={s.language}
              kind="subtitles"
              src={s.src}
              srcLang={s.language}
              label={s.label}
            />
          ))}
        </video>
        {status === "loading" && (
          <div className="player-status pointer-events-none" role="status">
            <LoaderCircle className="animate-spin mx-auto text-primary" />
            <p className="text-sm mt-4">Preparing your stream…</p>
          </div>
        )}
        {status === "error" && (
          <div className="player-status" role="alert">
            <AlertCircle className="mx-auto text-destructive" />
            <h2 className="text-lg mt-4">This stream couldn’t be loaded.</h2>
            <p className="text-muted-foreground text-sm my-3">
              The media source may be unavailable. Please try again.
            </p>
            <Button ref={retry} onClick={() => setAttempt((x) => x + 1)} variant="cinematic">
              <RotateCcw />
              Try again
            </Button>
          </div>
        )}
      </div>
      <div className="player-tools">
        <span>Your playback progress stays on this device.</span>
        <div className="flex gap-3">
          <label>
            Speed{" "}
            <select
              aria-controls="noctra-video"
              value={speed}
              onChange={(e) => {
                setSpeed(e.target.value);
                if (video.current) video.current.playbackRate = Number(e.target.value);
              }}
            >
              {["0.5", "0.75", "1", "1.25", "1.5", "2"].map((s) => (
                <option key={s} value={s}>
                  {s}×
                </option>
              ))}
            </select>
          </label>
          {title.source?.qualities?.length ? (
            <label>
              Quality{" "}
              <select
                aria-controls="noctra-video"
                value={source.url}
                onChange={(e) => {
                  const v = video.current;
                  if (v) position.current = { time: v.currentTime, resume: !v.paused };
                  if (e.target.value === title.source?.url) {
                    setSource(title.source);
                    return;
                  }
                  const q = title.source?.qualities?.find((x) => x.url === e.target.value);
                  if (q) setSource({ ...q, subtitles: source.subtitles });
                }}
              >
                <option value={title.source.url}>Auto</option>
                {title.source.qualities.map((q) => (
                  <option key={q.url} value={q.url}>
                    {q.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </div>
    </>
  );
}
