(()=>{
  const PARTS=Array.from({length:6},(_,i)=>`./poster-pretty/${i}.txt?v=20260909-2`);
  let posterPromise=null;

  function loadPoster(){
    if(posterPromise)return posterPromise;
    posterPromise=Promise.all(PARTS.map(async url=>{
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok)throw new Error(`poster part ${r.status}`);
      return (await r.text()).trim();
    })).then(parts=>{
      const src='data:image/jpeg;base64,'+parts.join('');
      return new Promise((resolve,reject)=>{
        const probe=new Image();
        probe.onload=()=>resolve(src);
        probe.onerror=()=>reject(new Error('poster decode failed'));
        probe.src=src;
      });
    });
    return posterPromise;
  }

  async function fix(){
    const imgs=[...document.querySelectorAll('img[src*="poster-vesi-ja-jogi"]')];
    if(!imgs.length)return;
    try{
      const src=await loadPoster();
      imgs.forEach(img=>{
        img.src=src;
        img.removeAttribute('srcset');
        img.style.visibility='visible';
        img.style.display='block';
        img.style.width='100%';
        img.style.maxWidth='100%';
        img.style.height='auto';
        img.style.objectFit='contain';
        img.dataset.prettyPoster='ready';
      });
    }catch(e){
      imgs.forEach(img=>{
        img.src='./poster-vesi-ja-jogi.svg?v=20260909-2';
        img.style.visibility='visible';
        img.style.display='block';
        img.style.width='100%';
        img.style.maxWidth='100%';
        img.style.height='auto';
        img.dataset.prettyPoster='fallback';
      });
    }
  }

  const card=document.getElementById('card');
  if(card)new MutationObserver(fix).observe(card,{childList:true,subtree:true});
  fix();
})();