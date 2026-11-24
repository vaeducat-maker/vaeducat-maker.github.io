from pathlib import Path
from playwright.sync_api import sync_playwright

# The feedback panel must show the actual arithmetic, not only a collision warning.
def assert_learning_panel(page, reason):
 state=page.evaluate('window.__EDUKASS_TEST__.get()')
 task=state['tasks'][state['step']]
 expected=task['answer']
 assert page.locator('#learningCorrect').inner_text().replace(' ','')==str(expected)
 assert str(task['v']) in page.locator('#learningNumber').inner_text().replace(' ','')
 rule=page.locator('#learningRule').inner_text()
 digit=task['v']%10 if task['unit']==10 else (task['v']//10)%10
 assert str(digit) in rule
 assert str(expected) in rule.replace(' ','')
 assert page.locator('#learningYourAnswer').inner_text()
 if reason=='timeout':
  assert 'EI VASTANUD' in page.locator('#learningYourAnswer').inner_text() or 'POOLELI JÄI' in page.locator('#learningYourAnswer').inner_text()


import json
root=Path(__file__).resolve().parents[1]
html=(root/'EDUKASS_Valgussaar_World1_Play.html').read_text()

def test(browser,w,h,label):
 p=browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1, has_touch=True,is_mobile=w<600)
 problems=[];p.on('pageerror',lambda err: problems.append(str(err)))
 p.set_content(html,wait_until='domcontentloaded',timeout=30000)
 assert p.locator('.scene-sub').count()==0, 'Remove 8 TAKISTUST in game canvas'
 assert p.locator('[data-key="check"]').count()==0, 'Only auto-check input'
 assert p.locator('#viewWorld').count()==0, 'No unnecessary revisit-world action'
 assert p.locator('.keypad .key').count()==11, 'Ten digits plus backspace'
 assert p.locator('.key-zero').get_attribute('data-key')=='0'
 if w<600:
  g=p.evaluate("""() => ({
   bottom:document.querySelector('.key-zero').getBoundingClientRect().bottom,
   keyboard:document.querySelector('.keypad').getBoundingClientRect().bottom,
   height:window.innerHeight,
   scrollHeight:document.documentElement.scrollHeight
  })""")
  assert g['bottom']<=g['height']+1 and g['keyboard']<=g['height']+1,g
  assert g['scrollHeight']<=g['height']+4,g
 # The vault must be available before any reward is earned.
 p.locator('#openVaultIntro').click()
 assert p.locator('#vaultHero').is_visible()
 assert p.locator('#vaultGrid .vault-card').count()==9
 assert p.locator('#vaultGrid .vault-card.unlocked').count()==0
 assert p.locator('#vaultGrid .vault-card.locked').count()==9
 p.locator('#closeVault').click()
 assert p.locator('#introHero').is_visible()
 assert p.locator('#nextWorld').is_enabled(), 'World 1 should lead to playable world 2'
 assert p.locator('#awardCrystalArt svg').count()==1
 assert p.locator('#awardCrystalArt svg path').first.get_attribute('d').startswith('M41 2'), 'Valgussaar reward must have long faceted form'
 assert p.locator('#vaultGrid svg').count()==9, 'Each world must have a jewel'
 p.locator('#begin').click()
 p.wait_for_timeout(260)
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status']=='running',s
 assert len(s['tasks'])==8
 assert s['step']==0
 assert s['runningSpeed']==64.5, 'Normal pace must be exactly 25% slower'
 assert len(set(s['obstacles']))==5, 'Five distinct obstacle silhouettes expected'
 assert len(set(t['v'] for t in s['tasks']))==8, 'No repeated number in one round'
 assert s['tasks'][5]['v']>=100 and s['tasks'][5]['unit']==10
 assert s['tasks'][7]['v']>=100 and s['tasks'][7]['unit']==100
 x=s['playerX']
 p.wait_for_timeout(300)
 assert p.evaluate('window.__EDUKASS_TEST__.get().playerX')>x, 'Avatar does not run autonomously'
 p.screenshot(path=str(root/f'{label}_runner.png'))
 # Correct prefix should not crash; complete wrong must crash immediately
 answer=str(s['tasks'][0]['answer'])
 p.locator(f'[data-key="{answer[0]}"]').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='running'
 p.locator('[data-key="back"]').click()
 wrong=('8' if answer[0]!='8' else '7') + '0'*(len(answer)-1)
 for k in wrong:p.locator(f'[data-key="{k}"]').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().wrongLocked') is True, 'Wrong answer must prevent another attempt'
 assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='running', 'Crystal must physically approach obstacle'
 p.evaluate('window.__EDUKASS_TEST__.tick(8000)')
 assert p.evaluate('window.__EDUKASS_TEST__.get().status') in ('crashing','crashed'), 'Wrong answer did not cause an actual obstacle collision'
 p.evaluate('window.__EDUKASS_TEST__.tick(850)')
 p.wait_for_timeout(120)
 assert p.locator('#crashHero').is_visible(), 'Crash overlay absent'
 assert_learning_panel(p,'wrong')
 assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='crashed'
 p.screenshot(path=str(root/f'{label}_crashed.png'))
 previous_numbers=[v['v'] for v in s['tasks']]
 p.locator('#retry').click()
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status']=='running' and s['step']==0 and s['attempts']==2
 assert [v['v'] for v in s['tasks']]!=previous_numbers, 'Retry must regenerate exercises'
 # Timeout if nothing entered - retry again
 p.evaluate('window.__EDUKASS_TEST__.tick(9000)')
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status'] in ('crashing','crashed') and s['crashReason']=='timeout',s
 p.evaluate('window.__EDUKASS_TEST__.tick(800)')
 assert p.locator('#crashHero').is_visible()
 assert_learning_panel(p,'timeout')
 p.locator('#retry').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().attempts')==3
 # Full success by answering while hero runs, then crossing barrier.
 for step in range(8):
  s=p.evaluate('window.__EDUKASS_TEST__.get()')
  assert s['status']=='running' and s['step']==step,(step,s)
  answer=str(s['tasks'][step]['answer'])
  for c in answer[:-1]:
   p.locator(f'[data-key="{c}"]').click()
   assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='running'
  p.locator(f'[data-key="{answer[-1]}"]').click()
  assert p.evaluate('window.__EDUKASS_TEST__.get().solved') is True,'correct answer did not open jump'
  current=p.evaluate('window.__EDUKASS_TEST__.get()')
  # An early correct answer must immediately switch to a fast real-world sprint.
  assert current['turboActive'] and current['runningSpeed']==255,(step,current)
  result=p.evaluate("""() => {
    const api=window.__EDUKASS_TEST__, start=api.get().step;
    let inAir=false, samples=0, maxHeight=0, state;
    do {
      api.tick(35); state=api.get();
      if(state.jumpHeight>30)inAir=true;
      maxHeight=Math.max(maxHeight,state.jumpHeight);
      samples++;
    } while(state.step===start && state.status==='running' && samples<500);
    return {inAir,maxHeight,samples,state};
  }""")
  assert result['inAir'] and result['maxHeight']>100,(step,result)
  s=result['state']
  assert s['jumpCount']==step+1,(step,s)
  if step<7:assert s['step']==step+1,(step,s)
 # Two-stage celebration: victory announcement first, then crystal reveal.
 p.wait_for_timeout(350)
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status']=='finished' and s['step']==8,s
 assert s['victoryStage']=='victory' and p.locator('#victoryHero').is_visible(),s
 assert not p.locator('#finishHero').is_visible()
 p.screenshot(path=str(root/f'{label}_victory.png'))
 p.wait_for_timeout(1550)
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['victoryStage']=='finish',s
 assert p.locator('#finishHero').is_visible()
 assert p.locator('.prize-crystal svg').is_visible()
 assert p.locator('#celebrateParticles .confetti').count()>=50
 assert p.locator('#openVaultReward').is_visible()
 assert p.locator('#rewardCollectionCount').inner_text()=='1 / 9'
 assert p.locator('#nextWorld').is_disabled(), 'Do not navigate to a nonexistent second world'
 assert s['crystalCollected'] and s['rewardUnlocked'],s
 assert p.evaluate("localStorage.getItem('edukass-neon-world1-crystal-unlocked')")=='1'
 # Reward content must stay inside each viewport without horizontal overflow.
 viewport=p.evaluate("""() => ({
   width:innerWidth,
   panelRight:document.querySelector('#finishHero').getBoundingClientRect().right,
   bodyWidth:document.documentElement.scrollWidth,
   prizeWidth:document.querySelector('.prize-theatre').getBoundingClientRect().width
 })""")
 assert viewport['bodyWidth']<=viewport['width']+3,viewport
 assert viewport['panelRight']<=viewport['width']+4,viewport
 assert viewport['prizeWidth']>90,viewport
 p.screenshot(path=str(root/f'{label}_finished.png'))
 p.locator('#openVaultReward').click()
 assert p.locator('#vaultHero').is_visible()
 assert p.locator('#vaultGrid .vault-card').count()==9
 assert p.locator('#vaultGrid .vault-card.unlocked').count()==1
 assert p.locator('#vaultGrid .vault-card.locked').count()==8
 assert p.locator('#vaultProgress').inner_text()=='KOGUTUD 1 / 9'
 assert p.evaluate('window.__EDUKASS_TEST__.get().vaultCount')==1
 p.screenshot(path=str(root/f'{label}_vault.png'))
 p.locator('#closeVault').click()
 assert p.locator('#finishHero').is_visible()
 assert not problems,problems
 # Replaying must NOT erase an earned crystal.
 p.locator('#again').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().crystalCollected') is True
 assert p.evaluate("localStorage.getItem('edukass-neon-world1-crystal-unlocked')")=='1'
 assert p.evaluate("JSON.parse(localStorage.getItem('edukass-neon-crystal-vault-v1'))")==[1]
 # Late correct answers must keep normal motion so turbo cannot cause an unfair crash.
 p.evaluate('window.__EDUKASS_TEST__.tick(6800)')
 late=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert late['status']=='running' and late['step']==0,late
 for c in str(late['tasks'][0]['answer']):
  p.evaluate('(k) => window.__EDUKASS_TEST__.press(k)',c)
 safe=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert safe['solved'] and not safe['turboActive'] and safe['runningSpeed']==64.5,safe
 p.evaluate('window.__EDUKASS_TEST__.tick(3500)')
 assert p.evaluate('window.__EDUKASS_TEST__.get().step')==1,'Late correct answer was unfairly punished'
 # mobile keyboard in viewport (except landscape where layout dedicated)
 if w<600:
  g=p.evaluate('''() => ({bottom:document.querySelector('.key-zero').getBoundingClientRect().bottom,viewport:window.innerHeight,scrollHeight:document.documentElement.scrollHeight})''')
  assert g['bottom']<=g['viewport']+1 and g['scrollHeight']<=g['viewport']+4, g
 print(json.dumps({'viewport':[w,h],'runner':'PASS','wrong_crash':'PASS','timeout_crash':'PASS','restart':'PASS','8_obstacles':'PASS','real_jump':'PASS','turbo':'PASS','late_answer_safe':'PASS','five_hazards':'PASS','fresh_tasks':'PASS','25pct_slower':'PASS','physical_collision':'PASS','victory_animation':'PASS','crystal_award':'PASS','award_persistence':'PASS','mobile_full_keypad':'PASS','auto_check':'PASS','nine_crystal_vault':'PASS','finish':'PASS','errors':problems},ensure_ascii=False))
 p.close()


# Exercise generation must keep first-world difficulty and avoid recent exact repeats.
def check_randomization(browser):
 p=browser.new_page(viewport={'width':390,'height':844})
 p.set_content(html,wait_until='domcontentloaded')
 signatures=set()
 for i in range(40):
  p.evaluate('window.__EDUKASS_TEST__.start()')
  s=p.evaluate('window.__EDUKASS_TEST__.get()')
  combo=tuple((t['v'],t['unit']) for t in s['tasks'])
  assert combo not in signatures,(i,combo)
  signatures.add(combo)
  assert len(set(t['v'] for t in s['tasks']))==8
  assert len(set(s['obstacles']))==5
  assert all(10<=t['v']<=99 and t['unit']==10 for t in s['tasks'][:5])
  assert s['tasks'][5]['v']>=100 and s['tasks'][5]['unit']==10
  assert 10<=s['tasks'][6]['v']<=99 and s['tasks'][6]['unit']==10
  assert s['tasks'][7]['v']>=100 and s['tasks'][7]['unit']==100
 p.close()
 print(json.dumps({'unique_rounds':40,'obstacle_shapes':5,'math_curriculum':'PASS'}))

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 check_randomization(browser)
 for w,h,label in [(390,844,'phone'),(360,740,'compact'),(360,600,'android-browser'),(360,540,'short-android'),(844,390,'landscape')]:test(browser,w,h,label)
 browser.close()
