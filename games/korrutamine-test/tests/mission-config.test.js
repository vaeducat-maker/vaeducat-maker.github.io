const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const path=require('node:path');

const gameRoot=path.resolve(__dirname,'..');
const config=require(path.join(gameRoot,'chapter-one.config.js'));
const questionEngineApi=require(path.join(gameRoot,'question-engine.js'));

const EXPECTED_CONTENT_SIGNATURE='83fa3e428f49ac63046fb4529460ac1ae51a1a4c3ca595bcd9a36b5b7a720643';
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
  return [question.operation,question.a,question.b,question.answer,question.factor,question.table];
}

function contentSignature(){
  const factScenarios=[
    {},
    {
      'multiply:3':{correct:0,mistakes:8},
      'multiply:9':{correct:5,mistakes:4},
      'divide:4':{correct:0,mistakes:10}
    }
  ];
  const metadata=config.missions.map(mission=>[
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
    return config.missions.map(mission=>engine.buildQuestionPool(mission.id).map(canonicalQuestion));
  });
  return crypto.createHash('sha256').update(JSON.stringify({metadata,pools})).digest('hex');
}

function validateConfiguration(){
  assert.equal(config.schemaVersion,1,'Unexpected chapter configuration schema version.');
  assert.equal(config.roundLength,15,'A mission must require exactly 15 correct answers.');
  assert.equal(config.practiceTable,2,'The first chapter must practise table 2.');
  assert.deepEqual(config.practiceFactors,[1,2,3,4,5,6,7,8,9,10]);
  assert.equal(config.missions.length,15,'The first chapter must contain 15 missions.');
  assert.deepEqual(config.missions.map(mission=>mission.id),[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

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
    }
  }

  assert.deepEqual(config.missions.slice(0,10).map(mission=>mission.operation),Array(10).fill('multiply'));
  assert.deepEqual(config.missions.slice(10,14).map(mission=>mission.operation),Array(4).fill('divide'));
  assert.equal(config.missions[14].operation,'mixed');
  assert.equal(config.missions[0].mode,'choice');
  assert.equal(config.missions[10].mode,'choice');
  assert(config.missions[6].questionGroups.some(group=>group.type==='adaptive'));
  assert(config.missions[7].questionGroups.some(group=>group.type==='adaptive'));
  assert(config.missions[13].questionGroups.some(group=>group.type==='adaptive'));
}

function validateGeneratedRounds(){
  const factScenarios=[
    {},
    {
      'multiply:3':{correct:0,mistakes:20},
      'multiply:9':{correct:0,mistakes:10},
      'divide:4':{correct:0,mistakes:20}
    },
    Object.fromEntries(Array.from({length:10},(_,index)=>{
      const factor=index+1;
      return [`multiply:${factor}`,{correct:factor,mistakes:10-factor}];
    }))
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
          assert(Number.isInteger(question.answer)&&question.answer>=0,`Mission ${mission.id}: invalid answer.`);
          if(question.operation==='multiply')assert.equal(question.a*question.b,question.answer,`Mission ${mission.id}: invalid multiplication.`);
          else{
            assert.equal(question.a/question.b,question.answer,`Mission ${mission.id}: invalid division.`);
            assert.equal(question.a%question.b,0,`Mission ${mission.id}: division has a remainder.`);
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

function validateAdaptiveRepetition(){
  const factStats={
    'multiply:3':{correct:0,mistakes:100},
    'divide:4':{correct:0,mistakes:100}
  };
  const engine=questionEngineApi.create({config,getFactStats:()=>factStats,random:seededRandom(1)});
  for(const missionId of [7,8]){
    const count=engine.buildQuestionPool(missionId).filter(question=>question.operation==='multiply'&&question.factor===3).length;
    assert(count>=2,`Mission ${missionId} did not repeat the weak multiplication factor.`);
  }
  const divisionCount=engine.buildQuestionPool(14).filter(question=>question.operation==='divide'&&question.factor===4).length;
  assert(divisionCount>=2,'Mission 14 did not repeat the weak division factor.');
}

validateConfiguration();
const signature=contentSignature();
if(process.argv.includes('--print-signature')){
  console.log(signature);
  process.exit(0);
}
assert.equal(signature,EXPECTED_CONTENT_SIGNATURE,'Mission content changed. Review the change and update the approved signature intentionally.');
const checkedRounds=validateGeneratedRounds();
validateAdaptiveRepetition();
console.log(`Mission checks passed: ${config.missions.length} missions, ${checkedRounds} generated rounds.`);
