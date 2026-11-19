from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parents[1]
html=(root/'EDUKASS_Valgussaar_World1_Play.html').read_text()

def test(browser,w,h,label):
 p=browser.new_page(viewport={'width':w,'height':h}, device_scale_factor=1, has_touch=True,is_mobile=w<600)
 problems=[];p.on('pageerror',lambda err: problems.append(str(err)))
 p.set_content(html,wait_until='domcontentloaded',timeout=30000)
 p.locator('#begin').click()
 p.wait_for_timeout(260)
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status']=='running',s
 assert len(s['tasks'])==8
 assert s['step']==0
 x=s['playerX']
 p.wait_for_timeout(300)
 assert p.evaluate('window.__EDUKASS_TEST__.get().playerX')>x, 'Avatar does not run autonomously'
 p.screenshot(path=str(root/f'{label}_runner.png'))
 # Correct prefix should not crash; complete wrong must crash immediately
 answer=str(s['tasks'][0]['answer'])
 p.locator(f'[data-key="{answer[0]}"]').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='running'
 p.locator('[data-key="back"]').click()
 wrong='79' if answer!='79' else '89'
 for k in wrong:p.locator(f'[data-key="{k}"]').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='crashing', 'Incorrect full answer did not collide'
 p.evaluate('window.__EDUKASS_TEST__.tick(850)')
 p.wait_for_timeout(120)
 assert p.locator('#crashHero').is_visible(), 'Crash overlay absent'
 assert p.evaluate('window.__EDUKASS_TEST__.get().status')=='crashed'
 p.screenshot(path=str(root/f'{label}_crashed.png'))
 p.locator('#retry').click()
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status']=='running' and s['step']==0 and s['attempts']==2
 # Timeout if nothing entered - retry again
 p.evaluate('window.__EDUKASS_TEST__.tick(8000)')
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status'] in ('crashing','crashed') and s['crashReason']=='timeout',s
 p.evaluate('window.__EDUKASS_TEST__.tick(800)')
 assert p.locator('#crashHero').is_visible()
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
  p.evaluate('window.__EDUKASS_TEST__.tick(7000)')
  s=p.evaluate('window.__EDUKASS_TEST__.get()')
  if step==7:
   # final task has slower approach; may need extra time
   if s['status']=='running':p.evaluate('window.__EDUKASS_TEST__.tick(2200)')
  else:
   assert s['step']==step+1,(step,s)
 p.wait_for_timeout(820)
 s=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert s['status']=='finished' and s['step']==8,s
 assert p.locator('#finishHero').is_visible()
 p.screenshot(path=str(root/f'{label}_finished.png'))
 assert not problems,problems
 # mobile keyboard in viewport (except landscape where layout dedicated)
 if w<600:
  g=p.evaluate('''() => ({bottom:document.querySelector('.keypad').getBoundingClientRect().bottom,doc:document.documentElement.scrollHeight})''')
  assert g['bottom']<=h+15, g
 print(json.dumps({'viewport':[w,h],'runner':'PASS','wrong_crash':'PASS','timeout_crash':'PASS','restart':'PASS','8_obstacles':'PASS','finish':'PASS','errors':problems},ensure_ascii=False))
 p.close()

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
 for w,h,label in [(390,844,'phone'),(360,740,'compact'),(844,390,'landscape')]:test(browser,w,h,label)
 browser.close()