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
