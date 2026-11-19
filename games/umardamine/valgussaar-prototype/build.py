from pathlib import Path
root=Path(__file__).resolve().parent
html=(root/'src/app.html').read_text(encoding='utf-8')
css=(root/'src/styles.css').read_text(encoding='utf-8')
js=(root/'src/game.js').read_text(encoding='utf-8')
assert '/*__CSS__*/' in html and '/*__JS__*/' in html
# Make local file independent of external assets or web access.
html=html.replace('/*__CSS__*/',css).replace('/*__JS__*/',js)
(root/'EDUKASS_Valgussaar_World1_Play.html').write_text(html,encoding='utf-8')
print('Built',root/'EDUKASS_Valgussaar_World1_Play.html',len(html),'chars')