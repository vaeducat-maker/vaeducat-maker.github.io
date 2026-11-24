"""Rebuild approved EDUKASS clips from their original 24 November audio synthesis.
Generates the same Solar Spark #2 arrangement and soft loss sound #1.
All content is original to EDUKASS, not a remix of third-party music.
Requirements: python -m pip install numpy; system ffmpeg.
"""
import math,os,subprocess,wave
from pathlib import Path
import numpy as np

ROOT=Path(__file__).resolve().parents[1]/"assets"
ROOT.mkdir(parents=True,exist_ok=True)
SR=24000
rng=np.random.default_rng(20261124)

def note_freq(n):return 440*2**((n-69)/12)
def oscillator(freq,length,kind='sine'):
 n=int(length*SR);t=np.arange(n)/SR;ph=2*np.pi*freq*t
 if kind=='sine':return np.sin(ph)
 if kind=='triangle':return 2/np.pi*np.arcsin(np.sin(ph))
 if kind=='saw':return 2*(freq*t%1)-1
 if kind=='square':return np.tanh(3*np.sin(ph))
 if kind=='bell':return .65*np.sin(ph)+.22*np.sin(2.01*ph)+.13*np.sin(3.99*ph)
 if kind=='pluck':return .65*np.sin(ph)+.22*np.sin(2*ph)+.10*np.sin(3*ph)+.04*np.sin(4*ph)
 return np.sin(ph)
def envelope(n,attack=.008,decay=.08,sustain=.5,release=.13):
 a=max(1,int(attack*SR));d=max(1,int(decay*SR));q=max(1,int(release*SR))
 e=np.ones(n)*sustain
 if n<=a+d+q:return np.minimum(np.arange(n)/a,1)*np.maximum(0,1-np.arange(n)[::-1]/q)
 e[:a]=np.linspace(0,1,a)
 e[a:a+d]=np.linspace(1,sustain,d)
 e[-q:]=np.linspace(sustain,0,q)
 return e
def add(track,start,wav,gain=.3,pan=0):
 pos=int(start*SR);end=min(len(track),pos+len(wav))
 if pos<0 or pos>=len(track):return
 x=wav[:end-pos]*gain
 track[pos:end,0]+=x*np.sqrt((1-pan)/2)
 track[pos:end,1]+=x*np.sqrt((1+pan)/2)
def tone(track,start,pitch,duration,kind,volume=.2,attack=.008,decay=.07,sustain=.5,release=.13,pan=0):
 n=max(1,int(duration*SR))
 signal=oscillator(note_freq(pitch),duration,kind)*envelope(n,attack,decay,sustain,release)
 add(track,start,signal,volume,pan)
def kick(track,start,v=.75):
 dur=.26;n=int(dur*SR);t=np.arange(n)/SR
 phase=2*np.pi*(46*t+43*(1-np.exp(-t*30))/30)
 x=np.sin(phase)*np.exp(-t*19)+.11*rng.standard_normal(n)*np.exp(-t*90)
 add(track,start,x,v)
def snare(track,start,v=.35):
 dur=.19;n=int(dur*SR);t=np.arange(n)/SR
 noise=rng.standard_normal(n);noise=np.r_[noise[0],np.diff(noise)]
 x=(noise*.43+np.sin(2*np.pi*181*t)*.2)*np.exp(-t*23)
 add(track,start,x,v)
def hat(track,start,v=.09,openhat=False):
 dur=.18 if openhat else .07;n=int(dur*SR);t=np.arange(n)/SR
 noise=rng.standard_normal(n);noise=np.r_[noise[0],np.diff(noise)]
 x=noise*np.exp(-t*(24 if openhat else 75))
 add(track,start,x,v,pan=float(rng.uniform(-.55,.55)))
def rise(track,start,length,v=.09):
 n=int(length*SR);t=np.arange(n)/SR
 noise=rng.standard_normal(n);noise=np.r_[noise[0],np.diff(noise)]
 x=noise*(t/length)**2*.4
 add(track,start,x,v)
def delay(track,seconds=.18,wet=.14):
 samples=int(seconds*SR);track[samples:]+=track[:-samples].copy()*wet
def chord(track,start,notes,duration,kind='sine',vol=.045):
 for idx,n in enumerate(notes):
  tone(track,start,n,duration,kind,vol,attack=.12,decay=.15,sustain=.5,release=.5,pan=(-.43 if idx%2==0 else .43))
def render_music(bpm,bars,mode,output=None):
 sec_per_beat=60/bpm;bar=sec_per_beat*4;length=bars*bar
 track=np.zeros((int((length+1.5)*SR),2),dtype=np.float64)
 if mode=='classic':
  roots=[48,44,41,46];chords=[[60,64,67],[57,60,64],[53,57,60],[58,62,65]]
  riff=[0,7,12,7,4,7,12,7,0,7,12,14,7,4,2,7]
 else:
  roots=[50,46,53,48];chords=[[62,65,69],[58,62,65],[65,69,72],[60,64,67]]
  riff=[0,4,7,12,7,14,12,7,0,7,12,16,14,12,7,4]
 for b in range(bars):
  pos=b*bar;root=roots[b%4]
  chord(track,pos,chords[b%4],bar+.3,kind='triangle',vol=.045)
  if mode=='classic':
   for k in range(4):
    kick(track,pos+k*sec_per_beat,.47)
    if k in (1,3):snare(track,pos+k*sec_per_beat,.30)
    for eighth in range(2):hat(track,pos+(k+eighth*.5)*sec_per_beat,.055)
    tone(track,pos+k*sec_per_beat,root-12,.36,'saw',.12,attack=.006,decay=.07,sustain=.38,release=.14)
   for step in range(16):
    if step%4==3 and b%4==3:continue
    tone(track,pos+step*sec_per_beat/4,root+24+riff[step],sec_per_beat*.20,'pluck',.082,attack=.004,decay=.035,sustain=.32,release=.06,pan=(-.25 if step%2 else .25))
  else:
   for k in range(4):
    kick(track,pos+k*sec_per_beat,.64)
    if k in (1,3):snare(track,pos+k*sec_per_beat,.26)
    for eighth in range(2):hat(track,pos+(k+eighth*.5)*sec_per_beat,.058 if eighth==0 else .039)
    tone(track,pos+k*sec_per_beat,root-12,.37,'saw',.12,attack=.006,decay=.08,sustain=.4,release=.1)
   for step in range(8):
    tone(track,pos+step*sec_per_beat/2,root+24+riff[(step*2+b%2)%16],sec_per_beat*.42,'bell',.118,attack=.008,decay=.06,sustain=.32,release=.19,pan=-.2 if step%2 else .2)
   if b%4==3:rise(track,pos+bar*.75,bar*.25,.12)
 for t in np.arange(0,length,bar):
  tone(track,t+.25,84,sec_per_beat*2,'bell',.013,attack=.1,decay=.15,sustain=.2,release=.3)
 delay(track,.19,.11)
 track=track[:int(length*SR)]
 fade=int(.35*SR)
 track[:int(.02*SR)]*=np.linspace(0,1,int(.02*SR))[:,None]
 track[-fade:]*=np.linspace(1,0,fade)[:,None]
 track=np.tanh(track*1.65)
 track=track/np.max(np.abs(track))*.87
 if output:write_mp3(output,track,channels=2)
def write_mp3(name,track,channels=1):
 wav=ROOT/(name+'.wav');mp3=ROOT/(name+'.mp3')
 with wave.open(str(wav),'wb') as w:
  w.setnchannels(channels);w.setsampwidth(2);w.setframerate(SR)
  w.writeframes((track*32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',str(wav),'-codec:a','libmp3lame','-qscale:a','3',str(mp3)],check=True)
 wav.unlink()
def render_soft_oops():
 n=int(1.25*SR);t=np.arange(n)/SR;voice=np.zeros(n)
 def blip(start,f1,f2,duration,amp,tri=False):
  u=np.maximum(0,t-start);mask=(t>=start)&(t<start+duration)
  phase=2*np.pi*(f1*u+(f2-f1)/(2*duration)*u*u)
  signal=np.sin(phase)
  if tri:signal=2/np.pi*np.arcsin(signal)
  env=np.minimum(1,u/.006)*np.exp(-4*u)
  return amp*signal*env*mask
 voice+=blip(0,659,520,.22,.36,True)
 voice+=blip(.16,510,330,.27,.32,True)
 voice+=blip(.44,390,290,.38,.23,False)
 voice=np.tanh(voice*1.2)
 voice*=np.clip((1.25-t)/.17,0,1)
 voice=np.clip(voice,-.92,.92)
 write_mp3('01_soft_oops',voice)
if __name__=='__main__':
 # The original preview generator rendered Classic before Solar Spark; reproduce
 # that deterministic RNG state so approved Solar Spark is as close as possible.
 render_music(124,12,'classic')
 render_music(136,13,'sunrise','02_solar_spark')
 render_soft_oops()
 for name in ('02_solar_spark.mp3','01_soft_oops.mp3'):
  p=ROOT/name
  print(name,p.stat().st_size)
