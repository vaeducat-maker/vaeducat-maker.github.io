"""Chromium acceptance suite for EDUKASS nine-world runner.
Run: python games/umardamine/nine-worlds/tests/test_nine_worlds.py
Requires: pip install playwright pillow zxing-cpp; playwright install chromium
Screenshots are generated locally; this script is not a substitute for manual review.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image
import zxingcpp
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
 3:{10:1,100:4,1000:5},
 4:{100:3,1000:4,10000:3},
 5:{100:1,1000:2,10000:4,100000:3},
 6:{1000:1,10000:2,100000:4,1000000:3},
 7:{10000:1,100000:2,1000000:4,10000000:3},
 8:{100000:1,1000000:2,10000000:4,100000000:3},
 9:{10:1,100:1,1000:2,10000:1,100000:1,1000000:1,10000000:1,100000000:2}
}
CASE_QUOTAS_8={'down':2,'up':2,'boundary4':1,'boundary5':1,'carry':1,'zeroDown':1}
CASE_QUOTAS_12={'down':4,'up':2,'boundary4':1,'boundary5':1,'carry':2,'zeroDown':1,'zeroUp':1}

def verify_methodical_round(tasks,world):
 from collections import Counter
 assert Counter(t['unit'] for t in tasks if not t.get('review'))==Counter(UNIT_QUOTAS[world])
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
 if world>=3:
  easy=[i for i,t in enumerate(tasks) if t.get('review')]
  assert len(easy)==2 and 3<=easy[0]<=6 and 8<=easy[1]<=10,(world,easy)
  assert {tasks[i]['scenario'] for i in easy}=={'up','down'}
  forms={(len(str(tasks[i]['v'])),tasks[i]['unit']) for i in easy}
  assert forms<={(2,10),(3,10),(3,100),(4,10),(4,100),(4,1000)},(world,forms)
  assert len({unit for _,unit in forms})==2 and min(d for d,_ in forms)<=3,(world,forms)
  if world==9:assert {t['unit'] for t in tasks}>={10,100,1000,10000,100000,1000000,10000000,100000000}
 else:
  assert not any(t.get('review') for t in tasks)
 if world>1:
  assert not any(tasks[i]['unit']==tasks[i-1]['unit']==tasks[i-2]['unit']==tasks[i-3]['unit'] for i in range(3,len(tasks)))

def assert_qr_decodes(page, element, expected):
 # Decode the actual rendered QR screenshot rather than trusting its SVG presence.
 qr = page.locator(element)
 qr.scroll_into_view_if_needed()
 result = zxingcpp.read_barcode(Image.open(BytesIO(qr.screenshot())).convert("RGB"))
 assert result is not None and result.text == expected, (element, expected, result)

def validate(browser,width,height,label,full=True):
 context=browser.new_context(viewport={"width":width,"height":height},device_scale_factor=1)
 page=context.new_page()
 errors=[]
 page.on("pageerror",lambda err:errors.append(str(err)))
 page.goto(URL,wait_until="domcontentloaded")
 assert page.locator("#vaultGrid .vault-card").count()==9
 assert page.locator("#vaultGrid .vault-card:not([disabled])").count()==1
 assert page.locator(".keypad [data-key='check']").count()==0
 assert page.locator(".keypad .key").count()==11
 assert page.locator("#introName").inner_text()=="Valgussaar"
 assert page.locator(".intro-crystal").count()==9
 assert "Kristallirännak" in page.locator(".intro-game-name").inner_text()
 assert page.locator("#introHero > p").count()==0
 assert page.locator("#begin").inner_text().strip().endswith("MÄNGI!")
 for control in ("#begin","#introSound","#shareGameIntro","#openPassportIntro","#introNineCrystals"):
  assert page.locator(control).is_visible(),control
  b=page.locator(control).bounding_box()
  assert b["x"]>=0 and b["y"]>=0 and b["x"]+b["width"]<=width+1 and b["y"]+b["height"]<=height+1,(label,control,b)
 assert page.locator(".intro-bottom").count()==0
 page.locator("#introNineCrystals").click()
 assert page.locator("#vaultHero").is_visible()
 page.locator("#vaultGrid .vault-card").first.click()
 assert page.locator("#introHero").is_visible()
 assert page.locator("#shareGame").is_visible()
 assert page.locator("#openPassport").is_visible()
 assert page.locator("#solarTrack").get_attribute("src")=="assets/02_solar_spark.mp3"
 assert page.locator("#softFail").get_attribute("src")=="assets/01_soft_oops.mp3"
 assert page.locator("#solarTrack").evaluate("(a)=>a.volume")==0.32
 assert page.locator("#softFail").evaluate("(a)=>a.volume")==0.53
 for clip in ("02_solar_spark.mp3","01_soft_oops.mp3"):
  resp=context.request.get(URL.rsplit("/",1)[0]+"/assets/"+clip)
  assert resp.status==200 and len(resp.body())>5000,(clip,resp.status,len(resp.body()))
 page.locator("#shareGameIntro").click()
 assert page.locator("#shareDialog").is_visible()
 assert page.locator("#shareQr svg").count()==1
 public_link=page.locator("#shareUrl").input_value()
 assert public_link.startswith("http://127.0.0.1:") and "#ekpass=" not in public_link
 assert_qr_decodes(page,"#shareQr",public_link)
 page.locator("#closeShare").click()
 assert not page.locator("#shareDialog").is_visible()
 page.locator("#openPassportIntro").click()
 assert page.locator("#passportDialog").is_visible()
 assert "KOGUTUD 0 / 9" in page.locator("#passportSummary").inner_text()
 page.locator("#createPassport").click()
 assert page.locator("#passportQr svg").count()==1
 start_link=page.locator("#passportUrl").input_value()
 assert "#ekpass=" in start_link
 assert_qr_decodes(page,"#passportQr",start_link)
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
  review_forms=set()
  for _ in range(60 if world>=3 else 20):
   sample=page.evaluate('window.__EDUKASS_TEST__.generate()')
   verify_methodical_round(sample,world)
   review_forms.update((len(str(t['v'])),t['unit']) for t in sample if t.get('review'))
  if world>=3:
   assert len(review_forms)>=4 and {10,100}<=set(u for _,u in review_forms),(world,review_forms)
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
  if world<9:
   page.wait_for_timeout(1900)
   assert page.locator("#finishHero").is_visible()
   assert page.locator("#awardCrystalArt svg").count()==1
   assert page.locator("#saveAfterVictory").is_visible()
  if world==1:
   page.locator("#saveAfterVictory").click()
   assert page.locator("#passportDialog").is_visible()
   assert "KOGUTUD 1 / 9" in page.locator("#passportSummary").inner_text()
   page.locator("#closePassport").click()
  if world<9:
   page.screenshot(path=str(ROOT/f"qa_{label}_world_{world}_award.png"))
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
    second_page.reload(wait_until="domcontentloaded")
    assert second_page.evaluate("window.__EDUKASS_TEST__.get().worldId")==2,"Local progress should resume at first unfinished world"
    assert second_page.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==1
    new_device.close()
    page.locator("#closePassport").click()
   page.screenshot(path=str(ROOT/f"qa_{label}_world_{world+1}_intro.png"))
  else:
   # No click or intermediary reward: actual final collision-free finish launches the cinema.
   page.locator("#fusionHero").wait_for(state="visible",timeout=2000)
   assert not page.locator("#finishHero").is_visible()
   assert page.locator("#fusionPieces .fusion-piece").count()==9
   assert page.locator("#ultimateGem svg").count()==1
   assert page.evaluate("localStorage.getItem('edukass-ultimate-crystal')")=="1"
   assert not page.locator("#fusionResult").is_visible()
   assert not page.locator("#fusionRestart").is_visible()
   page.wait_for_timeout(3000)
   assert page.locator("#fusionCosmos").evaluate("(c)=>c.width>0 && c.height>0")
   assert page.locator("#fusionPieces .fusion-piece").first.evaluate("(el)=>Number(el.style.opacity)")>.5
   page.screenshot(path=str(ROOT/f"qa_{label}_fusion_orbit.png"))
   page.wait_for_timeout(4600)
   page.screenshot(path=str(ROOT/f"qa_{label}_fusion_merge.png"))
   page.locator("#fusionClose").wait_for(state="visible",timeout=16000)
   assert page.locator("#ultimateGem").evaluate("(el)=>Number(el.style.opacity)")>.95
   page.screenshot(path=str(ROOT/f"qa_{label}_ultimate_crystal.png"))

 assert collected==list(range(1,10))
 assert page.evaluate("JSON.parse(localStorage.getItem('edukass-neon-crystal-vault-v1'))")==list(range(1,10))
 page.locator("#fusionClose").click()
 assert page.locator("#showUltimate").is_visible()
 page.locator("#showUltimate").click()
 assert page.locator("#fusionHero").is_visible()
 page.locator("#fusionRestart").wait_for(state="visible",timeout=16000)
 page.once("dialog",lambda dialog:dialog.dismiss())
 page.locator("#fusionRestart").click()
 assert page.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==9
 assert page.locator("#fusionHero").is_visible()
 page.once("dialog",lambda dialog:dialog.accept())
 page.locator("#fusionRestart").click()
 assert page.locator("#introHero").is_visible()
 assert page.evaluate("window.__EDUKASS_TEST__.get().worldId")==1
 assert page.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==0
 assert page.evaluate("localStorage.getItem('edukass-ultimate-crystal')") is None
 page.reload(wait_until="domcontentloaded")
 assert page.evaluate("window.__EDUKASS_TEST__.get().worldId")==1
 assert page.evaluate("window.__EDUKASS_TEST__.get().vaultCount")==0
 assert page.locator("#vaultGrid .vault-card:not([disabled])").count()==1
 assert not errors,errors
 print(json.dumps({"viewport":label,"worlds":9,"tasks":104,"fusion":"PASS","console_errors":errors},ensure_ascii=False))
 context.close()

def validate_correction(browser):
 context=browser.new_context(viewport={"width":390,"height":844})
 page=context.new_page()
 errors=[]
 page.on("pageerror",lambda e:errors.append(str(e)))
 page.goto(URL,wait_until="domcontentloaded")
 page.locator("#begin").click()
 state=page.evaluate("window.__EDUKASS_TEST__.get()")
 answer=str(state["tasks"][0]["answer"])
 wrong=answer[:-1]+("1" if answer[-1]!="1" else "2")
 for char in wrong:page.locator(f'#keypad [data-key="{char}"]').click()
 assert page.evaluate("window.__EDUKASS_TEST__.get().wrongLocked")
 assert page.locator("#answerBox").evaluate("(el)=>el.classList.contains('wrong')")
 assert page.evaluate("window.__EDUKASS_TEST__.get().runningSpeed")==state["runningSpeed"],"Wrong answer must not accelerate collision"
 page.locator('#keypad [data-key="back"]').click()
 assert page.evaluate("window.__EDUKASS_TEST__.get().typed")==answer[:-1]
 assert not page.evaluate("window.__EDUKASS_TEST__.get().wrongLocked")
 assert not page.locator("#answerBox").evaluate("(el)=>el.classList.contains('wrong')")
 # A second typo can also be erased using a physical keyboard.
 page.locator(f'#keypad [data-key="{wrong[-1]}"]').click()
 page.keyboard.press("Backspace")
 assert page.evaluate("window.__EDUKASS_TEST__.get().typed")==answer[:-1]
 page.locator(f'#keypad [data-key="{answer[-1]}"]').click()
 assert page.evaluate("window.__EDUKASS_TEST__.get().solved")
 page.evaluate("window.__EDUKASS_TEST__.tick(6500)")
 assert page.evaluate("window.__EDUKASS_TEST__.get().step")>=1
 # An uncorrected full wrong answer still causes an actual collision.
 page.evaluate("window.__EDUKASS_TEST__.reset();window.__EDUKASS_TEST__.start()")
 page.evaluate("""() => {const api=window.__EDUKASS_TEST__, a=String(api.get().tasks[0].answer);for(const digit of a.slice(0,-1)+(a.endsWith('1')?'2':'1'))api.press(digit);api.tick(14000)}""")
 assert page.evaluate("window.__EDUKASS_TEST__.get().crashReason")=="wrong"
 assert not errors,errors
 context.close()

def validate_audio(browser):
 context=browser.new_context(viewport={'width':390,'height':844})
 page=context.new_page()
 errors=[]
 page.on('pageerror',lambda error:errors.append(str(error)))
 page.goto(URL,wait_until='domcontentloaded')
 assert page.locator('#introSound').get_attribute('aria-pressed')=='true'
 page.locator('#introSound').click() # explicitly mute
 assert page.locator('#introSound').get_attribute('aria-pressed')=='false'
 page.reload(wait_until='domcontentloaded')
 assert page.locator('#introSound').get_attribute('aria-pressed')=='false'
 assert page.locator('#solarTrack').evaluate('(a)=>a.paused')
 page.locator('#introSound').click() # explicitly enable
 assert page.evaluate("localStorage.getItem('edukass-rounding-sound-v1')")=='on'
 page.wait_for_function("() => {const a=document.querySelector('#solarTrack');return a.readyState>=2&&!a.paused}",timeout=12000)
 assert page.locator('#introSound').get_attribute('aria-pressed')=='true'
 page.reload(wait_until='domcontentloaded')
 assert page.locator('#introSound').get_attribute('aria-pressed')=='true'
 page.locator('#begin').click()
 page.wait_for_function("() => {const a=document.querySelector('#solarTrack');return a.readyState>=2&&!a.paused}",timeout=12000)
 assert page.locator('#solarTrack').evaluate('(a)=>a.duration')>20
 page.locator('#shareGame').click()
 assert page.locator('#shareDialog').is_visible()
 before=page.evaluate('window.__EDUKASS_TEST__.get().playerX')
 page.evaluate('window.__EDUKASS_TEST__.tick(15000)')
 assert page.evaluate('window.__EDUKASS_TEST__.get().playerX')==before,'Game should pause during sharing'
 assert page.locator('#solarTrack').evaluate('(a)=>a.paused'),'Music should pause during sharing'
 page.locator('#closeShare').click()
 page.evaluate('window.__EDUKASS_TEST__.tick(14000)') # timeout collision
 assert page.evaluate('window.__EDUKASS_TEST__.get().crashReason')=='timeout'
 page.wait_for_function("() => document.querySelector('#softFail').currentTime>0",timeout=4000)
 assert page.locator('#solarTrack').evaluate('(a)=>a.paused'),'Music should stop on collision'
 assert not errors,errors
 print(json.dumps({'audio':'SOLAR_SPARK_AND_SOFT_OOPS_PASS','share_pause':'PASS','page_errors':errors}))
 context.close()

def validate_passport(browser):
 # Two genuinely separate browser profiles (no shared localStorage).
 old=browser.new_context(viewport={"width":390,"height":844})
 a=old.new_page();a.goto(URL,wait_until="domcontentloaded")
 a.evaluate("window.EDUKASS_GAME_PROGRESS.restore({completed:[1,2],lastWorld:3,ultimate:false})")
 a.locator("#openPassportIntro").click()
 assert a.locator("#passportDialog").is_visible()
 a.locator("#createPassport").click()
 link=a.locator("#passportUrl").input_value()
 assert link.startswith(URL+"#ekpass="),link
 assert a.locator("#passportQr svg").count()==1
 assert_qr_decodes(a,"#passportQr",link)
 # Ordinary sharing must contain no private progress and display independent QR.
 a.locator("#closePassport").click()
 a.locator("#shareGameIntro").click()
 assert a.locator("#shareDialog").is_visible()
 assert a.locator("#shareUrl").input_value()==URL
 assert a.locator("#shareQr svg").count()==1
 a.locator("#closeShare").click()
 newer=browser.new_context(viewport={"width":390,"height":844})
 b=newer.new_page();b.goto(link,wait_until="domcontentloaded")
 assert b.locator("#passportDialog").is_visible()
 assert b.locator("#passportConfirm").is_visible()
 assert b.evaluate("window.EDUKASS_GAME_PROGRESS.get().completed")==[], "Import must never happen without confirmation"
 assert b.locator("#passportImportSummary").is_visible()
 b.locator("#passportRestore").click()
 assert b.evaluate("window.EDUKASS_GAME_PROGRESS.get().completed")==[1,2]
 assert b.evaluate("window.EDUKASS_GAME_PROGRESS.get().lastWorld")==3
 assert b.locator("#introName").inner_text()=="Mäevardjad"
 # Reopening the game on device B must retain both crystals.
 b.reload(wait_until="domcontentloaded")
 assert b.evaluate("window.EDUKASS_GAME_PROGRESS.get().completed")==[1,2]
 assert b.locator("#vaultGrid .vault-card:not([disabled])").count()==3
 print(json.dumps({"passport":"TWO_DEVICE_TRANSFER_PASS","qr":"BOTH_VISIBLE","confirmation":"REQUIRED"}))
 old.close();newer.close()

try:
 with sync_playwright() as p:
  opts={"headless":True}
  exe=shutil.which("chromium") or shutil.which("google-chrome")
  if exe:opts["executable_path"]=exe
  browser=p.chromium.launch(**opts)
  validate(browser,390,844,"portrait")
  validate(browser,360,600,"compact",full=False)
  validate(browser,844,390,"landscape",full=False)
  validate_correction(browser)
  validate_audio(browser)
  validate_passport(browser)
  browser.close()
finally:
 httpd.shutdown()
