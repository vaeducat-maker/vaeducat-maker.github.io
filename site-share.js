(function(){
  'use strict';

  const button=document.querySelector('#shareMathGameButton');
  const status=document.querySelector('#mathShareStatus');
  const shareUrl='https://edukass.ee/games/korrutamine-test/';
  if(!button||!status)return;

  async function copyLink(){
    try{
      await navigator.clipboard.writeText(shareUrl);
      status.textContent='LINK KOPEERITUD!';
    }catch(error){
      window.prompt('Kopeeri mängu link:',shareUrl);
    }
  }

  button.addEventListener('click',async()=>{
    status.textContent='';
    if(typeof navigator.share!=='function'){
      await copyLink();
      return;
    }
    try{
      await navigator.share({
        title:'Jaga mängu',
        text:'Proovi EDUKASSi korrutustabeli treenerit!',
        url:shareUrl
      });
    }catch(error){
      if(error?.name!=='AbortError')await copyLink();
    }
  });
})();
