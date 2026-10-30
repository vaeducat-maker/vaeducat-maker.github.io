/* EDUKASS — mastered curriculum review. Isolated from approved arithmetic renderer.
   Only activated when ALL 52 skills are genuinely mastered in the existing profile.
   Never alters a skill, world, score or save by itself. */
(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.EDUKASS_REVIEW_MODE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const TYPES=[['add','A',10],['sub','S',12],['mul','M',14],['div','D',16]];
  function masteredCount(profile){
    if(!profile?.ops)return 0;
    let count=0;
    for(const [op,prefix,max] of TYPES){
      const skills=profile.ops[op]?.skills;
      if(!skills)continue;
      for(let n=1;n<=max;n++)if(skills[prefix+n]?.mastered===true)count++;
    }
    return count;
  }
  function isComplete(profile){return masteredCount(profile)===52}
  function weightedSkill(opState,prefix,max,session,now){
    const recent=new Set(session.reviewRecent||[]);
    const candidates=[];
    for(let n=1;n<=max;n++){
      const skill=prefix+n,s=opState.skills[skill];
      if(!s?.mastered)continue;
      // All levels take part, but easy early stages do not dominate practice.
      let weight=0.5+2.0*n/max;
      // Genuine spaced revisions and still-unverified skills take priority.
      if(!s.verified)weight*=2.5;
      if(s.nextReviewAt>0&&s.nextReviewAt<=now)weight*=4;
      const attempts=Math.max(1,Number(s.attempts)||1);
      const ratio=(Number(s.firstTry)||0)/attempts;
      if(s.errors>0&&ratio<0.8)weight*=2.3;
      if((Number(s.cleanStreak)||0)<2)weight*=1.4;
      if(recent.has(skill))weight*=0.015;
      candidates.push({skill,weight});
    }
    if(!candidates.length)throw new Error('Review: no mastered skills in '+prefix);
    const total=candidates.reduce((sum,c)=>sum+c.weight,0);
    let ticket=Math.max(0,Math.min(0.999999999,Number(session.rng())||0))*total;
    for(const c of candidates){ticket-=c.weight;if(ticket<0)return c.skill}
    return candidates[candidates.length-1].skill;
  }
  function nextAssignment(session){
    if(!isComplete(session.profile))throw new Error('Review locked before 52 mastered skills');
    const count=Number(session.reviewCursor)||0;
    const [op,prefix,max]=TYPES[(count+(session.profile.sessionNo||0))%4];
    session.reviewCursor=count+1;
    const dueRetry=session.retryQueue?.find(x=>x.op===op&&x.dueAt<=session.index);
    let skill,reason;
    if(dueRetry){
      session.retryQueue.splice(session.retryQueue.indexOf(dueRetry),1);
      skill=dueRetry.skill;reason='retry';
    }else{
      skill=weightedSkill(session.profile.ops[op],prefix,max,session,Date.now());
      reason='mixed-review';
    }
    session.reviewRecent??=[];
    session.reviewRecent.push(skill);
    if(session.reviewRecent.length>12)session.reviewRecent.shift();
    session.index++;
    return{op,skill,reason,index:session.index};
  }
  return{TYPES,masteredCount,isComplete,nextAssignment};
});
