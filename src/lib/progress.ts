import { useEffect, useState } from "react";
export interface PlaybackProgress {
  time: number;
  duration: number;
  updated: number;
}
const key = "noctra.playback.v1";
export function readProgress(): Record<string, PlaybackProgress> {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(key) || "{}");
    if (typeof raw !== "object" || raw === null) return {};
    const result: Record<string, PlaybackProgress> = {};
    for (const [id, v] of Object.entries(raw)) {
      if (typeof v !== "object" || v === null) continue;
      const value = v as Record<string, unknown>;
      const time = value["time"],
        duration = value["duration"],
        updated = value["updated"];
      if (
        typeof time === "number" &&
        typeof duration === "number" &&
        typeof updated === "number" &&
        Number.isFinite(time) &&
        time >= 0 &&
        Number.isFinite(duration) &&
        duration > 0
      )
        result[id] = { time, duration, updated };
    }
    return result;
  } catch {
    return {};
  }
}
export function saveProgress(id: string, time: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(time) || time < 0) return;
  try {
    const all = readProgress();
    all[id] = { time, duration, updated: Date.now() };
    localStorage.setItem(key, JSON.stringify(all));
    window.dispatchEvent(new Event("noctra-progress"));
  } catch {
    /* Storage is optional. */
  }
}
export function clearProgress() {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event("noctra-progress"));
  } catch {
    /* Optional storage. */
  }
}
export function useProgress() {
  const [data, setData] = useState<Record<string, PlaybackProgress>>({});
  useEffect(() => {
    const update = () => setData(readProgress());
    update();
    window.addEventListener("storage", update);
    window.addEventListener("noctra-progress", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("noctra-progress", update);
    };
  }, []);
  return data;
}
