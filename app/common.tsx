import React from 'react';
import {Checkbox} from '@/components/ui/checkbox';
import {label,date,formatDate,status,quantity} from './data.mjs';
export function Check({checked,onChange,children}:any){return <label className="check"><Checkbox checked={checked} onCheckedChange={onChange}/><span>{children}</span></label>}
export function Record({r,children}:any){return <article className="record"><div className="record-top"><span className="eyebrow">{r.resourceType}</span><span className="tag">{status(r)}</span></div><h3>{label(r)}</h3><p className="muted">{formatDate(date(r))} · {r.sourceName||r.source||'Source not supplied'}</p>{r.value!==undefined?<strong className="reading">{quantity(r)}</strong>:null}{children}</article>}
// Production records are deliberately not exposed through document.modelContext.
export function useTool(..._args:any[]){}
export function Empty(){return <p className="empty" role="status">No matching records were returned in the authorized scope. This does not establish that no such events or conditions exist.</p>}
