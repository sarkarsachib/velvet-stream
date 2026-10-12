import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { getTitle, titleHead } from '@/lib/catalog';
import { StreamPlayer } from '@/components/stream-player';
import { Button } from '@/components/ui/button';
export const Route=createFileRoute('/watch/$id')({loader:({params})=>{const t=getTitle(params.id);if(!t)throw notFound();return t;},head:({loaderData})=>titleHead(`Preview: ${loaderData?.name||'Unavailable'}`,'NOCTRA’s authorized-media-ready player. Sample stories show a clear preview state until a verified source is configured.'),component:Watch});
function Watch(){const title=Route.useLoaderData();return <main className="page content-wrap"><Button asChild variant="ghost" className="mb-5 px-0 text-muted-foreground"><Link to="/title/$id" params={{id:title.id}}><ArrowLeft/>Back to title</Link></Button><StreamPlayer key={title.id} title={title}/><div className="section-heading mt-7"><div className="min-w-0"><h1 className="text-2xl">{title.name}</h1><p className="page-subtitle">{title.year} · {title.genre} · {title.duration} · Original demo</p></div><ShieldCheck className="text-ice shrink-0" size={24}/></div><p className="page-subtitle max-w-2xl">{title.synopsis}</p></main>;}
