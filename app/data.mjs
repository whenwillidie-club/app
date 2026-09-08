export const API='https://finchapps-connect.onrender.com';
export const categories=['demographics','medications','conditions','labs','vitals','allergies','immunizations','encounters'];
export function validateRecord(d){
 if(d?.environment!=='production'||d.synthetic===true||d.object!=='health_record'||d.consent?.status!=='active'||!d.data||!Array.isArray(d.categories))throw new Error('An authorized production record is required.');
 if(d.consent.expiresAt&&Date.parse(d.consent.expiresAt)<=Date.now())throw new Error('Consent has expired.');
 const record={};for(const c of categories){const v=d.data[c];if(c==='demographics'){record[c]=v?[v]:[];}else{if(v!==undefined&&!Array.isArray(v))throw new Error('Unexpected record format.');record[c]=v||[];}}
 return {...d,record};
}
export async function request(path,options={}){
 const {token,...rest}=options;const r=await fetch(API+path,{...rest,credentials:'omit',cache:'no-store',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...rest.headers},signal:rest.signal?AbortSignal.any([rest.signal,AbortSignal.timeout(90000)]):AbortSignal.timeout(90000)});
 const body=await r.json();if(!r.ok)throw Object.assign(new Error(body.error||'The connection could not respond. Please retry.'),{status:r.status});return body;
}
export const label=r=>typeof r?.name==='string'?r.name:r?.substance||r?.description||(typeof r?.type==='string'?r.type:null)||r?.codes?.find(c=>c.display)?.display||r?.resourceType||'Unnamed record';
export const date=r=>r?.date||r?.startDate||r?.onsetDate||r?.recordedDate||r?.createdDate||'';
export const formatDate=s=>s&&!Number.isNaN(Date.parse(s))?new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(s)):'Date not supplied';
export const status=r=>r?.status||'Not supplied';
export const quantity=r=>r?.value!==undefined&&r.value!==null?`${typeof r.value==='object'?JSON.stringify(r.value):r.value} ${r.unit||''}`.trim():'No result supplied';
export const flatten=record=>Object.entries(record).flatMap(([category,rows])=>Array.isArray(rows)?rows.map(r=>({...r,category})):[]);
export const patientName=d=>d.data?.demographics?.name||'Your authorized record';
export function download(name,content,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
