from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
html=(root/'EDUKASS_Paikesekuru_World2_Play.html').read_text(encoding='utf8')

def check(browser,w,h,label):
 p=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
 errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
 p.set_content(html,wait_until='domcontentloaded')
 assert p.locator('[data-key="check"]').count()==0
 assert p.locator('.keypad .key').count()==11
 p.locator('#begin').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().tasks.length')==12
 assert p.evaluate('window.__EDUKASS_TEST__.get().world')=='paikesekuru'
 for step in range(12):
  state=p.evaluate('window.__EDUKASS_TEST__.get()')
  assert state['step']==step and state['status']=='running',state
  for digit in str(state['tasks'][step]['answer']):
   p.evaluate('(key)=>window.__EDUKASS_TEST__.press(key)',digit)
  assert p.evaluate('window.__EDUKASS_TEST__.get().solved')
  result=p.evaluate("""() => {
   const api=window.__EDUKASS_TEST__,before=api.get().step;
   let jump=false,s;
   for(let i=0;i<900;i++){api.tick(35);s=api.get();if(s.jumpHeight>0)jump=true;if(s.step>before||s.status!=='running')break}
   return {s,jump}
  }""")
  assert result['jump'] and result['s']['step']==step+1,result
 final=p.evaluate('window.__EDUKASS_TEST__.get()')
 assert final['status']=='finished' and final['step']==12 and final['crystalCollected'],final
 assert p.evaluate("JSON.parse(localStorage.getItem('edukass-neon-crystal-vault-v1'))")==[2]
 p.wait_for_timeout(1900)
 assert p.locator('#finishHero').is_visible()
 p.screenshot(path=str(root/(label+'_world2_win.png')))
 p.locator('#openVaultReward').click()
 assert p.locator('#vaultGrid .vault-card.unlocked').count()==1
 p.screenshot(path=str(root/(label+'_world2_vault.png')))
 p.locator('#closeVault').click()
 p.locator('#again').click()
 assert p.evaluate('window.__EDUKASS_TEST__.get().crystalCollected')
 p.evaluate('window.__EDUKASS_TEST__.tick(15000)')
 assert p.evaluate("window.__EDUKASS_TEST__.get().crashReason")=='timeout'
 if w<600:
  metrics=p.evaluate("""() => ({bottom:document.querySelector('.key-zero').getBoundingClientRect().bottom,h:innerHeight})""")
  assert metrics['bottom']<=metrics['h']+2,metrics
 assert not errors,errors
 print(label,'PASS')
 p.close()

with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True)
 for w,h,label in [(390,844,'portrait'),(360,600,'compact'),(844,390,'landscape')]:check(b,w,h,label)
 b.close()
