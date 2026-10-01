#!/usr/bin/env node
'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');

const manifest=JSON.parse(read('games/kiire-sonatreener/manifest.webmanifest'));
assert.match(manifest.start_url,/\/games\/kiire-sonatreener\/index\.html(?:\?|$)/,'PWA must start from canonical index.html');

for(const legacy of ['app-20260926.html','app-20260926-v2.html']){
  const html=read('games/kiire-sonatreener/'+legacy);
  assert(html.includes("location.replace('./index.html"),legacy+' must redirect to canonical index.html');
}

const trainerSource=read('games/kiire-sonatreener/trainer.js');
function trainerHasManualAudioButtons(){
  return trainerSource.includes('listenAllBtn')||trainerSource.includes('reviewSpeak')||trainerSource.includes('Послушать все слова')||trainerSource.includes('Произношение</button>');
}
const index=read('games/kiire-sonatreener/index.html');
assert(index.includes('./app-catalog.js'),'index.html must load app-catalog.js');
assert(!read('games/kiire-sonatreener/deutsch-lesson-2.js').includes('function ensureTile'),'German custom lesson must not mutate the subject catalog');
assert(!read('games/kiire-sonatreener/literature-lesson-2.js').includes('function ensureTile'),'Literature custom lesson must not mutate the subject catalog');
assert(!index.includes('./english-lesson-1.js'),'English must use the core trainer, not a parallel lesson script');
assert(!trainerHasManualAudioButtons(),'English audio must be automatic with only an on/off toggle');
assert(!index.includes('\\n<script'),'index.html contains a visible escaped newline before a script tag');

const sandbox={window:{}};
vm.runInNewContext(read('games/kiire-sonatreener/app-catalog.js'),sandbox);
const catalog=sandbox.window.EDUKASS_CATALOG;
assert(Array.isArray(catalog)&&catalog.length>=6,'subject catalog must be present');

const lessonKeys=[];
for(const subject of catalog){
  assert(subject.id&&subject.label,'every subject needs id and label');
  for(const lesson of subject.lessons||[]){
    const key=lesson.kind==='core'?`core:${lesson.lang}:${lesson.topic}`:`custom:${lesson.handler}`;
    assert(!lessonKeys.includes(key),'duplicate lesson '+key);
    lessonKeys.push(key);
  }
}
assert(catalog.some(s=>s.id==='english'),'English subject is missing from catalog');
assert(lessonKeys.includes('core:en:present-simple-words'),'English Present Simple lesson is missing');

const trainer=trainerSource;
for(const id of ['present-simple-words','eesti-keel-3','lektion-1','muinasjutud']){
  assert(trainer.includes(`id:"${id}"`),'core trainer topic missing: '+id);
}
assert(trainer.includes('window.EDUKASS_TRAINER'),'trainer public API is missing');
assert(trainer.includes('function wordListHtml(topic)'),'shared vocabulary list renderer is missing');
for(const category of ['eesti-keel','eesti-kirjandus','english']){
  assert(trainer.includes(`id:"${category}",label:`)&&trainer.includes('showWordList:true'),'word-list defaults are missing for language study categories');
}


const customSources=[
  index,
  read('games/kiire-sonatreener/deutsch-lesson-2.js'),
  read('games/kiire-sonatreener/literature-lesson-2.js')
].join('\n');
for(const handler of ['historyAjastud','deutschLesson2','litHistoryBookLesson']){
  assert(customSources.includes(handler),'custom lesson handler missing: '+handler);
}

const build=read('scripts/build-cloudflare-site.js');
assert(build.includes('discoverTrainerRuntimeFiles'),'Cloudflare build must auto-discover trainer runtime files');

console.log('Sõnatreener architecture check: OK');
