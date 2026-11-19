from pathlib import Path
from playwright.sync_api import sync_playwright
pdir=Path(__file__).parent
s=(pdir/'index.html').read_text('utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium', args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=1)
 page.clock.install()
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(s,wait_until='load')
 page.clock.run_for(750)
 page.screenshot(path=str(pdir/'v47_running_390.png'))
 print('runner at 750ms', page.evaluate('__EDUKASS_TEST__.runner()'),flush=True)
 # Trigger a crash with incorrect response. Need unequivocal wrong number
 first=page.evaluate('__EDUKASS_TEST__.tasks()[0]')
 wrong=first['answer']+first['u']
 page.evaluate('''v=>{for(const d of String(v))__EDUKASS_TEST__.enterKey(d);__EDUKASS_TEST__.enterKey('enter')}''',wrong)
 assert page.evaluate('__EDUKASS_TEST__.runner().phase')=='crash','wrong answer not crash'
 page.clock.run_for(240)
 page.screenshot(path=str(pdir/'v47_crash_390.png'))
 page.clock.fast_forward(1200)
 assert page.evaluate('__EDUKASS_TEST__.runner().phase')=='run','crash did not restart'
 assert page.evaluate('__EDUKASS_TEST__.state().step')==0,'crash did not reset current level'
 assert page.evaluate('__EDUKASS_TEST__.runner().attempt')==2,'attempt not counted'
 # Correct answer must visibly jump above an obstacle
 first=page.evaluate('__EDUKASS_TEST__.tasks()[0]')
 page.evaluate('''v=>{for(const d of String(v))__EDUKASS_TEST__.enterKey(d);__EDUKASS_TEST__.enterKey('enter')}''',first['answer'])
 assert page.evaluate('__EDUKASS_TEST__.runner().phase')=='jump','correct answer not jumping'
 page.clock.run_for(380)
 page.screenshot(path=str(pdir/'v47_jump_390.png'))
 page.clock.fast_forward(730)
 assert page.evaluate('__EDUKASS_TEST__.state().step')==1,'successful jump not progressing'
 # test time-out at 1st level step: force deadline by clock (time budget 19s)
 page.clock.fast_forward(21000)
 assert page.evaluate('__EDUKASS_TEST__.runner().phase')=='crash','timeout did not trigger crash'
 page.clock.fast_forward(1300)
 assert page.evaluate('__EDUKASS_TEST__.state().step')==0,'timeout not reset level'
 print('CRASH, JUMP, TIMEOUT pass',flush=True)
 total=0
 for i in range(9):
  assert page.evaluate('__EDUKASS_TEST__.state().world')==i
  tasks=page.evaluate('__EDUKASS_TEST__.tasks()')
  assert len(tasks)==(8 if i==0 else 12)
  for j,t in enumerate(tasks):
   assert t['answer']==(t['n']+t['u']//2)//t['u']*t['u']
   page.evaluate('''v=>{for(const d of String(v))__EDUKASS_TEST__.enterKey(d);__EDUKASS_TEST__.enterKey('enter')}''',t['answer'])
   assert page.evaluate('__EDUKASS_TEST__.runner().phase')=='jump', (i,j)
   page.clock.fast_forward(1080)
   total+=1
  assert page.locator('#overlay').get_attribute('aria-hidden')=='false',i
  assert page.evaluate('__EDUKASS_TEST__.state().completed')>=i+1,i
  if i<8:
   page.locator('#next').click()
   page.clock.fast_forward(80)
  else:
   page.locator('#next').click()
   page.screenshot(path=str(pdir/'v47_final_390.png'))
 print('full run',total,'9 worlds 9 rewards',flush=True)
 # landscape fresh origin with menu and overlay
 page.set_viewport_size({'width':844,'height':390})
 page.clock.fast_forward(90)
 page.screenshot(path=str(pdir/'v47_final_844.png'))
 assert page.evaluate('document.body.scrollWidth <= innerWidth+2')
 print('console errors',errors,flush=True)
 assert not errors
 browser.close()