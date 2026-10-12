import { beforeEach, describe, expect, it } from "vitest";
import { catalog, getTitle } from "@/lib/catalog";
import { clearProgress, readProgress, saveProgress } from "@/lib/progress";
import { experienceConfig, mountPlacement } from "@/lib/monetization";

describe("Honest sample streaming experience", () => {
  beforeEach(() => localStorage.clear());
  it("does not invent playable media or progress", () => {
    expect(catalog.every((title) => title.source === undefined)).toBe(true);
    expect(readProgress()).toEqual({});
    expect(getTitle("missing")).toBeUndefined();
  });
  it("stores real playback position and clears it", () => {
    saveProgress("beyond-the-horizon", 34, 120);
    expect(readProgress()["beyond-the-horizon"]?.time).toBe(34);
    expect(readProgress()["beyond-the-horizon"]?.duration).toBe(120);
    clearProgress();
    expect(readProgress()).toEqual({});
  });
  it("rejects corrupt or invalid local progress", () => {
    localStorage.setItem("noctra.playback.v1", '{"bad":{"time":-3,"duration":5,"updated":3}}');
    expect(readProgress()).toEqual({});
    saveProgress("bad", 30, Infinity);
    expect(readProgress()).toEqual({});
  });
  it("keeps all unconfigured ad integrations inert", async () => {
    expect(Object.values(experienceConfig.providers).every((p) => !p.enabled)).toBe(true);
    expect(experienceConfig.popunder.enabled).toBe(false);
    expect(experienceConfig.vast.enabled).toBe(false);
    const slot = document.createElement("div");
    expect(await mountPlacement("home", "/", slot)).toBe(false);
    expect(slot.children.length).toBe(0);
  });
});
