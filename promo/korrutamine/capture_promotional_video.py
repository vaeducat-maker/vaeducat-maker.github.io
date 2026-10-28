from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import json, subprocess, shutil

OUT=Path("promo/korrutamine/media")
OUT.mkdir(parents=True,exist_ok=True)
URL="https://edukass.ee/games/korrutamine-test/?edukass-test=all#missions"
stats=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox","--disable-dev-shm-usage"])
    context=browser.new_context(
        viewport={"width":1280,"height":800},
        device_scale_factor=1,
        record_video_dir=str(OUT),
        record_video_size={"width":1280,"height":800},
        reduced_motion="reduce"
    )
    page=context.new_page()
    errs=[]
    page.on("pageerror",lambda error: errs.append(str(error)))
    page.goto(URL,wait_until="domcontentloaded",timeout=60000)
    page.wait_for_function("Boolean(window.__EDUKASS_TEST__) ",timeout=20000)
    page.wait_for_timeout(1500)
    def shot(name):
        page.screenshot(path=str(OUT/(name+".png")),animations="disabled")
        print("SHOT",name,flush=True)
    def api(js,*args):
        return page.evaluate("(args)=>{const t=window.__EDUKASS_TEST__;"+js+"}",list(args))
    shot("01-start")
    api("t.skipIntro();")
    page.wait_for_timeout(650)
    api("t.showMap();")
    page.wait_for_timeout(800)
    shot("02-map")
    def run_mission(mid,prefix,complete=True):
        api("t.requestLevel(args[0]);",mid)
        page.wait_for_timeout(850)
        st=api("return t.getState();")
        if st["currentLevel"]!=mid or not st["roundActive"]:
            raise RuntimeError("Mission failed to start: "+str(mid)+" "+str(st))
        shot(prefix+"-question")
        page.wait_for_timeout(1200)
        if complete:
            for i in range(15):
                prev=api("return t.getState().correct;")
                api("t.answerCorrect();")
                try:
                    page.wait_for_function("""prev => {
                        const s=window.__EDUKASS_TEST__.getState();
                        return s.correct>prev || !s.roundActive;
                    }""",arg=prev,timeout=7000)
                except PlaywrightTimeoutError:
                    raise RuntimeError("Correct answer did not advance, mission "+str(mid)+" question "+str(i)+"; state="+str(api("return t.getState();")))
                page.wait_for_timeout(650)
            page.wait_for_timeout(2300)
            if not page.locator("#resultScreen").evaluate("(e)=>e.classList.contains('is-active')"):
                raise RuntimeError("Mission "+str(mid)+" did not complete normally")
            shot(prefix+"-victory")
            api("t.showMap();")
            page.wait_for_timeout(1100)
            shot(prefix+"-map-after")
        stats.append({"mission":mid,"screens":prefix,"completed":complete})
    run_mission(1,"03-first",True)
    run_mission(11,"04-division",False)
    api("t.showMap();")
    page.wait_for_timeout(450)
    run_mission(124,"05-middle",True)
    run_mission(252,"06-final",True)
    page.wait_for_timeout(1000)
    print("BROWSER ERRORS:",errs[:10],flush=True)
    (OUT/"capture-report.json").write_text(json.dumps({"source_url":URL,"scenes":stats,"browser_errors":errs},indent=2),encoding="utf-8")
    video=page.video
    context.close()
    src=Path(video.path())
    browser.close()
    shutil.copyfile(src,OUT/"actual-playthrough.webm")

# 4:5 Facebook feed video with branded letterbox, original recorded gameplay centered.
# Deliberately NO fabricated UI, no fake game achievements, no imported music.
ffmpeg=[
"ffmpeg","-y","-i",str(OUT/"actual-playthrough.webm"),
"-vf",
"fps=24,scale=1080:675:flags=lanczos,pad=1080:1350:0:337:color=0x0a1234,"
"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='EDUKASS  ·  KORRUTAMINE':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=90,"
"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='16 peatükki  ·  252 missiooni':fontcolor=0x7be3d4:fontsize=32:x=(w-text_w)/2:y=170,"
"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='MÄNGI TASUTA  ·  edukass.ee':fontcolor=0xffe37c:fontsize=38:x=(w-text_w)/2:y=1185",
"-an","-c:v","libx264","-preset","veryfast","-crf","23","-pix_fmt","yuv420p","-movflags","+faststart",
str(OUT/"EDUKASS-real-playthrough-facebook.mp4")
]
subprocess.run(ffmpeg,check=True)
print("Done",[(f.name,f.stat().st_size) for f in OUT.iterdir()],flush=True)
