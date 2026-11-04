(function litTunnikontrollAliceLewis(){
'use strict';
const card=document.getElementById('card'),libraryBtn=document.getElementById('libraryBtn'),pill=document.getElementById('pill'),sub=document.getElementById('sub');
if(!card||!libraryBtn)return;
const sections=[{"title":"Lewis Carroll","subtitle":"Lõpeta laused","items":[["Lewis Carroll elas","Inglismaal üheksateistkümnendal sajandil.","Льюис Кэрролл жил в Англии в девятнадцатом веке."],["Tema pärisnimi oli","Charles Lutwidge Dodgson.","Его настоящее имя было Чарльз Лютвидж Доджсон."],["Ta oli inglise","kirjanik, matemaatik, loogik ja fotograaf.","Он был английским писателем, математиком, логиком и фотографом."],["Kõige kuulsam teos on","„Alice’i seiklused Imedemaal“.","Самое известное произведение — «Приключения Алисы в Стране чудес»."],["Tema lood on täis","fantaasiat, naljakaid tegelasi ja sõnamänge.","Его истории полны фантазии, забавных персонажей и игры слов."],["Lewis Carroll armastas","mõistatusi, mänge ja lugude jutustamist.","Льюис Кэрролл любил загадки, игры и рассказывать истории."],["„Alice Imedemaal” on üks maailma","kuulsamaid lasteraamatuid.","«Алиса в Стране чудес» — одна из самых известных детских книг в мире."],["Tema teoste järgi on tehtud palju","filme ja lavastusi.","По его произведениям снято много фильмов и поставлено много спектаклей."]]},{"title":"Alice Imedemaal","subtitle":"Lõpeta laused raamatu järgi","items":[["Raamat räägib tüdrukust, kes","satub imelikku maailma.","Книга рассказывает о девочке, которая попадает в странный мир."],["Raamatu tegelaste hulgas on","Valge Küülik, Irvik Kass, Kübarsepp ja Ärtuemand.","Среди персонажей книги — Белый Кролик, Чеширский Кот, Шляпник и Червонная Королева."],["Raamat jutustab","Alice’i seiklustest Imedemaal.","Книга рассказывает о приключениях Алисы в Стране чудес."],["Tegelased","on kummalised ja naljakad.","Персонажи странные и смешные."],["Raamatus kohtab peategelane","Valget Küülikut, Irvik Kassi, Kübarseppa ja Ärtuemandat.","В книге главная героиня встречает Белого Кролика, Чеширского Кота, Шляпника и Червонную Королеву."],["Raamat räägib sellest,","kuidas Alice satub Imedemaale ja kogeb seal imelikke seiklusi.","Книга рассказывает о том, как Алиса попадает в Страну чудес и переживает там необычные приключения."]]}];
if(!document.getElementById('lit-tn-styles')){const style=document.createElement('style');style.id='lit-tn-styles';style.textContent=".lit-tn{display:grid;gap:15px;max-width:780px;margin:0 auto}.lit-tn h2{font-size:clamp(24px,6vw,34px);color:#2f6f58;margin:3px 0}.lit-tn h3{font-size:20px;color:#2f6f58;margin:0}.lit-tn-note{font-size:14px;color:#65766d;line-height:1.5;margin:0}.lit-tn-legend{font-size:14px;color:#65766d}.lit-tn-legend b{color:#17613c}.lit-tn-controls{display:flex;flex-wrap:wrap;gap:8px}.lit-tn-controls button{flex:1 1 170px}.lit-tn-section{display:grid;gap:10px;background:#fff;border:1px solid #dfe8e2;border-radius:15px;padding:14px}.lit-tn-sectionhead{padding-bottom:7px;border-bottom:1px solid #e3ebe5}.lit-tn-sectionhead small{font-size:13px;color:#6b8072}.lit-tn-item{background:#f4f8f5;padding:12px;border-radius:11px}.lit-tn-number{font-size:12px;font-weight:700;color:#7b9083;margin-bottom:5px}.lit-tn-sentence{font-size:18px;line-height:1.55;color:#253f32;overflow-wrap:anywhere}.lit-tn-prompt{font-weight:450}.lit-tn-answer{color:#17613c;font-weight:850}.lit-tn-blank{color:#799286;letter-spacing:1px}.lit-tn-ru{margin-top:8px;padding-top:8px;border-top:1px dashed #cbdccf;color:#53685d;font-size:15px;line-height:1.5}.lit-tn-small{margin-top:8px;padding:6px 10px;border-radius:8px;border:1px solid #d3e4d9;background:white;color:#2f6f58;font-weight:750;font-size:13px;cursor:pointer}@media(max-width:560px){.lit-tn-section{padding:11px}.lit-tn-item{padding:11px}.lit-tn-sentence{font-size:17px}}";document.head.appendChild(style);}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let showAnswers=true,showAllRu=false;
function render(){
if(pill)pill.textContent='📖 Eesti kirjandus';
if(sub)sub.textContent='Урок 9 · Tunnikontroll · 04.11.2026';
const content=sections.map(section=>
'<section class="lit-tn-section"><div class="lit-tn-sectionhead"><h3>'+esc(section.title)+'</h3><small>'+esc(section.subtitle)+'</small></div>'+
section.items.map(([prompt,answer,ru],i)=>
'<div class="lit-tn-item"><div class="lit-tn-number">'+(i+1)+'.</div>'+
'<div class="lit-tn-sentence" lang="et"><span class="lit-tn-prompt">'+esc(prompt)+'</span> '+
(showAnswers?'<strong class="lit-tn-answer">'+esc(answer)+'</strong>':'<span class="lit-tn-blank">................................</span>')+
'</div><div class="lit-tn-ru" lang="ru" '+(showAllRu?'':'hidden')+'>'+esc(ru)+'</div>'+
'<button class="lit-tn-small" type="button" data-tn-ru>'+(showAllRu?'🙈 Скрыть перевод':'🌐 Перевод')+'</button></div>'
).join('')+'</section>').join('');
card.innerHTML='<div class="lit-tn"><div class="topic-intro"><div class="topic-kicker">📖 Eesti kirjandus · Урок 9 · 04.11.2026</div>'+
'<h2>Tunnikontroll: Alice ja Lewis Carroll</h2><div class="tiny">14 предложений · подготовка к контрольной</div></div>'+
'<div class="lit-tn-legend">Обычный шрифт — текст учительницы. <b>Жирный зелёный — наш ответ.</b></div>'+
'<div class="lit-tn-controls"><button class="secondary" id="litTnAnswers">'+(showAnswers?'🙈 Скрыть ответы':'✅ Показать ответы')+'</button>'+
'<button class="secondary" id="litTnAllRu">'+(showAllRu?'🙈 Скрыть все переводы':'🌐 Показать все переводы')+'</button></div>'+
'<p class="lit-tn-note">Варианты ответов для подготовки, не официальный ключ. Перевод можно открывать по одному предложению.</p>'+
content+'<button type="button" class="secondary" id="litTnBack">← К предметам</button></div>';
card.querySelector('#litTnAnswers').onclick=()=>{
const states=[...card.querySelectorAll('.lit-tn-ru')].map(x=>!x.hidden);
showAnswers=!showAnswers;render();card.querySelectorAll('.lit-tn-ru').forEach((tr,i)=>{tr.hidden=!states[i];tr.nextElementSibling.textContent=states[i]?'🙈 Скрыть перевод':'🌐 Перевод';});};
card.querySelector('#litTnAllRu').onclick=()=>{showAllRu=!showAllRu;render();};
card.querySelectorAll('[data-tn-ru]').forEach(btn=>btn.onclick=()=>{const tr=btn.previousElementSibling;tr.hidden=!tr.hidden;btn.textContent=tr.hidden?'🌐 Перевод':'🙈 Скрыть перевод';});
card.querySelector('#litTnBack').onclick=()=>libraryBtn.click();
}
window.EDUKASS_LESSONS=window.EDUKASS_LESSONS||{};
window.EDUKASS_LESSONS.litTunnikontrollAliceLewis=render;
})();