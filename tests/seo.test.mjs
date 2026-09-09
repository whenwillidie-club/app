import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import vm from 'node:vm';
const site=JSON.parse(readFileSync('content/seo.json','utf8'));
const read=path=>readFileSync('dist/'+path,'utf8');
const pages=['index.html','guides/index.html',`guides/${site.article}.html`,...(site.articles||[]).map(a=>`guides/${a.slug}.html`),'about.html','privacy.html'];
const canonicals=new Set();
test('all public pages have unique canonical URLs, readable HTML and matching metadata',()=>{
 for(const path of pages){
  const html=read(path);
  assert.match(html,/<html lang="en">/);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path+' needs one H1');
  assert.equal((html.match(/<title>/g)||[]).length,1);
  const canonical=html.match(/rel="canonical" href="([^"]+)"/)[1];
  assert.ok(canonical.startsWith(site.liveUrl));
  assert.ok(!canonical.includes('#')&&!canonical.includes('?'));
  assert.ok(!canonicals.has(canonical),path+' duplicate canonical');canonicals.add(canonical);
  assert.ok(html.includes(`property="og:url" content="${canonical}"`));
  assert.match(html,/name="description" content="[^"<>]{30,}"/);
  assert.match(html,/name="twitter:card" content="summary_large_image"/);
  const graph=JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(graph['@context'],'https://schema.org');
  assert.ok(graph['@graph'].some(node=>node.url===canonical&&node['@type']!=='WebSite'));
  assert.ok(graph['@graph'].every(node=>!node.aggregateRating&&!node.review));
 }
});
test('homepage is prerendered and links to its own public guide without JavaScript',()=>{
 const html=read('index.html');
 assert.ok(html.includes(site.headline));
 assert.ok(html.includes(`/guides/${site.article}.html`));
 assert.match(html,/<div id="root"><[\s\S]*?<h1/);
 assert.match(html,/href="\/guides\/"/);
 assert.match(html,/href="\/about.html"/);
 assert.ok(!html.includes('patient-demo-001'));
});
test('internal public links and assets resolve inside the deployment',()=>{
 for(const page of [...pages,'404.html']){
  const html=read(page);
  for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
   const link=match[1];if(/^(?:https?:|mailto:|data:)/.test(link))continue;
   const clean=link.split(/[?#]/)[0];if(!clean)continue;
   let path=clean.startsWith('/')?resolve('dist','.'+clean):resolve('dist',dirname(page),clean);
   if(clean.endsWith('/'))path+='/index.html';
   assert.ok(path.startsWith(resolve('dist')+'/'));
   assert.ok(existsSync(path),`${page} broken link: ${link}`);
  }
 }
});
test('sitemap is limited to public canonical pages and discoverable from robots.txt',()=>{
 const xml=read('sitemap.xml');const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,pages.length);assert.equal(new Set(urls).size,pages.length);
 assert.ok(urls.every(url=>!url.includes('#')&&!url.includes('404')&&!url.includes('import')));
 for(const page of pages){const canonical=read(page).match(/rel="canonical" href="([^"]+)"/)[1];assert.ok(urls.includes(canonical));}
 assert.ok(read('robots.txt').includes(`Sitemap: ${site.liveUrl}sitemap.xml`));
 assert.match(read('404.html'),/name="robots" content="noindex,follow"/);
});
test('guide search handles multiple words, case, empty input and no results without network or storage',()=>{
 const rows=[{dataset:{search:'Medication directions and source'},hidden:false},{dataset:{search:'Privacy and consent'},hidden:false}];
 const events={};const input={value:'',addEventListener:(name,fn)=>events[name]=fn};
 const form={hidden:true,addEventListener:(name,fn)=>events[name]=fn};
 const count={textContent:''},empty={hidden:true};
 const nodes={'guide-search':form,'guide-query':input,'search-count':count,'search-empty':empty};
 vm.runInNewContext(read('guide-search.js'),{document:{getElementById:id=>nodes[id],querySelectorAll:()=>rows}});
 assert.equal(form.hidden,false);
 input.value='  SOURCE medication  ';events.input();assert.deepEqual(rows.map(r=>r.hidden),[false,true]);assert.equal(count.textContent,'1 public page');
 input.value='<script>';events.input();assert.ok(rows.every(r=>r.hidden));assert.equal(empty.hidden,false);
 input.value='';events.input();assert.ok(rows.every(r=>!r.hidden));assert.equal(count.textContent,'2 public pages');assert.equal(empty.hidden,true);
 let prevented=false;events.submit({preventDefault:()=>prevented=true});assert.ok(prevented);
});

test('every added guide is discoverable from home, search and related guides with accurate article metadata',()=>{
 const home=read('index.html'),index=read('guides/index.html');
 const articles=[{slug:site.article,title:site.headline,published:'2026-09-08'},...site.articles];
 for(const article of articles){
  const path=`guides/${article.slug}.html`,html=read(path),url=site.liveUrl+path;
  assert.ok(home.includes(`href="/${path}"`));assert.ok(index.includes(`href="/${path}"`));
  const graph=JSON.parse(html.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const node=graph.find(n=>n['@type']==='Article');assert.equal(node.headline,article.title);assert.equal(node.mainEntityOfPage,url);assert.equal(node.datePublished,article.published);
  const crumbs=graph.find(n=>n['@type']==='BreadcrumbList').itemListElement;assert.deepEqual(crumbs.map(c=>c.item),[site.liveUrl,site.liveUrl+'guides/',url]);
  for(const other of articles.filter(a=>a.slug!==article.slug))assert.ok(html.includes(`href="/guides/${other.slug}.html"`));
  for(const link of html.matchAll(/href="#([^" ]+)"/g))assert.ok(html.includes(`id="${link[1]}"`),'broken article anchor '+link[1]);
  if(article.finchnode)assert.ok(html.includes(`href="${article.finchnode.url}"`));
  for(const q of article.questions||[])assert.ok(html.includes(q.question.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));
 }
});
