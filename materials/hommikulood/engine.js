export function freshProgress(count=4){return Array.from({length:count},()=>({page:0,answers:Array(5).fill(null),checked:Array(5).fill(false),attempts:Array(5).fill(0),errors:Array(5).fill(0),firstCorrect:Array(5).fill(null)}));}
export function choose(progress,story,question,choice){
  if(!Number.isInteger(story)||story<0||story>=progress.length||!Number.isInteger(question)||question<0||question>=5||!Number.isInteger(choice)||choice<0||choice>3)throw new Error('Invalid choice');
  if(progress[story].answers[question]===choice)return;
  progress[story].answers[question]=choice;progress[story].checked[question]=false;
}
export function check(progress,stories,story,question){
  const p=progress[story];if(!p||!Number.isInteger(question)||question<0||question>=5)throw new Error('Invalid question');
  if(p.answers[question]===null)return {empty:true,correct:false};
  const correct=p.answers[question]===stories[story].questions[question][2].charCodeAt(0)-65;
  if(!p.checked[question]){
    p.attempts[question]++;
    if(!correct)p.errors[question]++;
    if(p.firstCorrect[question]===null)p.firstCorrect[question]=correct;
  }
  p.checked[question]=true;
  return {empty:false,correct,errors:p.errors[question]};
}
export function score(progress,stories,story){return progress[story].answers.reduce((n,a,q)=>n+(progress[story].checked[q]&&a===stories[story].questions[q][2].charCodeAt(0)-65?1:0),0);}
export function isCorrect(progress,stories,story,q){return progress[story].checked[q]&&progress[story].answers[q]===stories[story].questions[q][2].charCodeAt(0)-65;}
export function errorCount(progress,story){return progress[story].errors.reduce((a,b)=>a+b,0);}
export function firstCorrectCount(progress,story){return progress[story].firstCorrect.filter(v=>v===true).length;}

// Keep this key stable. Future schema changes must migrate existing saves.
export const progressKey='edukass-hommikulood-progress';
export function encodeProgress(state){
  const {view,story,page,question,progress}=state;
  return JSON.stringify({version:1,view,story,page,question,progress});
}
export function decodeProgress(raw,pageCounts){
  if(raw===null)return null;
  const saved=JSON.parse(raw),integer=(n,max)=>Number.isSafeInteger(n)&&n>=0&&n<max;
  if(!saved||saved.version!==1||!['home','read','quiz','result'].includes(saved.view)||
    !integer(saved.story,pageCounts.length)||!integer(saved.question,5)||
    !Array.isArray(saved.progress)||saved.progress.length!==pageCounts.length)throw Error('Invalid saved progress');
  const progress=saved.progress.map((p,i)=>{
    if(!p||!integer(p.page,pageCounts[i]))throw Error('Invalid saved page');
    const fields=['answers','checked','attempts','errors','firstCorrect'];
    if(fields.some(key=>!Array.isArray(p[key])||p[key].length!==5))throw Error('Invalid saved answers');
    for(let q=0;q<5;q++){
      if(!(p.answers[q]===null||integer(p.answers[q],4))||typeof p.checked[q]!=='boolean'||
        !integer(p.attempts[q],Number.MAX_SAFE_INTEGER)||!integer(p.errors[q],Number.MAX_SAFE_INTEGER)||
        p.errors[q]>p.attempts[q]||!(p.firstCorrect[q]===null||typeof p.firstCorrect[q]==='boolean')||
        (p.checked[q]&&(p.answers[q]===null||p.attempts[q]===0))||
        (p.attempts[q]===0)!==(p.firstCorrect[q]===null))throw Error('Invalid saved statistics');
    }
    return Object.fromEntries([['page',p.page],...fields.map(key=>[key,p[key].slice()])]);
  });
  // Only reading uses the global page; other views can retain another story's page.
  const page=saved.view==='read'?saved.page:progress[saved.story].page;
  if(!integer(page,pageCounts[saved.story]))throw Error('Invalid saved location');
  return {view:saved.view,story:saved.story,page,question:saved.question,progress,empty:false};
}
