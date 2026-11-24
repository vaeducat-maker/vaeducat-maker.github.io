/* EDUKASS Passport Lite · portable, private progress for the nine-world runner.
   Implements the same user-controlled save-link and confirmation model as
   games/korrutamine-test/progress-transfer.js and the column-game Passport Lite.
   It uses a separate passport type; no cloud, user ID, tracking or remote QR API.
*/
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const VERSION=1,TYPE='edukass-umardamine-passport',LIMIT=4096;
 const progress=window.EDUKASS_GAME_PROGRESS;
 if(!progress)return;
 const shareDialog=$('shareDialog'),passportDialog=$('passportDialog');
 let latestPassport='',pending=null;
 function gameUrl(){return location.origin+location.pathname+location.search}
 function countText(data){return data.completed.length+' / 9 KRISTALLI'}
 function setStatus(id,value){$(id).textContent=value}
 function encode(info){
  const bytes=new TextEncoder().encode(JSON.stringify(info));
  if(bytes.length>1500)throw Error('Salvestus on liiga suur');
  let ascii='';for(const byte of bytes)ascii+=String.fromCharCode(byte);
  return btoa(ascii).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 }
 function decode(code){
  if(!/^[a-zA-Z0-9_-]{1,4096}$/.test(code))throw Error('Vigane või liiga pikk salvestuskood');
  const raw=atob(code.replace(/-/g,'+').replace(/_/g,'/'));
  if(raw.length>1500)throw Error('Salvestus on liiga suur');
  return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(raw,ch=>ch.charCodeAt(0))));
 }
 function validate(obj){
  if(!obj||obj.type!==TYPE||obj.v!==VERSION||!obj.progress||typeof obj.progress!=='object')throw Error('See link ei kuulu ümardamise mängule');
  const p=obj.progress,ids=p.completed;
  if(!Array.isArray(ids)||ids.length>9||ids.some(x=>!Number.isInteger(x)||x<1||x>9)||
    new Set(ids).size!==ids.length||!Number.isInteger(p.lastWorld)||p.lastWorld<1||p.lastWorld>9)
    throw Error('Kristallide salvestus on vigane');
  if(p.lastWorld>1&&!ids.includes(p.lastWorld)&&!ids.includes(p.lastWorld-1))throw Error('Salvestatud maailm ei ole avatud');
  if(p.ultimate!==undefined&&typeof p.ultimate!=='boolean')throw Error('Vigane lõppauhind');
  return {completed:[...ids].sort((a,b)=>a-b),lastWorld:p.lastWorld,ultimate:ids.length===9};
 }
 function makeQr(elementId,url){
  const node=$(elementId);node.textContent='';
  if(typeof window.qrcode!=='function'){node.textContent='QR pole saadaval. Kasuta allolevat linki.';return}
  try{
   const qr=window.qrcode(0,'M');
   qr.addData(url,'Byte');qr.make();node.innerHTML=qr.createSvgTag(4,16);
   const svg=node.querySelector('svg');if(svg){svg.setAttribute('role','img');svg.setAttribute('aria-label','Skaneeri linki avamiseks')}
  }catch(e){node.textContent='QR pole saadaval. Kasuta linki.'}
 }
 function show(dialog){
  if(shareDialog.open)shareDialog.close();
  if(passportDialog.open)passportDialog.close();
  dialog.showModal();window.dispatchEvent(new Event('edukass-dialog-open'));
 }
 function close(dialog){
  if(dialog.open)dialog.close();
  window.dispatchEvent(new Event('edukass-dialog-closed'));
 }
 async function copy(text,area,status){
  let ok=false;
  try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);ok=true}}catch(e){}
  if(!ok){area.value=text;area.focus();area.select();try{ok=document.execCommand('copy')}catch(e){}}
  setStatus(status,ok?'Link kopeeritud!':'Vali link ja kopeeri see käsitsi.');
 }
 async function send(text,area,status,caption){
  if(navigator.share){
   try{await navigator.share({title:caption,url:text});return}catch(e){if(e&&e.name==='AbortError')return}
  }
  await copy(text,area,status);
 }
 function openShare(){
  const url=gameUrl();
  $('shareUrl').value=url;makeQr('shareQr',url);
  setStatus('shareStatus','');show(shareDialog);
 }
 function openPassport(){
  const data=progress.get();
  $('passportSummary').textContent='KOGUTUD '+countText(data);
  $('passportExport').hidden=true;$('passportConfirm').hidden=true;
  $('passportImportText').value='';pending=null;latestPassport='';
  $('passportText').textContent='Sinu kristallid salvestatakse selles seadmes automaatselt. Loo isiklik link, et jätkata teises seadmes.';
  setStatus('passportStatus','');show(passportDialog);
 }
 function createPassport(){
  try{
   const payload={type:TYPE,v:VERSION,savedAt:Date.now(),progress:progress.get()};
   const code=encode(payload);
   const link=gameUrl()+'#ekpass='+code;
   if(link.length>LIMIT)throw Error('Liiga pikk link');
   latestPassport=link;$('passportUrl').value=link;
   makeQr('passportQr',link);$('passportExport').hidden=false;
   $('passportConfirm').hidden=true;
   setStatus('passportStatus','Isiklik link on valmis. Salvesta see või skaneeri QR-kood teises seadmes.');
  }catch(e){setStatus('passportStatus','Linki ei õnnestunud luua: '+e.message)}
 }
 function extractCode(text){
  const raw=String(text||'').trim();
  if(!raw)throw Error('Sisesta salvestuslink');
  if(raw.startsWith('#ekpass='))return raw.slice(8);
  if(raw.startsWith('ekpass='))return raw.slice(7);
  if(/^[A-Za-z0-9_-]+$/.test(raw))return raw;
  const link=new URL(raw);
  if(!link.hash.startsWith('#ekpass='))throw Error('Lingil puudub salvestuskood');
  return link.hash.slice(8);
 }
 function prepareImport(text){
  $('passportConfirm').hidden=true;pending=null;
  try{
   const record=decode(extractCode(text));
   pending=validate(record);
   $('passportImportSummary').textContent='Leidsime '+pending.completed.length+' / 9 kristalli. Jätkame maailmast '+pending.lastWorld+'.';
   $('passportConfirm').hidden=false;
   $('passportImportPanel').open=true;
   setStatus('passportStatus','Salvestus kontrollitud. Taastamiseks kinnita.');
  }catch(e){setStatus('passportStatus','Salvestust ei saa avada: '+e.message)}
 }
 function restore(){
  if(!pending)return;
  try{
   const count=progress.restore(pending);
   pending=null;close(passportDialog);
   $('passportSummary').textContent='KOGUTUD '+count+' / 9 KRISTALLI';
  }catch(e){setStatus('passportStatus','Taastamine ei õnnestunud: '+e.message)}
 }
 $('shareGame').addEventListener('click',openShare);
 $('shareGameIntro').addEventListener('click',openShare);
 $('closeShare').addEventListener('click',()=>close(shareDialog));
 $('copyGameUrl').addEventListener('click',()=>copy($('shareUrl').value,$('shareUrl'),'shareStatus'));
 $('sendGameUrl').addEventListener('click',()=>send($('shareUrl').value,$('shareUrl'),'shareStatus','EDUKASS · Ümardamise kristallirännak'));
 $('openPassport').addEventListener('click',openPassport);
 $('openPassportIntro').addEventListener('click',openPassport);
 $('saveAfterVictory').addEventListener('click',openPassport);
 $('saveFromVault').addEventListener('click',openPassport);
 $('closePassport').addEventListener('click',()=>close(passportDialog));
 $('createPassport').addEventListener('click',createPassport);
 $('copyPassport').addEventListener('click',()=>copy(latestPassport,$('passportUrl'),'passportStatus'));
 $('sendPassport').addEventListener('click',()=>send(latestPassport,$('passportUrl'),'passportStatus','EDUKASS · Minu edusammud'));
 $('passportCheck').addEventListener('click',()=>prepareImport($('passportImportText').value));
 $('passportRestore').addEventListener('click',restore);
 $('passportCancelImport').addEventListener('click',()=>{pending=null;$('passportConfirm').hidden=true;setStatus('passportStatus','Taastamine katkestati.')});
 for(const dlg of [shareDialog,passportDialog]){
  dlg.addEventListener('close',()=>window.dispatchEvent(new Event('edukass-dialog-closed')));
  dlg.addEventListener('click',e=>{if(e.target===dlg)close(dlg)});
 }
 // Incoming personal link is validated and previewed, never silently imported.
 if(location.hash.startsWith('#ekpass=')){
  const code=location.hash.slice(8);
  try{history.replaceState(history.state,'',gameUrl())}catch(e){}
  openPassport();
  prepareImport('#ekpass='+code);
 }
 window.__EDUKASS_PASSPORT_TEST__={encode,decode,validate,extractCode,prepareImport,createPassport,restore};
})();
