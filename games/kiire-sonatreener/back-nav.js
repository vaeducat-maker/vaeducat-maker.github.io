(()=>{
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const restart=document.getElementById('restart');
  if(!card||!libraryBtn||!restart)return;

  const style=document.createElement('style');
  style.textContent=`
    .app-back-button{
      align-self:flex-start;
      min-height:42px;
      padding:8px 14px;
      border-radius:14px;
      border:1px solid var(--line,#dfe7e2);
      background:#fff;
      color:var(--green,#2f6f58);
      font-weight:850;
      font-size:15px;
      box-shadow:0 4px 12px rgba(42,70,56,.05);
    }
    .app-back-button[hidden]{display:none!important}
  `;
  document.head.appendChild(style);

  const back=document.createElement('button');
  back.type='button';
  back.id='appBackBtn';
  back.className='app-back-button';
  back.textContent='← Назад';
  back.hidden=true;
  const brand=document.querySelector('.brand');
  (brand||document.querySelector('.app')).insertAdjacentElement('afterend',back);

  function isLibrary(){
    return !!card.querySelector('.library-heading') ||
      (!!card.querySelector('.empty') && !card.querySelector('.topic-intro'));
  }

  function canGoBackInside(){
    return !!(
      card.querySelector('.topic-intro') ||
      card.querySelector('.poster-view') ||
      card.querySelector('.review-wrap') ||
      card.querySelector('.typing-wrap') ||
      card.querySelector('.done')
    );
  }

  function sync(){
    back.hidden=isLibrary()||!canGoBackInside();
  }

  function goBackInside(){
    if(card.querySelector('.poster-view')||card.querySelector('.review-wrap')||card.querySelector('.typing-wrap')){
      if(!restart.hidden){restart.click();return true}
    }

    const doneBack=card.querySelector('#backTopic,#typingBackTopic');
    if(doneBack){doneBack.click();return true}

    if(card.querySelector('.topic-intro')){
      libraryBtn.click();
      return true;
    }

    return false;
  }

  back.addEventListener('click',goBackInside);

  new MutationObserver(sync).observe(card,{childList:true,subtree:true});
  new MutationObserver(sync).observe(restart,{attributes:true,attributeFilter:['hidden']});
  sync();

  try{
    if(!history.state||!history.state.edukassBase){
      history.replaceState({...(history.state||{}),edukassBase:true},'');
    }
    history.pushState({edukassGuard:true},'');
    window.addEventListener('popstate',()=>{
      if(goBackInside()){
        history.pushState({edukassGuard:true},'');
      }else{
        history.back();
      }
    });
  }catch(e){}

  const questionsScript=document.createElement('script');
  questionsScript.src='./questions.js?v=20260912-1';
  document.body.appendChild(questionsScript);
})();
