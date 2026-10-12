// Public publisher tags only; never put provider credentials or admin configuration here.
export type Placement = 'home' | 'between-rails' | 'details';
export type Provider = 'adsterra' | 'monetag';
export interface ProviderConfig {enabled:boolean; displayScriptUrl?:string; nativeScriptUrl?:string; popunderScriptUrl?:string}
export const experienceConfig = {
 providers: {adsterra:{enabled:false},monetag:{enabled:false}} as Record<Provider,ProviderConfig>,
 placements: {home:true,'between-rails':true,details:true} as Record<Placement,boolean>,
 maxPerVisit:3,cooldownMs:120000,mobile:true,desktop:true,
 excludedRoutes:['/watch/'],fallback:'reserved' as 'reserved'|'collapse',
 popunder:{enabled:false,maxPerVisit:1,cooldownMs:1800000},
 vast:{enabled:false,tagUrl:undefined as string|undefined},
};
let count=0,last=0,popCount=0,popLast=0;
const aggregate={impressions:0,errors:0}; // Ephemeral diagnostics, not revenue or visitor analytics.
let regionPromise:Promise<boolean>|undefined;
const restricted=new Set('AT BE BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT NL NO PL PT RO SK SI ES SE GB CH'.split(' '));
async function permittedRegion(){if(!regionPromise)regionPromise=(async()=>{try{const r=await fetch('/cdn-cgi/trace',{signal:AbortSignal.timeout(2000)});if(!r.ok)return false;const country=(await r.text()).match(/^loc=([A-Z0-9]{2})$/m)?.[1];return !!country&&country!=='XX'&&country!=='T1'&&!restricted.has(country);}catch{return false;}})();return regionPromise;}
export async function eligible(placement:Placement,path:string){if(!experienceConfig.placements[placement]||experienceConfig.excludedRoutes.some(p=>path.startsWith(p)))return false;const mobile=window.matchMedia('(max-width: 640px)').matches;if(mobile&&!experienceConfig.mobile||!mobile&&!experienceConfig.desktop)return false;if(count>=experienceConfig.maxPerVisit||Date.now()-last<experienceConfig.cooldownMs)return false;return permittedRegion();}
const scripts=new Set<string>();
async function loadApprovedScript(url:string,container:HTMLElement){const parsed=new URL(url);if(parsed.protocol!=='https:')throw new Error('HTTPS provider URL required');if(scripts.has(url))return;await new Promise<void>((resolve,reject)=>{const s=document.createElement('script');s.async=true;s.src=url;const timer=setTimeout(()=>{s.remove();reject(new Error('Provider timeout'));},6000);s.onload=()=>{clearTimeout(timer);scripts.add(url);resolve();};s.onerror=()=>{clearTimeout(timer);s.remove();reject(new Error('Provider unavailable'));};container.appendChild(s);});}
// Separate adapters can be replaced with a provider-approved installation, without changing pages.
export const providerAdapters:Record<Provider,{mount:(config:ProviderConfig,node:HTMLElement,format:'display'|'native')=>Promise<void>}>= {
 adsterra:{mount:async(config,node,format)=>{const url=format==='native'?config.nativeScriptUrl:config.displayScriptUrl;if(!config.enabled||!url)throw new Error('Adsterra not configured');await loadApprovedScript(url,node);}},
 monetag:{mount:async(config,node,format)=>{const url=format==='native'?config.nativeScriptUrl:config.displayScriptUrl;if(!config.enabled||!url)throw new Error('Monetag not configured');await loadApprovedScript(url,node);}},
};
export async function mountPlacement(placement:Placement,path:string,node:HTMLElement){const selected=(Object.entries(experienceConfig.providers) as [Provider,ProviderConfig][]).find(([,c])=>c.enabled&&(c.displayScriptUrl||c.nativeScriptUrl));if(!selected||!await eligible(placement,path))return false;const [provider,config]=selected;count++;last=Date.now();try{await providerAdapters[provider].mount(config,node,config.nativeScriptUrl?'native':'display');return true;}catch{aggregate.errors++;return false;}}
export function noteVisiblePlacement(){aggregate.impressions++;}
// Call ONLY from an explicit eligible user gesture outside playback. No automatic listeners.
export async function requestPopunder(provider:Provider,node:HTMLElement,path:string){const config=experienceConfig.providers[provider];if(!experienceConfig.popunder.enabled||!config.enabled||!config.popunderScriptUrl||path.startsWith('/watch/')||popCount>=experienceConfig.popunder.maxPerVisit||Date.now()-popLast<experienceConfig.popunder.cooldownMs||!await permittedRegion())return false;popCount++;popLast=Date.now();try{await loadApprovedScript(config.popunderScriptUrl,node);return true;}catch{aggregate.errors++;return false;}}
