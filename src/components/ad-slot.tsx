import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import {
  experienceConfig,
  mountPlacement,
  noteVisiblePlacement,
  type Placement,
} from "@/lib/monetization";
export function AdSlot({ placement }: { placement: Placement }) {
  const node = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    let disposed = false;
    let observer: IntersectionObserver | undefined;
    void mountPlacement(placement, pathname, element).then((ok) => {
      if (disposed) return;
      setMounted(ok);
      if (ok) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              noteVisiblePlacement();
              observer?.disconnect();
            }
          },
          { threshold: 0.5 },
        );
        observer.observe(element);
      }
    });
    return () => {
      disposed = true;
      observer?.disconnect();
      element.replaceChildren();
    };
  }, [placement, pathname]);
  if (!experienceConfig.placements[placement]) return null;
  return (
    <aside
      aria-label="Advertising placement"
      className={
        mounted
          ? "reserved-ad"
          : experienceConfig.fallback === "collapse"
            ? "hidden"
            : "reserved-ad"
      }
    >
      <span className="ad-symbol" aria-hidden="true">
        <Sparkles size={19} />
      </span>
      <div className="min-w-0">
        <div ref={node} />
        {!mounted && (
          <div className="ad-copy">
            A little space for our supporters.
            <small>Reserved placement · No advertising provider connected</small>
          </div>
        )}
      </div>
      <span className="ad-label">Advertisement</span>
    </aside>
  );
}
