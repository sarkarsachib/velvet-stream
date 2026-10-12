import { createFileRoute, notFound } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { catalog, getTitle, titleHead } from "@/lib/catalog";
import { Hero, Rail } from "@/components/catalog-ui";
import { EpisodeList } from "@/components/episode-list";
import { AdSlot } from "@/components/ad-slot";
export const Route = createFileRoute("/title/$id")({
  loader: ({ params }) => {
    const title = getTitle(params.id);
    if (!title) throw notFound();
    return title;
  },
  head: ({ loaderData }) =>
    titleHead(
      loaderData?.name || "Title unavailable",
      loaderData?.synopsis || "This title is not in the NOCTRA collection.",
    ),
  component: TitleDetail,
});
function TitleDetail() {
  const title = Route.useLoaderData();
  return (
    <main>
      <Hero title={title} detail />
      <div className="content-wrap">
        <div className="detail-facts">
          <div>
            <h2>Behind the story</h2>
            <p>{title.synopsis}</p>
            <p className="text-ice">
              Original demo concept. Artwork and ratings are illustrative; no licensed film or
              streaming source is connected.
            </p>
          </div>
          <div>
            <h2>Title details</h2>
            <dl className="detail-list">
              <dt>Genre</dt>
              <dd>{title.genre}</dd>
              <dt>Format</dt>
              <dd>{title.kind}</dd>
              <dt>Year</dt>
              <dd>{title.year} (sample)</dd>
              <dt>Runtime</dt>
              <dd>{title.duration} (concept)</dd>
              <dt>Language</dt>
              <dd>{title.language} (sample)</dd>
              <dt>Availability</dt>
              <dd>Preview only · Authorized media pending</dd>
            </dl>
          </div>
        </div>
        <EpisodeList key={title.id} title={title} />
        <AdSlot placement="details" />
        <Rail
          name="More to explore"
          icon={<Sparkles />}
          titles={catalog.filter((t) => t.id !== title.id)}
        />
      </div>
    </main>
  );
}
