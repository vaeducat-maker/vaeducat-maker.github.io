(()=>{
  const fresh='./poster-pretty.jpg?fresh=20260909-1750';
  async function clearOld(){
    try{
      if('serviceWorker' in navigator){
        const regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r=>r.unregister()));
      }
      if(window.caches){
        const keys=await caches.keys();
        await Promise.all(keys.map(k=>caches.delete(k)));
      }
    }catch(e){}
  }
  function apply(){
    document.querySelectorAll('img[src*="poster-"]').forEach(img=>{
      if(img.dataset.posterFresh==='1')return;
      img.dataset.posterFresh='1';
      img.src=fresh;
      img.removeAttribute('srcset');
      img.style.display='block';
      img.style.visibility='visible';
      img.style.width='100%';
      img.style.maxWidth='100%';
      img.style.height='auto';
      img.style.objectFit='contain';
    });
  }
  clearOld().then(apply);
  const card=document.getElementById('card');
  if(card)new MutationObserver(apply).observe(card,{childList:true,subtree:true});
  apply();
})();
