(()=>{
  const PARTS=Array.from({length:6},(_,i)=>`./poster-pretty/${i}.txt?v=20260909-1`);
  let posterPromise=null;

  function loadPoster(){
    if(!posterPromise){
      posterPromise=Promise.all(PARTS.map(async url=>{
        const r=await fetch(url,{cache:'no-store'});
        if(!r.ok)throw new Error(`poster part ${r.status}`);
        return (await r.text()).trim();
      })).then(parts=>'data:image/jpeg;base64,'+parts.join(''));
    }
    return posterPromise;
  }

  async function fix(){
    const imgs=[...document.querySelectorAll('img[src*="poster-vesi-ja-jogi"]')];
    if(!imgs.length)return;
    imgs.forEach(img=>{
      if(!img.dataset.prettyPoster){
        img.dataset.prettyPoster='loading';
        img.style.visibility='hidden';
        img.style.display='block';
        img.style.width='100%';
        img.style.maxWidth='100%';
        img.style.height='auto';
        img.style.objectFit='contain';
      }
    });
    try{
      const src=await loadPoster();
      imgs.forEach(img=>{
        img.src=src;
        img.removeAttribute('srcset');
        img.onload=()=>{img.style.visibility='visible';img.dataset.prettyPoster='ready'};
        if(img.complete&&img.naturalWidth>0){img.style.visibility='visible';img.dataset.prettyPoster='ready'}
      });
    }catch(e){
      imgs.forEach(img=>{
        img.src='./poster-vesi-ja-jogi.svg?v=20260909-1';
        img.style.visibility='visible';
        img.dataset.prettyPoster='fallback';
      });
    }
  }

  const card=document.getElementById('card');
  if(card)new MutationObserver(fix).observe(card,{childList:true,subtree:true});
  fix();
})();