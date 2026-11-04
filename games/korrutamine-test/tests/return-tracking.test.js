const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const path=require('node:path');
const {LAST_START_DAY_KEY,localDay,recordStart}=require('../return-tracking.js');

function storage(initial={}){
  const data=new Map(Object.entries(initial));
  return {
    getItem:key=>data.has(key)?data.get(key):null,
    setItem:(key,value)=>data.set(key,String(value))
  };
}

test('first start and same-day repeats are not returns; later dates count once per day',()=>{
  const store=storage();
  const events=[];
  const run=now=>recordStart({storage:store,now:new Date(now),track:event=>events.push(event)});
  assert.equal(run('2026-11-04T09:00:00'),false);
  assert.equal(run('2026-11-04T23:00:00'),false);
  assert.deepEqual(events,[]);
  assert.equal(run('2026-11-05T08:00:00'),true);
  assert.equal(run('2026-11-05T18:00:00'),false);
  assert.deepEqual(events,['Korrutustabel Return']);
  assert.equal(run('2026-11-06T08:00:00'),true);
  assert.deepEqual(events,['Korrutustabel Return','Korrutustabel Return']);
  assert.equal(store.getItem(LAST_START_DAY_KEY),'2026-11-06');
});

test('existing players with no tracked date get a baseline, not a false return',()=>{
  const store=storage({'edukass-opening-seen-v28':'true'});
  const events=[];
  assert.equal(recordStart({storage:store,now:new Date('2026-11-04T10:00:00'),track:e=>events.push(e)}),false);
  assert.deepEqual(events,[]);
});

test('future and malformed dates do not create spurious return events',()=>{
  const events=[];
  const track=e=>events.push(e);
  assert.equal(recordStart({storage:storage({[LAST_START_DAY_KEY]:'not-a-date'}),now:new Date('2026-11-04T10:00:00'),track}),false);
  assert.equal(recordStart({storage:storage({[LAST_START_DAY_KEY]:'2026-11-07'}),now:new Date('2026-11-04T10:00:00'),track}),false);
  assert.deepEqual(events,[]);
});

test('blocked storage cannot prevent starting the game',()=>{
  const blocked={getItem(){throw new Error('Blocked')},setItem(){throw new Error('Blocked')}};
  assert.doesNotThrow(()=>recordStart({storage:blocked,now:new Date('2026-11-04T10:00:00'),track(){throw new Error('Should not fire')}}));
});

test('date uses the local calendar, not UTC date extraction',()=>{
  assert.equal(localDay(new Date(2026,10,4,23,59,59)),'2026-11-04');
});

test('browser integration loads tracker before the game and skips QA simulations',()=>{
  const root=path.resolve(__dirname,'..');
  const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.match(html,/<script src="return-tracking\.js\?v=1"><\/script>\s*<script src="game\.js\?v=127"><\/script>/);
  assert.match(game,/trackPlausible\('Korrutustabel Start'\);\s*\/\/ Count returns only on a new local day/);
  assert.match(game,/if\(!TEST_UNLOCK_ALL&&window\.EDUKASS_RETURN_TRACKER\)/);
  assert.match(game,/recordStart\(\{storage:localStorage,track:trackPlausible\}\)/);
});
