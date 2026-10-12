import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Film, LoaderCircle, AlertCircle, RotateCcw, ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, Minimize, PictureInPicture2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthIcon } from "@/components/depth-icon";
import { type Title, type MediaSource } from "@/lib/catalog";
import { readProgress, saveProgress } from "@/lib/progress";

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const value = Math.floor(seconds);
  return value >= 3600 ? `${Math.floor(value / 3600)}:${String(Math.floor(value / 60) % 60).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}` : `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
interface BrowserAudioTrack { id: string; label: string; language: string; enabled: boolean }
type AudioVideo = HTMLVideoElement & { audioTracks?: ArrayLike<BrowserAudioTrack> & EventTarget; webkitEnterFullscreen?: () => void };

export function StreamPlayer({ title, parentId }: { title: Title; parentId?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const shell = useRef<HTMLDivElement>(null);
  const retry = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const switchPosition = useRef<{ time: number; playing: boolean } | undefined>(undefined);
  const lastSaved = useRef(0);
  const [source, setSource] = useState<MediaSource | undefined>(title.source);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState<[number, number][]>([]);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [visible, setVisible] = useState(true);
  const [settings, setSettings] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [pip, setPip] = useState(false);
  const [canPip, setCanPip] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [caption, setCaption] = useState("off");
  const [audioTracks, setAudioTracks] = useState<BrowserAudioTrack[]>([]);
  const [audio, setAudio] = useState("0");
  const [hoverTime, setHoverTime] = useState<number | undefined>(undefined);
  const [notice, setNotice] = useState("");
  const finiteDuration = Number.isFinite(duration) && duration > 0;

  function reveal() {
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      const v = video.current;
      const focusedControl = shell.current?.querySelector(".custom-controls")?.contains(document.activeElement);
      if (v && !v.paused && !focusedControl && !settings) setVisible(false);
    }, 3000);
  }
  useEffect(() => () => clearTimeout(hideTimer.current), []);
  useEffect(() => {
    setCanPip(Boolean(document.pictureInPictureEnabled && video.current?.requestPictureInPicture));
    setCanFullscreen(Boolean(document.fullscreenEnabled || (video.current as AudioVideo | null)?.webkitEnterFullscreen));
    const update = () => setFullscreen(document.fullscreenElement === shell.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, [source]);
  useEffect(() => {
    if (status !== "loading" || !source) return;
    const timer = setTimeout(() => setStatus("error"), 20000);
    return () => clearTimeout(timer);
  }, [status, source, attempt]);
  useEffect(() => { if (status === "error") retry.current?.focus(); }, [status]);
  useEffect(() => {
    const v = video.current;
    if (!v || !source) return;
    let disposed = false;
    let cleanup = () => {};
    setStatus("loading"); setPlaying(false); setBuffered([]); setAudioTracks([]); setCaption("off");
    async function load() {
      try {
        if (source?.type === "hls" && !v?.canPlayType("application/vnd.apple.mpegurl")) {
          const { default: Hls } = await import("hls.js");
          if (disposed || !v || !source) return;
          if (!Hls.isSupported()) { setStatus("error"); return; }
          const hls = new Hls();
          hls.attachMedia(v); hls.loadSource(source.url);
          hls.on(Hls.Events.ERROR, (_, data) => { if (data.fatal && !disposed) setStatus("error"); });
          hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
            if (!disposed) setAudioTracks(data.audioTracks.map((t, i) => ({ id: String(i), label: t.name, language: t.lang || "", enabled: i === hls.audioTrack })));
          });
          const selectAudio = (event: Event) => { hls.audioTrack = Number((event as CustomEvent<string>).detail); };
          v.addEventListener("noctra-audio", selectAudio);
          cleanup = () => { v.removeEventListener("noctra-audio", selectAudio); hls.destroy(); };
        } else if (v && source) { v.src = source.url; v.load(); }
      } catch { if (!disposed) setStatus("error"); }
    }
    void load();
    const persist = () => saveProgress(title.id, v.currentTime, v.duration);
    window.addEventListener("pagehide", persist);
    return () => {
      disposed = true; persist(); window.removeEventListener("pagehide", persist); cleanup(); v.removeAttribute("src"); v.load();
    };
  }, [source, attempt, title.id]);

  function sync() {
    const v = video.current;
    if (!v) return;
    setTime(v.currentTime); setDuration(v.duration);
    const ranges: [number, number][] = [];
    for (let i = 0; i < v.buffered.length; i++) ranges.push([v.buffered.start(i), v.buffered.end(i)]);
    setBuffered(ranges);
  }
  async function togglePlay() {
    const v = video.current;
    if (!v) return;
    if (!v.paused) v.pause();
    else try { await v.play(); setNotice(""); } catch { setNotice("Playback was not started. Please try again."); }
    reveal();
  }
  function seek(value: number) {
    const v = video.current;
    if (v && Number.isFinite(v.duration)) { v.currentTime = Math.max(0, Math.min(v.duration, value)); setTime(v.currentTime); }
    reveal();
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (shell.current?.requestFullscreen && document.fullscreenEnabled) await shell.current.requestFullscreen();
      else (video.current as AudioVideo | null)?.webkitEnterFullscreen?.();
    } catch { setNotice("Fullscreen is unavailable in this browser."); }
  }
  async function togglePip() {
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await video.current?.requestPictureInPicture();
    } catch { setNotice("Picture-in-picture is unavailable for this video."); }
  }
  function keys(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLButtonElement || settings) return;
    const v = video.current;
    if (!v) return;
    const key = e.key.toLowerCase();
    if ([" ", "k", "arrowright", "arrowleft", "arrowup", "arrowdown", "m", "f", "i"].includes(key)) e.preventDefault();
    if (key === " " || key === "k") void togglePlay();
    if (key === "arrowright") seek(v.currentTime + 5);
    if (key === "arrowleft") seek(v.currentTime - 5);
    if (key === "arrowup" || key === "arrowdown") v.volume = Math.max(0, Math.min(1, v.volume + (key === "arrowup" ? .05 : -.05)));
    if (key === "m") v.muted = !v.muted;
    if (key === "f") void toggleFullscreen();
    if (key === "i" && canPip) void togglePip();
    reveal();
  }
  function changeSource(url: string) {
    const v = video.current;
    if (v) switchPosition.current = { time: v.currentTime, playing: !v.paused };
    const original = title.source;
    const quality = original?.qualities?.find(q => q.url === url);
    if (url === original?.url) setSource(original);
    else if (quality) setSource({ ...quality, subtitles: original?.subtitles });
  }
  if (!source) return <div className="player-shell player-empty">
    <img className="player-poster" src={title.cover || title.image} alt="" />
    <div className="player-preview"><DepthIcon icon={Film} /><span className="eyebrow justify-center">AUTHORIZED MEDIA PLACEHOLDER</span>
      <h2>This story is still a preview.</h2><p>{title.name} is original sample content. No playable media is connected. A verified, authorized video source is required before streaming can begin.</p>
      <Button asChild variant="glass"><Link to="/title/$id" params={{ id: parentId || title.id }}><ArrowLeft />Back to title</Link></Button>
    </div>
  </div>;

  return <>
    <div ref={shell} className="player-shell custom-player" tabIndex={0} role="region" aria-label={`${title.name} video player`} data-controls={visible || !playing || settings || status !== "ready"} onKeyDown={keys} onPointerMove={reveal} onPointerDown={reveal} onFocusCapture={reveal} onBlurCapture={reveal}>
      <video ref={video} className="video-element" playsInline preload="metadata" controlsList="nodownload" onContextMenu={e => e.preventDefault()} poster={title.cover || title.image} aria-label={title.name} id="noctra-video" onClick={() => void togglePlay()}
        onLoadedMetadata={() => {
          const v = video.current; if (!v) return;
          const saved = readProgress()[title.id]; const position = switchPosition.current;
          if (position && Number.isFinite(v.duration)) { v.currentTime = Math.min(position.time, Math.max(0, v.duration - .1)); switchPosition.current = undefined; if (position.playing) void v.play().catch(() => setNotice("Press play to continue.")); }
          else if (saved && saved.time < v.duration - 10) v.currentTime = saved.time;
          v.playbackRate = Number(speed); sync();
          const tracks = (v as AudioVideo).audioTracks;
          if (tracks) { const available = Array.from(tracks); setAudioTracks(available); setAudio(String(available.findIndex(t => t.enabled))); }
        }}
        onCanPlay={() => { setStatus("ready"); sync(); }} onWaiting={() => setStatus("loading")} onSeeking={() => setStatus("loading")} onSeeked={() => { setStatus("ready"); sync(); }}
        onPlaying={() => { setPlaying(true); setStatus("ready"); reveal(); }} onPlay={() => setPlaying(true)} onPause={() => { setPlaying(false); setVisible(true); const v = video.current; if (v) saveProgress(title.id, v.currentTime, v.duration); }} onEnded={() => { setPlaying(false); setVisible(true); }}
        onError={() => setStatus("error")} onDurationChange={sync} onProgress={sync}
        onVolumeChange={() => { const v = video.current; if (v) { setVolume(v.volume); setMuted(v.muted); } }}
        onEnterPictureInPicture={() => setPip(true)} onLeavePictureInPicture={() => setPip(false)}
        onTimeUpdate={() => { sync(); const v = video.current; if (v && Date.now() - lastSaved.current > 5000) { saveProgress(title.id, v.currentTime, v.duration); lastSaved.current = Date.now(); } }}>
        {source.subtitles?.map(s => <track key={s.language} kind="subtitles" src={s.src} srcLang={s.language} label={s.label} />)}
      </video>
      {!playing && status === "ready" && <Button variant="ghost" className="player-center-play" aria-label="Play video" onClick={() => void togglePlay()}><DepthIcon icon={Play} /></Button>}
      {status === "loading" && <div className="player-buffering" role="status"><LoaderCircle className="animate-spin" /><span>Buffering…</span></div>}
      {status === "error" && <div className="player-status" role="alert"><AlertCircle className="mx-auto text-destructive" /><h2>This stream couldn’t be loaded.</h2><p>The media source may be unavailable. Please try again.</p><Button ref={retry} variant="cinematic" onClick={() => { setStatus("loading"); setAttempt(x => x + 1); }}><RotateCcw />Try again</Button></div>}
      {status !== "error" && <div className="custom-controls" inert={!(visible || !playing || settings || status !== "ready")}>
        {settings && <div className="player-settings" role="group" aria-label="Playback settings">
          <label>Playback speed<select aria-label="Playback speed" value={speed} onChange={e => { setSpeed(e.target.value); if (video.current) video.current.playbackRate = Number(e.target.value); }}>{["0.5", "0.75", "1", "1.25", "1.5", "2"].map(s => <option key={s} value={s}>{s}×</option>)}</select></label>
          {title.source?.qualities?.length ? <label>Quality<select aria-label="Video quality" value={source.url} onChange={e => changeSource(e.target.value)}><option value={title.source.url}>Original</option>{title.source.qualities.map(q => <option key={q.url} value={q.url}>{q.label}</option>)}</select></label> : null}
          {source.subtitles?.length ? <label>Captions<select aria-label="Captions" value={caption} onChange={e => { setCaption(e.target.value); const v = video.current; if (v) Array.from(v.textTracks).forEach((t, i) => t.mode = String(i) === e.target.value ? "showing" : "disabled"); }}><option value="off">Off</option>{source.subtitles.map((s, i) => <option key={s.language} value={i}>{s.label}</option>)}</select></label> : null}
          {audioTracks.length > 1 && <label>Audio<select aria-label="Audio track" value={audio} onChange={e => { setAudio(e.target.value); const v = video.current as AudioVideo | null; if (v?.audioTracks) Array.from(v.audioTracks).forEach((t, i) => t.enabled = String(i) === e.target.value); else v?.dispatchEvent(new CustomEvent("noctra-audio", { detail: e.target.value })); }}>{audioTracks.map((t, i) => <option key={t.id || i} value={i}>{t.label || t.language || `Track ${i + 1}`}</option>)}</select></label>}
        </div>}
        <div className="player-timeline" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); if (finiteDuration) setHoverTime(Math.max(0, Math.min(duration, (e.clientX - r.left) / r.width * duration))); }} onPointerLeave={() => setHoverTime(undefined)}>
          <svg className="timeline-paint" viewBox="0 0 100 4" preserveAspectRatio="none" aria-hidden="true"><rect width="100" height="4" className="timeline-base" />{finiteDuration && buffered.map(([start, end], i) => <rect key={i} x={start / duration * 100} width={(end - start) / duration * 100} height="4" className="timeline-buffer" />)}<rect width={finiteDuration ? time / duration * 100 : 0} height="4" className="timeline-progress" /></svg>
          <input type="range" min={0} max={finiteDuration ? duration : 0} step={.1} value={finiteDuration ? Math.min(time, duration) : 0} disabled={!finiteDuration} aria-label="Seek video" aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`} onChange={e => seek(Number(e.target.value))} />
          {hoverTime !== undefined && <output className="seek-time">{formatTime(hoverTime)}</output>}
        </div>
        <div className="player-control-row">
          <div className="player-control-left"><Button variant="ghost" size="icon" aria-label={playing ? "Pause video" : "Play video"} title={playing ? "Pause" : "Play"} onClick={() => void togglePlay()}>{playing ? <Pause /> : <Play />}</Button><span className="player-time">{formatTime(time)} <span>/ {formatTime(duration)}</span></span><span className="player-remaining">−{formatTime(duration - time)}</span></div>
          <div className="player-control-right"><div className="player-volume"><Button variant="ghost" size="icon" aria-label={muted || volume === 0 ? "Unmute" : "Mute"} title="Mute" onClick={() => { if (video.current) video.current.muted = !video.current.muted; }}>{muted || volume === 0 ? <VolumeX /> : <Volume2 />}</Button><input aria-label="Volume" type="range" min={0} max={1} step={.05} value={muted ? 0 : volume} onChange={e => { const v = video.current; if (v) { v.volume = Number(e.target.value); v.muted = false; } }} /></div>
          <Button variant="ghost" size="icon" aria-label="Playback settings" title="Playback settings" aria-expanded={settings} onClick={() => { setSettings(s => !s); reveal(); }}><Settings2 /></Button>
          {canPip && <Button variant="ghost" size="icon" aria-label={pip ? "Exit picture-in-picture" : "Picture-in-picture"} title="Picture-in-picture" onClick={() => void togglePip()}><PictureInPicture2 /></Button>}
          {canFullscreen && <Button variant="ghost" size="icon" aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"} title="Fullscreen" onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize /> : <Maximize />}</Button>}
          </div>
        </div>
      </div>}
    </div>
    <p className="player-notice" role="status">{notice || "Your playback progress stays on this device."}</p>
  </>;
}
