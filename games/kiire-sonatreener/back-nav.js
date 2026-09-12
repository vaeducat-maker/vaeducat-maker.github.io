(()=>{
  const card=document.getElementById('card');
  const libraryBtn=document.getElementById('libraryBtn');
  const restart=document.getElementById('restart');
  if(!card||!libraryBtn||!restart)return;

  const EXAM_KEY='sonatreenerTypingExamTopicV1';
  const getExamLock=()=>{try{return localStorage.getItem(EXAM_KEY)||''}catch(e){return ''}};
  const setExamLock=value=>{try{localStorage.setItem(EXAM_KEY,value)}catch(e){}};
  const clearExamLock=()=>{try{localStorage.removeItem(EXAM_KEY)}catch(e){}document.body.classList.remove('typing-exam-active')};
  const topicName=()=>card.querySelector('.topic-intro h2')?.textContent.trim()||'';
  const isTypingExamActive=()=>!!(getExamLock()&&card.querySelector('.typing-wrap'));

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
    .typing-exam-active .app-back-button{display:none!important}
    .exam-lock-note{
      padding:11px 12px;
      border:1px solid #eadbb6;
      border-radius:12px;
      background:#fff9e9;
      color:#705b28;
      font-size:14px;
      font-weight:750;
      line-height:1.35;
      text-align:center;
    }
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

  function guardExam(){
    const locked=getExamLock();
    const typing=card.querySelector('.typing-wrap');
    const finishedTyping=card.querySelector('.done #typingAgain');

    if(finishedTyping&&locked){
      clearExamLock();
      sync();
      return;
    }

    if(typing&&locked){
      document.body.classList.add('typing-exam-active');
      restart.hidden=true;
      const poster=card.querySelector('#typingPoster');
      if(poster){poster.hidden=true;poster.disabled=true}
      if(!typing.querySelector('.exam-lock-note')){
        typing.insertAdjacentHTML('afterbegin','<div class="exam-lock-note">🔒 Контрольная: подсказки, карточки, плакат и конспект закрыты до конца.</div>');
      }
      sync();
      return;
    }

    document.body.classList.remove('typing-exam-active');
    const current=topicName();
    if(!locked||!current||locked!==current){sync();return}

    ['posterOpen','posterBtn','cardsRuEt','cardsEtRu','lessonSummaryBtn','questionCardsBtn'].forEach(id=>{
      const el=card.querySelector('#'+id);
      if(el){el.hidden=true;el.disabled=true}
    });
    const typingBtn=card.querySelector('#typingBtn');
    if(typingBtn)typingBtn.textContent='✍️ Пройти контрольную';
    const actions=card.querySelector('.topic-actions');
    if(actions&&!actions.querySelector('.exam-lock-note')){
      actions.insertAdjacentHTML('afterbegin','<div class="exam-lock-note">🔒 Контрольная не завершена. Чтобы снова открыть карточки, плакат и конспект, сначала пройди написание до конца.</div>');
    }
    sync();
  }

  function sync(){
    back.hidden=isLibrary()||!canGoBackInside()||isTypingExamActive();
  }

  function goBackInside(){
    if(isTypingExamActive())return true;

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

  document.addEventListener('click',e=>{
    const btn=e.target.closest('button');
    if(!btn)return;

    if(btn.id==='typingBtn'){
      const current=topicName();
      if(current)setExamLock(current);
      return;
    }

    const locked=getExamLock();
    if(!locked)return;

    if(['posterOpen','posterBtn','cardsRuEt','cardsEtRu','lessonSummaryBtn','questionCardsBtn','typingPoster'].includes(btn.id)){
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if((btn.id==='restart'||btn.id==='appBackBtn')&&card.querySelector('.typing-wrap')){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  back.addEventListener('click',goBackInside);

  new MutationObserver(()=>{guardExam();sync()}).observe(card,{childList:true,subtree:true});
  new MutationObserver(sync).observe(restart,{attributes:true,attributeFilter:['hidden']});
  guardExam();
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
})();
