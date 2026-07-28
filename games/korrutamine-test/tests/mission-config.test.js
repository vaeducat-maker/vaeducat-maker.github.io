const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const path=require('node:path');

const gameRoot=path.resolve(__dirname,'..');
const config=require(path.join(gameRoot,'chapter-one.config.js'));
const questionEngineApi=require(path.join(gameRoot,'question-engine.js'));

const EXPECTED_FIRST_CHAPTER_SIGNATURE='83fa3e428f49ac63046fb4529460ac1ae51a1a4c3ca595bcd9a36b5b7a720643';
const EXPECTED_CONTENT_SIGNATURE='82c62832a176824f592f75ef0ceb9293baf7673b085b101fcc5dac41ec59f137';
const SUPPORTED_GROUP_TYPES=new Set(['fixed','multiplication','division','adaptive']);
const SUPPORTED_MODES=new Set(['choice','input']);
const SUPPORTED_OPERATIONS=new Set(['multiply','divide','mixed']);

function seededRandom(seed){
  let state=seed>>>0;
  return ()=>{
    state=(state*1664525+1013904223)>>>0;
    return state/0x100000000;
  };
}

function canonicalQuestion(question){
  return [question.operation,question.a,question.b,question.answer,question.factor,question.table,question.statsTable??null];
}

function signatureForMissions(missions){
  const factScenarios=[
    {},
    {
      'multiply:3':{correct:0,mistakes:8},
      'multiply:9':{correct:5,mistakes:4},
      'divide:4':{correct:0,mistakes:10},
      'multiply:3:8':{correct:0,mistakes:12},
      'divide:3:7':{correct:0,mistakes:11}
    }
  ];
  const metadata=missions.map(mission=>[
    mission.id,
    mission.title,
    mission.short,
    mission.mode,
    mission.operation,
    mission.seconds,
    mission.accent
  ]);
  const pools=factScenarios.map(factStats=>{
    const engine=questionEngineApi.create({config,getFactStats:()=>factStats,random:seededRandom(1)});
    return missions.map(mission=>engine.buildQuestionPool(mission.id).map(canonicalQuestion));
  });
  return crypto.createHash('sha256').update(JSON.stringify({metadata,pools})).digest('hex');
}

function legacyFirstChapterSignature(){
  const missions=config.missions.slice(0,15);
  const factScenarios=[
    {},
    {
      'multiply:3':{correct:0,mistakes:8},
      'multiply:9':{correct:5,mistakes:4},
      'divide:4':{correct:0,mistakes:10}
    }
  ];
  const metadata=missions.map(mission=>[
    mission.id,mission.title,mission.short,mission.mode,mission.operation,mission.seconds,mission.accent
  ]);
  const pools=factScenarios.map(factStats=>{
    const engine=questionEngineApi.create({config,getFactStats:()=>factStats,random:seededRandom(1)});
    return missions.map(mission=>engine.buildQuestionPool(mission.id).map(question=>[
      question.operation,question.a,question.b,question.answer,question.factor,question.table
    ]));
  });
  return crypto.createHash('sha256').update(JSON.stringify({metadata,pools})).digest('hex');
}

function validateConfiguration(){
  assert.equal(config.schemaVersion,2,'Unexpected game configuration schema version.');
  assert.equal(config.roundLength,15,'A mission must require exactly 15 correct answers.');
  assert.equal(config.practiceTable,2,'The legacy first chapter must keep table 2 as its default.');
  assert.deepEqual(config.practiceFactors,[1,2,3,4,5,6,7,8,9,10]);
  assert.equal(config.missions.length,105,'The current build must contain missions 1–105.');
  assert.deepEqual(config.missions.map(mission=>mission.id),Array.from({length:105},(_,index)=>index+1));
  assert.deepEqual(config.chapters.map(chapter=>[chapter.id,chapter.startMissionId,chapter.endMissionId]),[[1,1,15],[2,16,33],[3,34,51],[4,52,69],[5,70,87],[6,88,105]]);
  assert.deepEqual(config.lesson.triggers.map(lesson=>[lesson.id,lesson.missionId,lesson.table]),[
    ['multiply-2',1,2],['divide-2',11,2],['multiply-3',16,3],['divide-3',26,3],
    ['multiply-4',34,4],['divide-4',44,4],['multiply-5',52,5],['divide-5',62,5],
    ['multiply-6',70,6],['divide-6',80,6],['multiply-7',88,7],['divide-7',98,7]
  ]);

  for(const mission of config.missions){
    assert.equal(typeof mission.title,'string',`Mission ${mission.id} needs a title.`);
    assert.equal(typeof mission.short,'string',`Mission ${mission.id} needs a short label.`);
    assert.equal(typeof mission.titleKey,'string',`Mission ${mission.id} needs a translation key for its title.`);
    assert.equal(typeof mission.shortKey,'string',`Mission ${mission.id} needs a translation key for its short label.`);
    assert(SUPPORTED_MODES.has(mission.mode),`Mission ${mission.id} has an unsupported answer mode.`);
    assert(SUPPORTED_OPERATIONS.has(mission.operation),`Mission ${mission.id} has an unsupported operation.`);
    assert(Number.isFinite(mission.seconds)&&mission.seconds>0,`Mission ${mission.id} needs a positive timer.`);
    assert(/^#[0-9a-f]{6}$/i.test(mission.accent),`Mission ${mission.id} has an invalid accent colour.`);
    assert(Array.isArray(mission.questionGroups)&&mission.questionGroups.length>0,`Mission ${mission.id} needs question groups.`);
    for(const group of mission.questionGroups){
      assert(SUPPORTED_GROUP_TYPES.has(group.type),`Mission ${mission.id} has an unsupported group type: ${group.type}`);
      if(group.type==='adaptive'&&group.families){
        assert(Array.isArray(group.families)&&group.families.length>0,`Mission ${mission.id} needs adaptive families.`);
      }
    }
  }

  assert.deepEqual(config.missions.slice(0,10).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(10,14).map(mission=>mission.operation),Array(4).fill('divide'));
  assert.equal(config.missions[14].operation,'mixed');
  assert.deepEqual(config.missions.slice(15,25).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(25,30).map(mission=>mission.operation),Array(5).fill('divide'));
  assert.deepEqual(config.missions.slice(30,33).map(mission=>mission.operation),Array(3).fill('mixed'));
  assert.deepEqual(config.missions.slice(33,43).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(43,48).map(mission=>mission.operation),Array(5).fill('divide'));
  assert.deepEqual(config.missions.slice(48,51).map(mission=>mission.operation),Array(3).fill('mixed'));
  assert.deepEqual(config.missions.slice(51,61).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(61,66).map(mission=>mission.operation),Array(5).fill('divide'));
  assert.deepEqual(config.missions.slice(66,69).map(mission=>mission.operation),Array(3).fill('mixed'));
  assert.deepEqual(config.missions.slice(69,79).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(79,84).map(mission=>mission.operation),Array(5).fill('divide'));
  assert.deepEqual(config.missions.slice(84,87).map(mission=>mission.operation),Array(3).fill('mixed'));
  assert.deepEqual(config.missions.slice(87,97).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(97,102).map(mission=>mission.operation),Array(5).fill('divide'));
  assert.deepEqual(config.missions.slice(102,105).map(mission=>mission.operation),Array(3).fill('mixed'));
  assert.deepEqual(config.missions.filter(mission=>mission.mode==='choice').map(mission=>mission.id),[1,11,16,26,34,44,52,62,70,80,88,98]);
  for(const missionId of [7,8,14,23,29,32,41,47,50,59,65,68,77,83,86,95,101,104]){
    assert(config.missions[missionId-1].questionGroups.some(group=>group.type==='adaptive'),`Mission ${missionId} must include adaptive practice.`);
  }
}

function validateGeneratedRounds(){
  const factScenarios=[
    {},
    {
      'multiply:3':{correct:0,mistakes:20},
      'multiply:9':{correct:0,mistakes:10},
      'divide:4':{correct:0,mistakes:20},
      'multiply:3:8':{correct:0,mistakes:30},
      'divide:3:7':{correct:0,mistakes:25}
    },
    Object.fromEntries([
      ...Array.from({length:10},(_,index)=>[`multiply:${index+1}`,{correct:index+1,mistakes:10-index}]),
      ...Array.from({length:10},(_,index)=>[`multiply:3:${index+1}`,{correct:index,mistakes:12-index}]),
      ...Array.from({length:10},(_,index)=>[`divide:3:${index+1}`,{correct:index,mistakes:11-index}])
    ])
  ];

  let checkedRounds=0;
  for(const factStats of factScenarios){
    for(const mission of config.missions){
      for(let seed=1;seed<=1000;seed++){
        const engine=questionEngineApi.create({config,getFactStats:()=>factStats,random:seededRandom(seed)});
        const round=engine.buildLevelQuestions(mission.id);
        assert.equal(round.length,config.roundLength,`Mission ${mission.id}, seed ${seed}: wrong round length.`);
        for(let index=0;index<round.length;index++){
          const question=round[index];
          assert(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<=100,`Mission ${mission.id}: invalid answer.`);
          if(question.operation==='multiply')assert.equal(question.a*question.b,question.answer,`Mission ${mission.id}: invalid multiplication.`);
          else{
            assert.equal(question.a/question.b,question.answer,`Mission ${mission.id}: invalid division.`);
            assert.equal(question.a%question.b,0,`Mission ${mission.id}: division has a remainder.`);
            if(question.b===1){
              assert.equal(mission.id,11,`Mission ${mission.id}: division by 1 is only preserved in the approved introductory mission 11.`);
            }else{
              assert([2,3,4,5,6,7].includes(question.b),`Mission ${mission.id}: unsupported divisor ${question.b}.`);
            }
          }
          if(index>0)assert.notEqual(engine.equationKey(question),engine.equationKey(round[index-1]),`Mission ${mission.id}, seed ${seed}: adjacent duplicate.`);
        }

        if(mission.mode==='choice'){
          for(const question of round){
            const options=engine.buildChoiceOptions(question);
            assert.equal(options.length,4,`Mission ${mission.id}: choice question must have four options.`);
            assert.equal(new Set(options).size,4,`Mission ${mission.id}: choice options must be unique.`);
            assert(options.includes(question.answer),`Mission ${mission.id}: choice options omit the correct answer.`);
          }
        }
        checkedRounds++;
      }
    }
  }
  return checkedRounds;
}

function validateChapterTwoPools(){
  const engine=questionEngineApi.create({config,getFactStats:()=>({}),random:seededRandom(1)});
  const pool17=engine.buildQuestionPool(17);
  assert(pool17.every(question=>question.operation==='multiply'&&question.statsTable===3&&question.factor<=5));
  const pool18=engine.buildQuestionPool(18);
  assert(pool18.every(question=>question.operation==='multiply'&&question.statsTable===3&&question.factor>=6));
  const pool24=engine.buildQuestionPool(24);
  assert.equal(pool24.length,15);
  assert(pool24.filter(question=>question.statsTable===3).length>=8,'Mission 24 must keep table 3 in the majority.');
  const pool25=engine.buildQuestionPool(25);
  assert.equal(pool25.filter(question=>question.statsTable===3).length,8,'Mission 25 must emphasize table 3.');
  const pool31=engine.buildQuestionPool(31);
  assert.equal(pool31.filter(question=>question.operation==='multiply').length,8);
  assert.equal(pool31.filter(question=>question.operation==='divide').length,7);
  assert(pool31.every(question=>question.statsTable===3),'Mission 31 must contain only the ×3/÷3 family.');
  const pool33=engine.buildQuestionPool(33);
  assert.equal(pool33.length,15);
  assert.equal(pool33.filter(question=>question.operation==='multiply').length,8);
  assert.equal(pool33.filter(question=>question.operation==='divide').length,7);
}

function validateChapterThreePools(){
  const engine=questionEngineApi.create({config,getFactStats:()=>({}),random:seededRandom(1)});
  const pool35=engine.buildQuestionPool(35);
  assert(pool35.every(question=>question.operation==='multiply'&&question.statsTable===4&&question.factor<=5));
  const pool36=engine.buildQuestionPool(36);
  assert(pool36.every(question=>question.operation==='multiply'&&question.statsTable===4&&question.factor>=6));
  const pool42=engine.buildQuestionPool(42);
  assert.equal(pool42.length,15);
  assert(pool42.filter(question=>question.statsTable===4).length>=9,'Mission 42 must keep table 4 in the majority.');
  const pool43=engine.buildQuestionPool(43);
  assert.equal(pool43.filter(question=>question.statsTable===4).length,9,'Mission 43 must emphasize table 4.');
  const pool49=engine.buildQuestionPool(49);
  assert.equal(pool49.filter(question=>question.operation==='multiply').length,8);
  assert.equal(pool49.filter(question=>question.operation==='divide').length,7);
  assert(pool49.every(question=>question.statsTable===4),'Mission 49 must contain only the ×4/÷4 family.');
  const pool51=engine.buildQuestionPool(51);
  assert.equal(pool51.length,15);
  assert(pool51.filter(question=>question.statsTable===4).length,8,'Mission 51 must keep the new family in the majority.');
}

function validateAdaptiveRepetition(){
  const factStats={
    'multiply:3':{correct:0,mistakes:100},
    'divide:4':{correct:0,mistakes:100},
    'multiply:3:8':{correct:0,mistakes:120},
    'divide:3:7':{correct:0,mistakes:110}
  };
  const engine=questionEngineApi.create({config,getFactStats:()=>factStats,random:seededRandom(1)});
  for(const missionId of [7,8]){
    const count=engine.buildQuestionPool(missionId).filter(question=>question.operation==='multiply'&&question.factor===3).length;
    assert(count>=2,`Mission ${missionId} did not repeat the weak multiplication factor.`);
  }
  const divisionCount=engine.buildQuestionPool(14).filter(question=>question.operation==='divide'&&question.factor===4).length;
  assert(divisionCount>=2,'Mission 14 did not repeat the weak division factor.');
  const threeCount=engine.buildQuestionPool(23).filter(question=>question.operation==='multiply'&&question.statsTable===3&&question.factor===8).length;
  assert(threeCount>=2,'Mission 23 did not repeat the weak ×3 fact.');
  const divideThreeCount=engine.buildQuestionPool(29).filter(question=>question.operation==='divide'&&question.statsTable===3&&question.factor===7).length;
  assert(divideThreeCount>=2,'Mission 29 did not repeat the weak ÷3 fact.');
  const mixedCount=engine.buildQuestionPool(32).filter(question=>question.statsTable===3&&question.factor===8).length;
  assert(mixedCount>=2,'Mission 32 did not return a weak fact from the cumulative history.');
}

validateConfiguration();
assert.equal(legacyFirstChapterSignature(),EXPECTED_FIRST_CHAPTER_SIGNATURE,'The approved first 15 missions changed.');
const signature=signatureForMissions(config.missions);
if(process.argv.includes('--print-signature')){
  console.log(signature);
  process.exit(0);
}
assert.equal(signature,EXPECTED_CONTENT_SIGNATURE,'Mission content changed. Review the change and update the approved signature intentionally.');
const checkedRounds=validateGeneratedRounds();
validateChapterTwoPools();
validateChapterThreePools();
validateAdaptiveRepetition();
console.log(`Mission checks passed: ${config.missions.length} missions, ${checkedRounds} generated rounds.`);
