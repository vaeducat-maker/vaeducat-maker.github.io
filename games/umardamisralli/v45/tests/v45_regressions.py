"""Ümardamisralli v45 regression checks. Requires playwright + a Chromium browser.
Loads the built index.html via document injection to work in locked-down runners.
Run: python tests/v45_regressions.py
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'dist/index.html').read_text(encoding='utf8')
shim="""(()=>{const m=new Map(),s={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,''+v),removeItem:k=>m.delete(k),clear:()=>m.clear()};Object.defineProperty(window,'localStorage',{value:s,configurable:true});Object.defineProperty(window,'sessionStorage',{value:s,configurable:true});})();"""
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
    for w,h in [(390,844),(844,390)]:
        page=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True)
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.evaluate(shim)
        page.set_content(HTML,wait_until='domcontentloaded')
        page.evaluate("""()=>{localStorage.setItem('edukass-rounding-postcards-v1',JSON.stringify(['majakas','forest','bridge','mountain','lake','mill']));__RALLI_TEST__.startBridgeRoute();__RALLI_TEST__.rewardOpen('bridge-map')}""")
        assert page.locator('#fwMap button[data-card]').count()==9
        assert page.locator('.fw-album').count()==0
        assert 'VANALINN' in page.locator('#rewardPrimary').text_content()
        page.locator('#rewardPrimary').tap()
        assert page.evaluate('__ADVENTURE_TEST__.get().currentRoute')=='town'
        page.evaluate("__RALLI_TEST__.startMountainRoute();__RALLI_TEST__.rewardOpen('mountain-reveal')")
        page.locator('#mwPhoto').tap()
        assert page.evaluate('__MOUNTAIN_TEST__.get().step')=='mountain-postcard'
        assert not errors, errors
        page.close()
    browser.close()
print('PASS: v45 touchscreen UI, single gallery and correct next route in portrait and landscape')