from playwright.sync_api import sync_playwright
from pathlib import Path
import json
raw=(Path(__file__).resolve().parents[1]/'dist/index.html').read_text(encoding='utf-8')
shim='''(() => { const data=new Map();const o={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,''+v),removeItem:k=>data.delete(k),clear:()=>data.clear(),key:i=>Array.from(data.keys())[i]||null,get length(){return data.size}};Object.defineProperty(window,'localStorage',{value:o,configurable:true});Object.defineProperty(window,'sessionStorage',{value:o,configurable:true});const orig=window.setTimeout;window.setTimeout=function(f,ms,...args){return orig(f,ms>=800 && ms<=1500?10:ms,...args)}})();'''
routes=['majakas','forest','bridge','mountain','lake','mill','town','observatory','castle']
steps={'forest':['fwNext','fwNext','fwNext','fwHotspot','fwScopeRight','fwScopeRight','fwScopeRight','fwFound','fwSave'],'bridge':['bwNext','bwNext','bwNext','bwLook','bwRight','bwRight','bwRight','bwRight','bwDiscovered','bwSave'],'mountain':['mwNext','mwNext','mwScopeBtn','mwRevealBtn','mwSaveBtn']}
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 err=[];page.on('pageerror',lambda e:err.append(str(e)))
 page.evaluate(shim);page.set_content(raw,wait_until='domcontentloaded',timeout=30000)
 progress=[];solved=0
 try:
  for level,r in enumerate(routes):
   state=page.evaluate('window.__ADVENTURE_TEST__.get()')
   assert state['currentRoute']==r and state['state']=='intro',(r,state)
   page.locator('#begin').click(timeout=2000)
   for i in range(8 if level==0 else 12):
    page.wait_for_function('i=>window.__ADVENTURE_TEST__.get().state===\'driving\' && window.__ADVENTURE_TEST__.get().index===i',arg=i,timeout=10000)
    answer=page.evaluate('i=>window.__ADVENTURE_TEST__.get().tasks[i].a',i)
    page.evaluate('num=>{for(const x of String(num))document.querySelector(`[data-key="${x}"]`).click()}',answer)
    assert page.evaluate('(i)=>{const x=window.__ADVENTURE_TEST__.get();return x.state==="dodging"||x.index===i+1}',i),f'answer {r}/{i}'
    solved+=1
   page.wait_for_function('()=>window.__ADVENTURE_TEST__.get().state===\'reward\'',timeout=10000)
   if r=='majakas':
    page.locator('#cinemaTelescope').click(timeout=2500)
    page.wait_for_function('()=>window.__ADVENTURE_TEST__.get().step===\'postcard\'',timeout=10000)
   else:
    for button in steps.get(r,['advRight','advRight','advSpy','advTakeCard']):
     page.locator('#'+button).click(timeout=2500,force=True)
   earn=page.evaluate('window.__ADVENTURE_TEST__.earnedCards().length')
   assert earn==level+1,(r,earn,level)
   page.locator('#rewardPrimary').click(timeout=2500)
   assert page.locator('#fwMap button[data-card]').count()==(0 if level==0 else 9) or level==0, r+' unexpected map card count'
   if level==8:
    assert page.locator('.fw-map-count').text_content()=='9 / 9'
   else:
    page.locator('#'+('rewardMapGo' if level==0 else 'rewardPrimary')).click(timeout=2500)
   progress.append(r)
   print('PASS',r,earned if False else earn)
  print('RESULT',json.dumps({'routes':progress,'answers':solved,'cards':9,'errors':err},ensure_ascii=False))
 except Exception as e:
  print('FAIL',repr(e),'lastRoute',r,'step',page.evaluate('window.__ADVENTURE_TEST__.get()'))
  print('errors',err)
 finally: b.close()