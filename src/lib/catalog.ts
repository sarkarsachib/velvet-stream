import hero from '@/assets/hero.jpg';
import p1 from '@/assets/poster-1.jpg';
import p2 from '@/assets/poster-2.jpg';
import p3 from '@/assets/poster-3.jpg';
import p4 from '@/assets/poster-4.jpg';
import p5 from '@/assets/poster-5.jpg';
import p6 from '@/assets/poster-6.jpg';
export type Genre = 'Sci-Fi' | 'Thriller' | 'Anime' | 'Adventure' | 'Drama' | 'Fantasy';
export interface MediaSource { url: string; type: 'native' | 'hls'; subtitles?: undefined | {src: string; label: string; language: string}[]; qualities?: {label: string; url: string; type: 'native' | 'hls'}[] }
export interface Title { id: string; name: string; genre: Genre; kind: 'Movie' | 'Series' | 'Anime'; year: number; duration: string; rating: string; image: string; cover?: string; synopsis: string; fresh?: boolean; source?: MediaSource }
export const catalog: [Title, Title, Title, Title, Title, Title] = [
 {id:'neon-district',name:'Neon District',genre:'Thriller',kind:'Movie',year:2026,duration:'1h 48m',rating:'8.4',image:p1,synopsis:'In a city that never sees daylight, a missing-persons detective uncovers a secret hidden in the neon. Every memory comes at a price.'},
 {id:'beyond-the-horizon',name:'Beyond the Horizon',genre:'Sci-Fi',kind:'Movie',year:2026,duration:'2h 18m',rating:'8.8',image:p2,cover:hero,synopsis:'At the edge of the known universe, a lone explorer discovers a signal that could change everything. Some journeys take you further than the stars.',fresh:true},
 {id:'sakura-blade',name:'Sakura Blade',genre:'Anime',kind:'Anime',year:2026,duration:'12 episodes',rating:'9.1',image:p3,synopsis:'A quiet village. An ancient blade. A young guardian who must choose between the world she knows and the destiny waiting beyond it.',fresh:true},
 {id:'the-silent-pines',name:'The Silent Pines',genre:'Thriller',kind:'Series',year:2025,duration:'8 episodes',rating:'8.2',image:p4,synopsis:'A remote cabin holds the answer to a disappearance. But the forest has kept its secrets for generations, and it is not ready to let them go.'},
 {id:'midnight-in-velvet',name:'Midnight in Velvet',genre:'Drama',kind:'Movie',year:2026,duration:'1h 56m',rating:'8.6',image:p5,synopsis:'One unforgettable night in a jazz club brings two strangers together. By sunrise, neither will be the person they used to be.',fresh:true},
 {id:'the-last-kingdom',name:'The Last Kingdom',genre:'Fantasy',kind:'Series',year:2025,duration:'10 episodes',rating:'8.9',image:p6,synopsis:'Beyond the frozen mountains, a fallen guardian sets out to return a stolen crown. An ancient creature shadows every step.'},
];
export const featured = catalog[1];
export const genres: Genre[] = ['Sci-Fi','Thriller','Anime','Adventure','Drama','Fantasy'];
export function getTitle(id: string) { return catalog.find(t=>t.id===id); }
export function titleHead(title: string, description: string) {return {meta:[{title:`${title} · NOCTRA`},{name:'description',content:description},{property:'og:title',content:`${title} · NOCTRA`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};}
