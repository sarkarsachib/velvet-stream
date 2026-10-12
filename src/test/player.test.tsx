import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StreamPlayer, formatTime } from "@/components/stream-player";
import { catalog } from "@/lib/catalog";

describe("Custom browser player", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });
  it("formats finite timestamps without inventing a duration", () => {
    expect(formatTime(Infinity)).toBe("0:00");
    expect(formatTime(3661)).toBe("1:01:01");
    expect(formatTime(75)).toBe("1:15");
  });
  it("uses custom controls, disables download controls, and gates source choices", () => {
    const { container } = render(<StreamPlayer title={{ ...catalog[0], source: { url: "/test.mp4", type: "native" } }} />);
    const video = container.querySelector("video");
    expect(video).not.toHaveAttribute("controls");
    expect(video).toHaveAttribute("controlslist", "nodownload");
    expect(screen.getByRole("slider", { name: "Seek video" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Playback settings" }));
    expect(screen.getByRole("combobox", { name: "Playback speed" })).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Captions" })).toBeNull();
    expect(screen.queryByRole("combobox", { name: "Video quality" })).toBeNull();
    expect(screen.queryByRole("combobox", { name: "Audio track" })).toBeNull();
    expect(screen.queryByRole("button", { name: /download/i })).toBeNull();
  });
  it("shows configured caption and quality choices and retry for actual media errors", () => {
    const { container } = render(<StreamPlayer title={{ ...catalog[0], source: { url: "/test.mp4", type: "native", qualities: [{ label: "720p", url: "/720.mp4", type: "native" }], subtitles: [{ label: "English", language: "en", src: "/en.vtt" }] } }} />);
    fireEvent.click(screen.getByRole("button", { name: "Playback settings" }));
    expect(screen.getByRole("combobox", { name: "Captions" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Video quality" })).toBeInTheDocument();
    const video = container.querySelector("video");
    if (!video) throw new Error("Missing video");
    fireEvent.error(video);
    expect(screen.getByRole("alert")).toHaveTextContent("couldn’t be loaded");
    expect(screen.getByRole("button", { name: "Try again" })).toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(screen.getByRole("status")).toHaveTextContent("Buffering");
  });
});