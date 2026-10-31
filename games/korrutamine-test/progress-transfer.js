(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else {root.EDUKASS_KORRUTAMINE_PASSPORT=api;api.init();}
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const MAX_BYTES=130000,MAX_CODE=32000;
  function encode64(bytes){
    let binary='';
    for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
    return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  }
  function decode64(value){
    if(!/^[A-Za-z0-9_-]{1,32000}$/.test(value))throw Error('Vigane või liiga pikk link');
    const binary=atob(value.replace(/-/g,'+').replace(/_/g,'/'));
    return Uint8Array.from(binary,ch=>ch.charCodeAt(0));
  }
  async function encode(data){
    const bytes=new TextEncoder().encode(JSON.stringify(data));
    if(bytes.length>MAX_BYTES)throw Error('Salvestus on liiga suur');
    let code;
    if(typeof CompressionStream==='function'){
      const zip=await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer();
      code='g'+encode64(new Uint8Array(zip));
    }else code='j'+encode64(bytes);
    if(code.length>MAX_CODE)throw Error('Salvestus on lingi jaoks liiga suur');
    return code;
  }
  async function decode(code){
    if(typeof code!=='string'||code.length<2||code.length>MAX_CODE)throw Error('Vigane link');
    const bytes=decode64(code.slice(1));
    let raw;
    if(code[0]==='g'){
      if(typeof DecompressionStream!=='function')throw Error('See brauser ei toeta selle lingi avamist');
      raw=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    }else if(code[0]==='j')raw=bytes;
    else throw Error('Tundmatu lingi vorming');
    if(raw.length>MAX_BYTES)throw Error('Salvestus on liiga suur');
    return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw));
  }
  function validate(data,store,maxLevel,schemaVersion){
    if(!data||data.type!=='edukass-korrutamine-passport'||data.v!==1)throw Error('See link ei kuulu sellele mängule');
    const p=data.progress;
    if(!p||typeof p!=='object'||Array.isArray(p)||!Number.isInteger(p.unlockedLevel)||
      p.unlockedLevel<1||p.unlockedLevel>maxLevel||!Array.isArray(p.completedLevels)||
      p.completedLevels.length>maxLevel||
      p.completedLevels.some(n=>!Number.isInteger(n)||n<1||n>maxLevel))throw Error('Missioonide salvestus on vigane');
    if(p.saveVersion!==undefined&&(!Number.isInteger(p.saveVersion)||p.saveVersion<0||p.saveVersion>schemaVersion))throw Error('Tundmatu salvestuse versioon');
    if(p.lessonSeen!==undefined&&(typeof p.lessonSeen!=='object'||p.lessonSeen===null||Array.isArray(p.lessonSeen)))throw Error('Õppetundide salvestus on vigane');
    if(p.factStats!==undefined&&(typeof p.factStats!=='object'||p.factStats===null||Array.isArray(p.factStats)))throw Error('Harjutuste salvestus on vigane');
    if(p.lastSuccessfulMissionId!==null&&p.lastSuccessfulMissionId!==undefined&&
      (!Number.isInteger(p.lastSuccessfulMissionId)||p.lastSuccessfulMissionId<1||p.lastSuccessfulMissionId>maxLevel))throw Error('Viimane missioon on vigane');
    const lessonSeen=Object.create(null),factStats=Object.create(null);
    const lessons=Object.entries(p.lessonSeen||{});
    if(lessons.length>60)throw Error('Õppetundide salvestus on liiga suur');
    for(const [key,value] of lessons){
      if(!/^(multiply|divide)-(?:[2-9]|10)$/.test(key)||typeof value!=='boolean')throw Error('Õppetundide salvestus on vigane');
      lessonSeen[key]=value;
    }
    const facts=Object.entries(p.factStats||{});
    if(facts.length>300)throw Error('Harjutuste salvestus on liiga suur');
    for(const [key,value] of facts){
      if(key.length>60||!value||typeof value!=='object'||Array.isArray(value)||
        !Number.isSafeInteger(value.correct)||value.correct<0||value.correct>100000000||
        !Number.isSafeInteger(value.mistakes)||value.mistakes<0||value.mistakes>100000000)throw Error('Harjutuste salvestus on vigane');
      factStats[key]={correct:value.correct,mistakes:value.mistakes};
    }
    const safe={
      saveVersion:p.saveVersion===undefined?schemaVersion:p.saveVersion,
      unlockedLevel:p.unlockedLevel,completedLevels:p.completedLevels.slice(),
      multiplicationLessonSeen:Boolean(p.multiplicationLessonSeen),
      divisionLessonSeen:Boolean(p.divisionLessonSeen),
      lessonSeen,factStats,
      lastSuccessfulMissionId:p.lastSuccessfulMissionId??null
    };
    return store.normalize(safe);
  }
  function init(){
    const config=window.EDUKASS_CHAPTER_ONE;
    const api=window.EDUKASS_PROGRESS_STORE;
    if(!config||!api)return;
    const store=api.create({storage:localStorage,key:config.storage.progressKey,
      schemaVersion:config.storage.progressSchemaVersion,maxLevel:config.missions.length});
    const dialog=document.getElementById('passportDialog');
    const status=document.getElementById('passportStatus');
    const link=document.getElementById('passportLink');
    const actions=document.getElementById('passportShareActions');
    const restoreActions=document.getElementById('passportRestoreActions');
    const create=document.getElementById('passportCreate');
    let latestLink='',pending=null;
    const incoming=location.hash.startsWith('#ekpass=')?location.hash.slice(8):null;
    if(incoming!==null)history.replaceState(history.state,'',location.pathname+location.search);
    function show(mode){
      status.textContent='';
      create.hidden=mode==='restore';
      restoreActions.hidden=mode!=='restore';
      actions.hidden=true;link.hidden=true;
      document.getElementById('passportExplanation').textContent=mode==='restore'?
        'Saabus sinu isiklik edasijõudmise link. Soovi korral saad seda salvestust kasutada.':
        'Salvesta oma korrutamise missioonid isiklikku linki, et teises seadmes jätkata.';
      if(!dialog.open)dialog.showModal();
    }
    async function makeLink(){
      status.textContent='Valmistan linki…';
      try{
        const record={type:'edukass-korrutamine-passport',v:1,savedAt:Date.now(),progress:store.load()};
        const code=await encode(record);
        latestLink=location.origin+location.pathname+'#ekpass='+code;
        link.value=latestLink;link.hidden=false;actions.hidden=false;
        status.textContent='Isiklik link on valmis!';
      }catch(error){status.textContent='Linki ei õnnestunud luua: '+error.message;}
    }
    async function copyLink(){
      if(!latestLink)return;
      let success=false;
      try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(latestLink);success=true}}catch(error){}
      if(!success){
        link.focus();link.select();
        try{success=document.execCommand('copy')}catch(error){}
      }
      status.textContent=success?'Link kopeeritud!':'Vali tekst ja kopeeri käsitsi.';
    }
    async function sendLink(){
      if(!latestLink)return;
      if(typeof navigator.share==='function'){
        try{await navigator.share({title:'EDUKASS – Minu edusammud',url:latestLink});return}
        catch(error){if(error?.name==='AbortError')return}
      }
      await copyLink();
    }
    async function prepareImport(code){
      show('restore');
      document.getElementById('passportRestore').hidden=true;
      status.textContent='Kontrollin salvestust…';
      try{
        pending=validate(await decode(code),store,config.missions.length,config.storage.progressSchemaVersion);
        const done=pending.completedLevels.length;
        document.getElementById('passportImportSummary').textContent='Salvestatud on '+done+' / '+config.missions.length+' missiooni.';
        document.getElementById('passportRestore').hidden=false;
        status.textContent='Salvestus on kontrollitud.';
      }catch(error){pending=null;status.textContent='Link ei sobi: '+error.message;}
    }
    function restore(){
      if(!pending)return;
      try{
        store.save(pending);
        pending=null;dialog.close();
        // Reload the active game so its in-memory progress picks up the restored save.
        history.replaceState(history.state,'',location.pathname+location.search+'#missions');
        location.reload();
      }catch(error){status.textContent='Salvestamine ebaõnnestus. Proovi uuesti.';}
    }
    document.getElementById('openPassportButton').addEventListener('click',()=>show('create'));
    create.addEventListener('click',makeLink);
    document.getElementById('passportCopy').addEventListener('click',copyLink);
    document.getElementById('passportSend').addEventListener('click',sendLink);
    document.getElementById('passportRestore').addEventListener('click',restore);
    document.getElementById('passportClose').addEventListener('click',()=>dialog.close());
    document.getElementById('passportDecline').addEventListener('click',()=>{pending=null;dialog.close()});
    dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
    if(incoming!==null)Promise.resolve().then(()=>prepareImport(incoming));
  }
  return {encode,decode,validate,init};
});
