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
