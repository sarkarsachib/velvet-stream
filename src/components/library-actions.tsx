import { useNavigate } from '@tanstack/react-router';
import { Bookmark, Check, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepthIcon } from '@/components/depth-icon';
import { catalog } from '@/lib/catalog';
import { toggleSaved, useMyList } from '@/lib/local-library';
import { useState } from 'react';
export function SaveTitle({id,compact=false}:{id:string;compact?:boolean}){const ids=useMyList();const saved=ids.includes(id);const [failed,setFailed]=useState(false);return <><Button variant={compact?'ghost':'glass'} size={compact?'icon':'default'} className={compact?'card-save':''} aria-label={saved?'Remove from My List':'Add to My List'} aria-pressed={saved} title={saved?'Remove from My List':'Add to My List'} onClick={()=>setFailed(!toggleSaved(id))}>{compact?(saved?<Check/>:<Bookmark/>):<><DepthIcon icon={saved?Check:Bookmark}/>{saved?'In My List':'My List'}</>}</Button>{failed&&<span role="status" className="storage-warning">Browser storage unavailable</span>}</>;}
export function SurpriseMe(){const navigate=useNavigate();return <Button variant="glass" onClick={()=>{const title=catalog[Math.floor(Math.random()*catalog.length)];if(title)void navigate({to:'/title/$id',params:{id:title.id}});}}><DepthIcon icon={Shuffle} tone="cyan"/>Surprise me</Button>;}
