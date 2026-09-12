(()=>{
const QUESTIONS=[
{q:'Mis on veekogu?',a:'Veekogu on jõgi, järv, meri ja ookean.'},
{q:'Mis on jõgi?',a:'Jõgi on mageveeline veekogu.'},
{q:'Mis on jõelähe?',a:'Jõelähe on koht, kust algab jõgi.'},
{q:'Mis on jõesäng?',a:'Jõesäng on sügav koht, milles voolab vesi.'},
{q:'Mis on jõesuue?',a:'Jõesuue on koht, kus jõgi lõpeb ja suubub teise veekogusse.'},
{q:'Millised on vee omadused?',a:'Imavus, värvitu, lõhnatu, läbipaistev, voolavus, maitsetu.'}
];
const card=document.getElementById('card');
const restart=document.getElementById('restart');
const counter=document.getElementById('counter');
const pill=document.getElementById('pill');
const reviewBtn=document.getElementById('reviewBtn');
const libraryBtn=document.getElementById('libraryBtn');
const tabEt=document.getElementById('tabEt');
const tabDe=document.getElementById('tabDe');
let active=false,queue=[],good=0,bad=0,flipped=false;
const shuffle=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'})[c]);
function lock(on){tabEt.disabled=on;tabDe.disabled=on;reviewBtn.hidden=on;libraryBtn.hidden=on}
function addButton(){
const h=card.querySelector('.topic-intro h2');
if(!h||h.textContent.trim()!=='Vesi ja jõgi')return;
const actions=card.querySelector('.topic-actions');
if(!actions||actions.querySelector('#questionCardsBtn'))return;
const b=document.createElement('button');b.id='questionCardsBtn';b.className='secondary';b.textContent='❓ Вопросы и определения';b.onclick=start;actions.appendChild(b);
}
function start(){active=true;queue=shuffle(QUESTIONS);good=0;bad=0;lock(true);restart.hidden=false;restart.textContent='← Выйти';pill.textContent='❓ Вопросы';render()}
function render(){
if(!queue.length){finish();return}
const x=queue[0];flipped=false;counter.textContent=`Осталось: ${queue.length}`;
card.innerHTML=`<div class="review-wrap"><div class="flashcard" id="qflash"><div class="flashcard-inner"><div class="flash-face">${esc(x.q)}</div><div class="flash-face flash-back">${esc(x.a)}</div></div></div><div class="review-stats"><span>✓ ${good}</span><span>✕ ${bad}</span></div><div class="review-actions" id="qactions" hidden><button class="review-no" id="qno">✕</button><button class="review-yes" id="qyes">✓</button></div><div class="tiny" style="text-align:center">Нажми на карточку, чтобы увидеть ответ</div></div>`;
const f=card.querySelector('#qflash'),a=card.querySelector('#qactions');f.onclick=()=>{if(flipped)return;flipped=true;f.classList.add('flipped');a.hidden=false};card.querySelector('#qyes').onclick=()=>decide(true);card.querySelector('#qno').onclick=()=>decide(false)
}
function decide(ok){const x=queue.shift();if(ok){good++;render();return}bad++;if(queue.length===0){const alt=shuffle(QUESTIONS.filter(y=>y.q!==x.q))[0];if(alt)queue.push(alt)}const pos=Math.min(queue.length,Math.max(1,2+Math.floor(Math.random()*2)));queue.splice(pos,0,x);render()}
function finish(){active=false;lock(false);counter.textContent='';pill.textContent='Готово';restart.hidden=true;card.innerHTML=`<div class="done"><div class="big">❓</div><h2>Готово!</h2><div class="finish-actions"><button class="primary" id="qagain">Ещё раз вопросы</button><button class="secondary" id="qback">К уроку</button></div></div>`;card.querySelector('#qagain').onclick=start;card.querySelector('#qback').onclick=()=>tabEt.click()}
restart.addEventListener('click',()=>{if(active){active=false;lock(false);setTimeout(()=>tabEt.click(),0)}},true);
new MutationObserver(addButton).observe(card,{childList:true,subtree:true});addButton();
})();
