import { createFileRoute, Link } from '@tanstack/react-router';
import { Bookmark, ArrowRight } from 'lucide-react';
import { catalog, titleHead } from '@/lib/catalog';
import { useMyList } from '@/lib/local-library';
import { MovieCard } from '@/components/catalog-ui';
import { DepthIcon } from '@/components/depth-icon';
import { Button } from '@/components/ui/button';
import { SurpriseMe } from '@/components/library-actions';
export const Route=createFileRoute('/my-list')({head:()=>titleHead('My List','Your saved NOCTRA stories, kept on this device only. No viewer accounts needed.'),component:MyList});
function MyList(){const ids=useMyList();const titles=catalog.filter(t=>ids.includes(t.id));return <main className="page content-wrap"><div className="eyebrow mb-4"><DepthIcon icon={Bookmark}/>SAVED FOR ANOTHER NIGHT</div><div className="section-heading"><div className="min-w-0"><h1>My List.</h1><p className="page-subtitle">Your stories. Right here on this device.</p></div><SurpriseMe/></div>{titles.length?<><p className="section-action mt-8">{titles.length} saved {titles.length===1?'story':'stories'}</p><div className="catalog-grid">{titles.map(t=><MovieCard title={t} key={t.id}/>)}</div></>:<div className="empty-state library-empty"><DepthIcon icon={Bookmark}/><h2>Your next movie night starts here.</h2><p>No saved stories yet.</p><Button variant="cinematic" asChild><Link to="/discover" search={{q:'',kind:'all',genre:''}}>Find a story <ArrowRight/></Link></Button></div>}</main>;}
