#!/usr/bin/env node
'use strict';
// Normalize EDUKASS site headers in Cloudflare output, including files added late.
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const masterStyles=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8');
const approved=source.match(/<a class="facebook-follow"[\s\S]*?<\/a>/);
const marker='/* v125: Facebook follow CTA in the EDUKASS main navigation. */';
if(!approved||!approved[0].includes('Jälgi meid Facebookis'))
  throw new Error('Approved Facebook follow button missing from homepage');
const cta=approved[0];
const start=masterStyles.indexOf(marker);
if(start<0)throw new Error('Facebook CTA styles missing');
const css=masterStyles.slice(start);
if(!css.includes('.header-inner.header-with-social')||!css.includes('@media(max-width:520px)'))
  throw new Error('Facebook CTA mobile styles incomplete');
const inline='<style id="edukass-cloudflare-facebook-follow">\n'+css+'\n</style>';
const fb='https://www.facebook.com/share/1GH4qbcNqL/';
function normalizeHtml(html,filename='(unknown)'){
  const found=html.match(/<header class="site-header">[\s\S]*?<\/header>/);
  if(!found)return{html,hasHeader:false,inserted:false,removedLegacy:false};
  let header=found[0];
  if(!/<nav\b[^>]*>[\s\S]*?<\/nav>/.test(header))
    throw new Error('Header navigation missing: '+filename);
  if(!header.includes('class="container header-inner'))
    throw new Error('Header layout wrapper missing: '+filename);
  const removedLegacy=header.includes('class="edukass-social-links"');
  header=header.replace(/<div class="edukass-social-links"[\s\S]*?<\/div>/g,'');
  header=header.replace('class="container header-inner"','class="container header-inner header-with-social"');
  const inserted=!header.includes('class="facebook-follow"');
  if(inserted)header=header.replace('</nav>','</nav>\n'+cta);
  const count=(header.match(/class="facebook-follow"/g)||[]).length;
  if(count!==1||header.includes('edukass-social-links')||!header.includes(fb))
    throw new Error('Invalid Facebook CTA or duplicate on '+filename);
  let result=html.replace(found[0],header);
  if(!result.includes('id="edukass-cloudflare-facebook-follow"')){
    if(!result.includes('</head>'))throw new Error('Missing HTML head: '+filename);
    result=result.replace('</head>',inline+'\n</head>');
  }
  return{html:result,hasHeader:true,inserted,removedLegacy};
}
function allHtmlFiles(dir){
  const files=[];
  for(const item of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,item.name);
    if(item.isDirectory())files.push(...allHtmlFiles(full));
    else if(item.isFile()&&item.name.endsWith('.html'))files.push(full);
  }
  return files;
}
function normalizePublishedHeaders(dir=path.join(ROOT,'dist')){
  const expected=['index.html','materials/index.html','materials/ristsonad-sugis/index.html',
    'materials/tunniplaanid-10/index.html','materials/matemaatika/index.html'];
  for(const p of expected)if(!fs.existsSync(path.join(dir,p)))
    throw new Error('Expected page missing from Cloudflare build: '+p);
  const stats={headers:0,added:0,removedLegacy:0,unchanged:0};
  for(const file of allHtmlFiles(dir)){
    const original=fs.readFileSync(file,'utf8');
    const rel=path.relative(dir,file).split(path.sep).join('/');
    const updated=normalizeHtml(original,rel);
    if(!updated.hasHeader)continue; // Fullscreen game screens are not site headers.
    stats.headers++;
    if(updated.inserted)stats.added++;
    if(updated.removedLegacy)stats.removedLegacy++;
    if(updated.html!==original)fs.writeFileSync(file,updated.html,'utf8');
    else stats.unchanged++;
  }
  if(stats.headers<6)throw new Error('Unexpectedly few standard EDUKASS site headers');
  for(const p of expected){
    const html=fs.readFileSync(path.join(dir,p),'utf8');
    const h=html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0]||'';
    if((h.match(/class="facebook-follow"/g)||[]).length!==1||
      h.includes('edukass-social-links')||
      !html.includes('id="edukass-cloudflare-facebook-follow"'))
      throw new Error('Facebook header verification failed: '+p);
  }
  return stats;
}
if(require.main===module){
  console.log('PASS Cloudflare Facebook headers: '+JSON.stringify(normalizePublishedHeaders()));
}
module.exports={normalizeHtml,normalizePublishedHeaders};
