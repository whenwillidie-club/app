import {readFileSync,writeFileSync} from 'node:fs';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {createServer} from 'vite';
// Render the same public component used by the browser. No sessions or record API.
const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {default:Landing}=await server.ssrLoadModule('/app/landing.tsx');
 const markup=renderToString(React.createElement(Landing,{start:()=>{},resume:false}));
 if(!markup.includes('<h1')||!markup.includes('/guides/'))throw new Error('Incomplete public homepage');
 const html=readFileSync('dist/index.html','utf8');
 if(!html.includes('<div id="root"></div>'))throw new Error('Root placeholder missing');
 writeFileSync('dist/index.html',html.replace('<div id="root"></div>',()=>`<div id="root">${markup}</div>`));
 console.log('Prerendered the public homepage without private records');
}finally{await server.close();}
