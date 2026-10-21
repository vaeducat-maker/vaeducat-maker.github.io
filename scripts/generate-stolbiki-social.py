#!/usr/bin/env python3
"""EDUKASS Stolbiki social image, generated from the actual embedded world artwork."""
import base64
import io
import math
import random
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT=Path(__file__).resolve().parent.parent
PAGE=ROOT/'proov/stolbiki-mosaic-7q4m9k/index.html'
OUT=ROOT/'assets/stolbiki-share-preview.jpg'
W,H=1200,630
FONTS={
  'bold':['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf'],
  'regular':['/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf']
}
def font(n,bold=False):
    for path in FONTS['bold' if bold else 'regular']:
        if Path(path).is_file():return ImageFont.truetype(path,n)
    return ImageFont.load_default()
def world():
    raw=PAGE.read_text(encoding='utf-8')
    match=re.search(r'const PROTO_WORLD_IMG\s*=\s*"data:image/jpeg;base64,([^" ]+)"',raw)
    if not match:raise RuntimeError('Stolbiki illustration missing in game source')
    return Image.open(io.BytesIO(base64.b64decode(match.group(1)))).convert('RGBA')
def cover(img,w,h):
    ratio=max(w/img.width,h/img.height)
    scaled=img.resize((round(img.width*ratio),round(img.height*ratio)),Image.Resampling.LANCZOS)
    x=(scaled.width-w)//2;y=(scaled.height-h)//2
    return scaled.crop((x,y,x+w,y+h))

bg=Image.new('RGB',(W,H))
d=ImageDraw.Draw(bg)
for y in range(H):
    t=y/H
    d.line((0,y,W,y),fill=(round(10+10*t),round(27+17*t),round(57+21*t)))
base=bg.convert('RGBA')
glows=Image.new('RGBA',(W,H),(0,0,0,0));g=ImageDraw.Draw(glows)
g.ellipse((470,-130,1080,440),fill=(31,193,166,70))
g.ellipse((-140,340,460,870),fill=(132,82,220,65))
g.ellipse((870,370,1390,800),fill=(250,116,180,45))
base=Image.alpha_composite(base,glows.filter(ImageFilter.GaussianBlur(65)))
d=ImageDraw.Draw(base)
random.seed(15)
for i in range(48):
    x=random.randrange(W);y=random.randrange(H)
    d.ellipse((x,y,x+2,y+2),fill=(166,206,239,random.randrange(35,120)))
d.text((60,49),'EDUKASS',font=font(26,True),fill='#85E7D5')
d.rounded_rectangle((54,100,65,168),radius=4,fill='#73DED1')
d.text((85,102),'Kirjalik',font=font(64,True),fill='white')
d.text((55,166),'arvutamine',font=font(64,True),fill='white')
d.text((60,265),'Liitmine · Lahutamine',font=font(24),fill='#CEDFF0')
d.text((60,302),'Korrutamine · Jagamine',font=font(24),fill='#CEDFF0')
d.rounded_rectangle((56,373,389,426),radius=22,fill='#2A5B79',outline='#62B1AF',width=2)
d.text((76,384),'15 MINUTIT PÄEVAS',font=font(23,True),fill='#B3F8DB')
for i,(color,sym) in enumerate(zip(['#72D7CD','#F392B5','#FFD76E','#9A8DEA'],['+','−','×','÷'])):
    x=65+i*79
    d.rounded_rectangle((x,464,x+63,527),radius=18,fill=color)
    f=font(47,True);bb=d.textbbox((0,0),sym,font=f)
    d.text((x+(63-(bb[2]-bb[0]))/2,464+(63-(bb[3]-bb[1]))/2-bb[1]),sym,font=f,fill='#142E59')
d.text((62,558),'ARVUTA  ·  EHITA OMA MAAILMA',font=font(16,True),fill='#9FAFDC')
# Actual world image from this game (never the separate Korrutustabel cat).
art=cover(world(),400,385)
panel=Image.new('RGBA',(452,437),'#0B2C5A')
p=ImageDraw.Draw(panel);p.rounded_rectangle((0,0,451,436),radius=35,fill='#0B2C5A',outline='#8BC7C9',width=3)
mask=Image.new('L',(400,385));ImageDraw.Draw(mask).rounded_rectangle((0,0,399,384),radius=22,fill=255)
panel.paste(art,(26,26),mask)
base.alpha_composite(panel,(710,67));d=ImageDraw.Draw(base)
d.rounded_rectangle((738,93,994,143),radius=22,fill='#F6FAFF')
d.text((760,107),'MINU MAAILM',font=font(22,True),fill='#1D4567')
d.rounded_rectangle((932,430,1127,476),radius=18,fill='#FFEDA7')
d.text((953,440),'50 / 550',font=font(23,True),fill='#244063')
# An authentic written multiplication grid as in the educational trainer.
d.rounded_rectangle((850,382,1145,573),radius=24,fill='#FFFDF7',outline='#E7DDBF',width=3)
ox,oy,cell=906,408,45
for i in range(4):d.line((ox,oy+i*cell,ox+5*cell,oy+i*cell),fill='#E4E7E7',width=1)
for i in range(6):d.line((ox+i*cell,oy,ox+i*cell,oy+3*cell),fill='#E4E7E7',width=1)
for txt,c,r in [('3',2,0),('0',3,0),('7',4,0),('×',0,1),('2',4,1),('6',2,2),('1',3,2),('4',4,2)]:
    d.text((ox+c*cell+12,oy+r*cell+1),txt,font=font(34,True),fill='#233854')
d.line((ox+45,oy+cell*2,ox+cell*5,oy+cell*2),fill='#253A54',width=3)
OUT.parent.mkdir(parents=True,exist_ok=True)
base.convert('RGB').save(OUT,'JPEG',quality=88,optimize=True,subsampling=0)
print('Generated social preview:',OUT,'1200x630',OUT.stat().st_size,'bytes')
