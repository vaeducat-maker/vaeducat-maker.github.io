"""Chromium acceptance suite for EDUKASS nine-world runner.
Run: python games/umardamine/nine-worlds/tests/test_nine_worlds.py
Requires: pip install playwright; playwright install chromium
Screenshots are generated locally; this script is not a substitute for manual review.
"""
from pathlib import Path
import threading
import json
import shutil
import functools
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs):
  super().__init__(*args,directory=str(ROOT),**kwargs)
 def log_message(self,*args):pass

httpd=ThreadingHTTPServer(("127.0.0.1",0),Handler)
threading.Thread(target=httpd.serve_forever,daemon=True).start()
URL=f"http://127.0.0.1:{httpd.server_port}/index.html"

UNIT_QUOTAS={
 1:{10:7,100:1},
 2:{10:7,100:5},
 3:{10:3,100:4,1000:5},
 4:{10:2,100:3,1000:4,10000:3},
 5:{100:2,1000:3,10000:4,100000:3},
 6:{1000:2,10000:3,100000:4,1000000:3},
 7:{10000:2,100000:3,1000000:4,10000000:3},
 8:{100000:2,1000000:3,10000000:4,100000000:3},
 9:{10:1,100:2,1000:2,10000:2,100000:1,1000000:1,10000000:1,100000000:2}
}
CASE_QUOTAS_8={'down':2,'up':2,'boundary4':1,'boundary5':1,'carry':1,'zeroDown':1}
CASE_QUOTAS_12={'down':4,'up':2,'boundary4':1,'boundary5':1,'carry':2,'zeroDown':1,'zeroUp':1}

def verify_methodical_round(tasks,world):
 from collections import Counter
 assert Counter(t['unit'] for t in tasks)==Counter(UNIT_QUOTAS[world])
 assert Counter(t['scenario'] for t in tasks)==Counter(CASE_QUOTAS_8 if world==1 else CASE_QUOTAS_12)
 assert len({t['v'] for t in tasks})==len(tasks)
 for t in tasks:
  n,u,answer,kind=t['v'],t['unit'],t['answer'],t['scenario']
  assert n%u!=0,(world,t)  # Never an already-rounded exercise
  assert answer==((n+u//2)//u)*u,(world,t)
  d=(n//(u//10))%10
  carries=answer//u%10==0 and d>=5
  zero='0' in str(n)[1:-1]
  match={
   'down':1<=d<=3,'up':6<=d<=9,
   'boundary4':d==4,'boundary5':d==5,
   'carry':carries,'zeroDown':d<=4 and zero,
   'zeroUp':d>=5 and zero
  }
  assert match[kind],(world,t,match)
 assert sum((t['v']//(t['unit']//10))%10<5 for t in tasks)==(4 if world==1 else 6)
 if world>1:
  assert not any(tasks[i]['unit']==tasks[i-1]['unit']==tasks[i-2]['unit']==tasks[i-3]['unit'] for i in range(3,len(tasks)))

def validate(browser,width,height,label,full=True):
 context=browser.new_context(viewport={"width":width,"height":height},device_scale_factor=1)
 page=context.new_page()
 errors=[]
 page.on("pageerror",lambda err:errors.append(str(err)))
 page.goto(URL,wait_until="domcontentloaded")
 assert page.locator(".world-menu .world-choice").count()==9
 assert page.locator("#worldMenu .world-choice:not([disabled])").count()==1
 assert page.locator(".keypad [data-key='check']").count()==0
 assert page.locator(".keypad .key").count()==11
 assert page.locator("#introName").inner_text()=="Valgussaar"
 assert page.locator(".intro-crystal").count()==9
 assert "KRISTALLIRÄNNAK" in page.locator(".intro-game-name").inner_text()
 assert page.locator("#shareGame").is_visible()
 assert page.locator("#openPassport").is_visible()
 assert page.locator("#solarTrack").get_attribute("src")=="assets/02_solar_spark.mp3"
 assert page.locator("#softFail").get_attribute("src")=="assets/01_soft_oops.mp3"
 assert page.locator("#solarTrack").evaluate("(a)=>a.volume")==0.32
 assert page.locator("#softFail").evaluate("(a)=>a.volume")==0.53
 page.locator("#shareGameIntro").click()
 assert page.locator("#shareDialog").is_visible()
 assert page.locator("#shareQr svg").count()==1
 public_link=page.locator("#shareUrl").input_value()
 assert public_link.startswith("http://127.0.0.1:") and "#ekpass=" not in public_link
 page.locator("#closeShare").click()
 assert not page.locator("#shareDialog").is_visible()
 page.locator("#openPassportIntro").click()
 assert page.locator("#passportDialog").is_visible()
 assert "KOGUTUD 0 / 9" in page.locator("#passportSummary").inner_text()
 page.locator("#createPassport").click()
 assert page.locator("#passportQr svg").count()==1
 start_link=page.locator("#passportUrl").input_value()
 assert "#ekpass=" in start_link
 page.locator("#closePassport").click()
 assert not page.locator("#passportDialog").is_visible()
 # A valid passport URL is not silently imported: new device must confirm.
 second=browser.new_context(viewport={"width":width,"height":height})
 other=second.new_page()
 other.goto(start_link,wait_until="domcontentloaded")
 assert other.locator("#passportDialog").is_visible()
 assert other.locator("#passportConfirm").is_visible()
 assert other.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==0
 other.locator("#passportRestore").click()
 assert not other.locator("#passportDialog").is_visible()
 assert other.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==0
 second.close()
 page.screenshot(path=str(ROOT/f"qa_{label}_world_1_intro.png"))
 if width<600:
  bounds=page.evaluate("""() => ({
   bottom:document.querySelector('.key-zero').getBoundingClientRect().bottom,
   h:innerHeight,scrollWidth:document.documentElement.scrollWidth,w:innerWidth
  })""")
  assert bounds["bottom"]<=bounds["h"]+3,bounds
  assert bounds["scrollWidth"]<=bounds["w"]+3,bounds
 if not full:
  context.close()
  return
 collected=[]
 for world in range(1,10):
  assert page.evaluate("window.__EDUKASS_TEST__.get().worldId")==world
  page.locator("#begin").click()
  initial=page.evaluate("window.__EDUKASS_TEST__.get()")
  count=8 if world==1 else 12
  assert len(initial["tasks"])==count,(world,initial)
  verify_methodical_round(initial['tasks'],world)
  # Verify several fresh random rounds with the full pedagogical distribution.
  for _ in range(20):
   sample=page.evaluate('window.__EDUKASS_TEST__.generate()')
   verify_methodical_round(sample,world)
  if world>=3:
   assert 10<=initial["distance"]/initial["runningSpeed"]<=31
  # Test actual keypad click on the first digit, then deterministic in-game stepping.
  for i in range(count):
   data=page.evaluate("window.__EDUKASS_TEST__.get()")
   assert data["status"]=="running" and data["step"]==i,(world,i,data)
   answer=str(data["tasks"][i]["answer"])
   if i==0:
    page.locator(f"#keypad [data-key='{answer[0]}']").click()
    for char in answer[1:]:page.evaluate("(d)=>window.__EDUKASS_TEST__.press(d)",char)
   else:
    for char in answer:page.evaluate("(d)=>window.__EDUKASS_TEST__.press(d)",char)
   assert page.evaluate("window.__EDUKASS_TEST__.get().solved"),(world,i)
   outcome=page.evaluate("""() => {
    const api=window.__EDUKASS_TEST__,step=api.get().step;
    for(let k=0;k<1500;k++){api.tick(35);if(api.get().step>step||api.get().status!=='running')break}
    return api.get();
   }""")
   assert outcome["step"]==i+1 and outcome["status"] in ("running","finished"),(world,i,outcome)
  s=page.evaluate("window.__EDUKASS_TEST__.get()")
  assert s["status"]=="finished" and s["vaultCount"]==world
  collected.append(world)
  page.wait_for_timeout(1900)
  assert page.locator("#finishHero").is_visible()
  assert page.locator("#awardCrystalArt svg").count()==1
  page.screenshot(path=str(ROOT/f"qa_{label}_world_{world}_award.png"))
  if world<9:
   page.locator("#nextWorld").click()
   assert page.locator("#introHero").is_visible()
   assert page.evaluate("window.__EDUKASS_TEST__.get().worldId")==world+1
   if world==1:
    # Earned crystal must survive a personal, QR-ready link on a different device.
    page.locator("#openPassportIntro").click()
    page.locator("#createPassport").click()
    assert page.locator("#passportQr svg").count()==1
    transfer=page.locator("#passportUrl").input_value()
    new_device=browser.new_context(viewport={"width":width,"height":height})
    second_page=new_device.new_page()
    second_page.goto(transfer,wait_until="domcontentloaded")
    assert second_page.locator("#passportConfirm").is_visible()
    assert "1 / 9" in second_page.locator("#passportImportSummary").inner_text()
    assert second_page.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==0
    second_page.locator("#passportRestore").click()
    assert second_page.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==1
    assert second_page.evaluate("window.__EDUKASS_TEST__.get().worldId")==2
    assert second_page.locator("#introName").inner_text()=="Päikesekuru"
    assert second_page.evaluate("JSON.parse(localStorage.getItem('edukass-neon-crystal-vault-v1'))")==[1]
    new_device.close()
    page.locator("#closePassport").click()
   page.screenshot(path=str(ROOT/f"qa_{label}_world_{world+1}_intro.png"))
  else:
   # The automatic cinematic also activates after the winning ceremony.
   page.locator("#nextWorld").click()
   assert page.locator("#fusionHero").is_visible()
   assert page.locator("#fusionPieces .fusion-piece").count()==9
   assert page.locator("#ultimateGem svg").count()==1
   assert page.evaluate("localStorage.getItem('edukass-ultimate-crystal')")=="1"
   page.screenshot(path=str(ROOT/f"qa_{label}_ultimate_crystal.png"))
 assert collected==list(range(1,10))
 assert page.evaluate("JSON.parse(localStorage.getItem('edukass-neon-crystal-vault-v1'))")==list(range(1,10))
 page.locator("#fusionClose").click()
 assert page.locator("#showUltimate").is_visible()
 page.locator("#showUltimate").click()
 assert page.locator("#fusionHero").is_visible()
 assert not errors,errors
 print(json.dumps({"viewport":label,"worlds":9,"tasks":104,"fusion":"PASS","console_errors":errors},ensure_ascii=False))
 context.close()

try:
 with sync_playwright() as p:
  opts={"headless":True}
  exe=shutil.which("chromium") or shutil.which("google-chrome")
  if exe:opts["executable_path"]=exe
  browser=p.chromium.launch(**opts)
  validate(browser,390,844,"portrait")
  validate(browser,360,600,"compact",full=False)
  validate(browser,844,390,"landscape",full=False)
  browser.close()
finally:
 httpd.shutdown()
