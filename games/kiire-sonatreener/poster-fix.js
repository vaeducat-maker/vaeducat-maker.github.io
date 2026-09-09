(()=>{
  const P='./poster-vesi-ja-jogi-beautiful.jpg?v=20260909-1';
  function fix(){
    document.querySelectorAll('img[src*="poster-vesi-ja-jogi"]').forEach(img=>{
      if(!img.src.includes('poster-vesi-ja-jogi-beautiful.jpg')){
        img.src=P;
        img.removeAttribute('srcset');
      }
      img.style.display='block';
      img.style.width='100%';
      img.style.maxWidth='100%';
      img.style.height='auto';
      img.style.objectFit='contain';
    });
  }
  const card=document.getElementById('card');
  if(card)new MutationObserver(fix).observe(card,{childList:true,subtree:true});
  fix();
})();