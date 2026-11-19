from playwright.sync_api import sync_playwright
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
html=(root/'EDUKASS_Valgussaar_World1_Runner.html').read_text()

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 for w,h,label in [(390,844,'runner_phone'),(360,740,'runner_compact'),(844,390,'runner_landscape')]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1,is_mobile=w<600,has_touch=w<600,reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='domcontentloaded')
  page.wait_for_timeout(250)
  page.screenshot(path=str(root/(label+'_intro.png')))
  page.locator('#begin').click();page.wait_for_timeout(140)
  state=page.evaluate('window.__EDUKASS_TEST__.get()')
  assert state['status']=='active',state
  assert len(state['tasks'])==8
  page.evaluate('window.__EDUKASS_TEST__.seek(.68)');page.wait_for_timeout(80)
  page.screenshot(path=str(root/(label+'_game.png')))
  # Collision without answer -> game over, no extra progress
  page.evaluate('window.__EDUKASS_TEST__.near()')
  page.wait_for_function('window.__EDUKASS_TEST__.get().status === "crashed"',timeout=1000)
  page.wait_for_timeout(590)
  assert page.locator('#crashHero').is_visible(), 'missing game over'
  page.screenshot(path=str(root/(label+'_crash.png')))
  # Restart the same level and tasks
  start_tasks=state['tasks']
  page.locator('#retry').click()
  state=page.evaluate('window.__EDUKASS_TEST__.get()')
  assert state['step']==0 and state['status']=='active' and state['tasks']==start_tasks
  # A genuinely wrong submitted result immediately loses the level
  ans=str(start_tasks[0]['answer']);wrong='79' if ans!='79' else '89'
  for digit in wrong:page.locator('[data-key="'+digit+'"]').click()
  page.wait_for_function('window.__EDUKASS_TEST__.get().status === "crashed"',timeout=1000)
  page.wait_for_timeout(580)
  page.locator('#retry').click()
  # All eight rounds, trigger real progress with a correct answer, jump and clear.
  for i,task in enumerate(start_tasks):
   a=str(task['answer'])
   for d in a[:-1]:page.locator('[data-key="'+d+'"]').click()
   s=page.evaluate('window.__EDUKASS_TEST__.get()')
   assert s['status']=='active',f'correct prefix crash on {i}: {s}'
   page.locator('[data-key="'+a[-1]+'"]').click()
   assert page.evaluate('window.__EDUKASS_TEST__.get().answerReady'),f'not ready {i}'
   # Once solved, time cannot cause failure; crystal actually jumps over the obstacle.
   page.evaluate('window.__EDUKASS_TEST__.seek(.83)')
   page.wait_for_timeout(50)
   if i==0:page.screenshot(path=str(root/(label+'_jump.png')))
   page.evaluate('window.__EDUKASS_TEST__.pass()')
   page.wait_for_function('n => window.__EDUKASS_TEST__.get().step===n',arg=i+1,timeout=1000)
  assert page.evaluate('window.__EDUKASS_TEST__.get().status')=='finished'
  page.wait_for_timeout(1050)
  assert page.locator('#finishHero').is_visible()
  page.screenshot(path=str(root/(label+'_finish.png')))
  geom=page.evaluate('''() => ({buttons:[...document.querySelectorAll('.key')].map(b=>b.getBoundingClientRect().toJSON()),v:{w:innerWidth,h:innerHeight},scrollH:document.documentElement.scrollHeight,scrollW:document.documentElement.scrollWidth})''')
  if w<600:
   assert geom['buttons'][-1]['bottom']<=h+3,(label,geom['buttons'][-1])
  assert geom['scrollW']<=w+3,(label,geom['scrollW'])
  assert not errors,errors
  print(json.dumps({'label':label,'viewport':[w,h],'status':'PASS','stage_count':8,'wrong_answer':'crash','timeout':'crash','restart':'same_tasks','finish':'reward','errors':errors},ensure_ascii=False))
  page.close()
 browser.close()