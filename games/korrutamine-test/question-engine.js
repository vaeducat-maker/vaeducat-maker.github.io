(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.EDUKASS_QUESTION_ENGINE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  function fixedMultiplication(a,b){
    return {
      a,
      b,
      answer:a*b,
      operation:'multiply',
      factor:a===2?b:(b===2?a:Math.max(a,b)),
      table:a===1||b===1?1:2
    };
  }

  function multiplication(table,factor,reverse=false){
    return {
      a:reverse?factor:table,
      b:reverse?table:factor,
      answer:table*factor,
      operation:'multiply',
      factor,
      table:table===1||factor===1?1:table
    };
  }

  function division(factor,divisor=2){
    return {
      a:factor*divisor,
      b:divisor,
      answer:factor,
      operation:'divide',
      factor,
      table:divisor
    };
  }

  function create({config,getFactStats=()=>({}),random=Math.random}){
    const practiceTable=config.practiceTable||2;
    const practiceFactors=config.practiceFactors||[1,2,3,4,5,6,7,8,9,10];

    function shuffle(array){
      const copy=[...array];
      for(let index=copy.length-1;index>0;index--){
        const other=Math.floor(random()*(index+1));
        [copy[index],copy[other]]=[copy[other],copy[index]];
      }
      return copy;
    }

    function equationKey(question){
      if(!question)return '';
      return `${question.operation}:${question.a}:${question.b}`;
    }

    function avoidAdjacentDuplicates(questions){
      const pool=[...questions];
      const arranged=[];
      let previousKey='';
      while(pool.length){
        const counts=new Map();
        pool.forEach(question=>counts.set(equationKey(question),(counts.get(equationKey(question))||0)+1));
        const eligibleKeys=[...counts.entries()]
          .filter(([key])=>key!==previousKey)
          .sort((left,right)=>right[1]-left[1]);
        if(!eligibleKeys.length)break;
        const highestCount=eligibleKeys[0][1];
        const strongestKeys=eligibleKeys.filter(([,count])=>count===highestCount).map(([key])=>key);
        const chosenKey=strongestKeys[Math.floor(random()*strongestKeys.length)];
        const candidateIndexes=[];
        pool.forEach((question,index)=>{if(equationKey(question)===chosenKey)candidateIndexes.push(index)});
        const chosenIndex=candidateIndexes[Math.floor(random()*candidateIndexes.length)];
        const [question]=pool.splice(chosenIndex,1);
        arranged.push(question);
        previousKey=chosenKey;
      }
      return [...arranged,...pool];
    }

    function repeatedMultiplication(factors,orientation='forward',copies=1,table=practiceTable){
      const questions=[];
      for(let copy=0;copy<copies;copy++){
        factors.forEach((factor,index)=>{
          const reverse=orientation==='reverse'||(orientation==='mixed'&&(index+copy)%2===1);
          questions.push(multiplication(table,factor,reverse));
        });
      }
      return questions;
    }

    function repeatedDivision(factors,copies=1,divisor=practiceTable){
      const questions=[];
      for(let copy=0;copy<copies;copy++)factors.forEach(factor=>questions.push(division(factor,divisor)));
      return questions;
    }

    function weakestFactors(operation,count=5){
      const factStats=getFactStats()||{};
      return practiceFactors
        .map(factor=>{
          const key=`${operation}:${factor}`;
          const stat=factStats[key]||{correct:0,mistakes:0};
          return {factor,score:(stat.mistakes*4)-stat.correct};
        })
        .sort((left,right)=>right.score-left.score||right.factor-left.factor)
        .slice(0,count)
        .map(item=>item.factor);
    }

    function buildFixedQuestions(questionSpecs){
      return questionSpecs.map(question=>question.operation==='divide'
        ?division(question.factor,question.divisor)
        :fixedMultiplication(question.a,question.b));
    }

    function buildQuestionGroup(group){
      if(group.type==='fixed')return buildFixedQuestions(group.questions);
      if(group.type==='multiplication')return repeatedMultiplication(group.factors,group.orientation,group.copies,group.table||practiceTable);
      if(group.type==='division')return repeatedDivision(group.factors,group.copies,group.divisor||practiceTable);
      if(group.type==='adaptive'){
        const factors=weakestFactors(group.operation,group.count);
        return group.operation==='divide'
          ?repeatedDivision(factors,group.copies,group.divisor||practiceTable)
          :repeatedMultiplication(factors,group.orientation,group.copies,group.table||practiceTable);
      }
      return [];
    }

    function buildQuestionPool(levelId){
      const mission=config.missions.find(item=>item.id===levelId);
      const groups=mission?.questionGroups||config.fallbackQuestionGroups;
      return groups.flatMap(buildQuestionGroup);
    }

    function buildLevelQuestions(levelId){
      const questions=buildQuestionPool(levelId);
      return avoidAdjacentDuplicates(shuffle(questions).slice(0,config.roundLength));
    }

    function separatorQuestion(level,lastKey){
      const candidates=[];
      practiceFactors.forEach(factor=>{
        if(level.operation==='divide')candidates.push(division(factor,practiceTable));
        else if(level.operation==='mixed')candidates.push(factor%2===0?division(factor,practiceTable):multiplication(practiceTable,factor));
        else candidates.push(multiplication(practiceTable,factor));
      });
      return shuffle(candidates).find(question=>equationKey(question)!==lastKey)||null;
    }

    function questionKey(question){
      const operation=question.operation==='divide'?'divide':'multiply';
      return `${operation}:${question.factor}`;
    }

    function buildChoiceOptions(question){
      const answer=question.answer;
      const step=question.operation==='multiply'?question.table:1;
      const candidates=[answer,answer-step,answer+step,answer-1,answer+1,answer+(step*2),answer-(step*2),answer+3];
      const unique=[];
      candidates.forEach(value=>{
        if(Number.isInteger(value)&&value>=0&&value<=100&&!unique.includes(value))unique.push(value);
      });
      let filler=1;
      while(unique.length<4){
        const value=answer+filler;
        if(value<=100&&!unique.includes(value))unique.push(value);
        filler++;
      }
      const wrong=shuffle(unique.filter(value=>value!==answer)).slice(0,3);
      return shuffle([answer,...wrong]);
    }

    return {
      avoidAdjacentDuplicates,
      buildChoiceOptions,
      buildLevelQuestions,
      buildQuestionPool,
      equationKey,
      questionKey,
      separatorQuestion,
      shuffle
    };
  }

  return {create,fixedMultiplication,multiplication,division};
});
