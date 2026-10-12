import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getTitle, titleHead } from "@/lib/catalog";
import { StreamPlayer } from "@/components/stream-player";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/watch/$id")({
  validateSearch: (s: Record<string, unknown>) =>
    typeof s["episode"] === "string" ? { episode: s["episode"] } : {},
  loader: ({ params }) => {
    const t = getTitle(params.id);
    if (!t) throw notFound();
    return t;
  },
  head: ({ loaderData }) =>
    titleHead(
      `Preview: ${loaderData?.name || "Unavailable"}`,
      "NOCTRA’s authorized-media-ready player. Sample stories show a clear preview state until a verified source is configured.",
    ),
  component: Watch,
});
function Watch() {
  const title = Route.useLoaderData();
  const search = Route.useSearch();
  const episode = title.seasons?.flatMap((s) => s.episodes).find((e) => e.id === search.episode);
  const playbackTitle = episode
    ? {
        ...title,
        id: episode.id,
        name: `${title.name} · ${episode.name}`,
        duration: episode.duration,
        synopsis: episode.synopsis,
        ...(episode.source ? { source: episode.source } : {}),
      }
    : title;
  return (
    <main className="page content-wrap">
      <Button asChild variant="ghost" className="mb-5 px-0 text-muted-foreground">
        <Link to="/title/$id" params={{ id: title.id }}>
          <ArrowLeft />
          Back to title
        </Link>
      </Button>
      {search.episode && !episode ? (
        <div className="empty-state">
          <h2>Episode not found.</h2>
          <p>This episode is not in the sample catalog.</p>
        </div>
      ) : (
        <StreamPlayer key={playbackTitle.id} title={playbackTitle} />
      )}
      <div className="section-heading mt-7">
        <div className="min-w-0">
          <h1 className="text-2xl">{playbackTitle.name}</h1>
          <p className="page-subtitle">
            {title.year} · {title.genre} · {title.duration} · Original demo
          </p>
        </div>
        <ShieldCheck className="text-ice shrink-0" size={24} />
      </div>
      <p className="page-subtitle max-w-2xl">{title.synopsis}</p>
    </main>
  );
}
