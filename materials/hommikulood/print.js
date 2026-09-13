import {stories} from './data.js';

const root=document.querySelector('#print-root');
const letters=['A','B','C','D'];
const clean=s=>String(s).replace(/<\/?b>/g,'');

for(let si=0;si<stories.length;si++){
  const story=stories[si];
  const page=document.createElement('section');
  page.className='sheet';
  page.id=`lugu-${si+1}`;
  const title=document.createElement('h1');
  title.className='title';
  title.textContent=story.title;
  page.append(title);

  const layout=document.createElement('div');
  layout.className='story-layout';
  const copy=document.createElement('div');
  copy.className='story-text';
  for(const paragraph of story.paras){const p=document.createElement('p');p.textContent=clean(paragraph);copy.append(p)}
  const image=document.createElement('img');
  image.className='story-art';image.src=story.image;image.alt=`${story.title} illustratsioon`;
  layout.append(copy,image);page.append(layout);

  const qs=document.createElement('section');qs.className='questions';
  const qh=document.createElement('h2');qh.textContent='VASTA KÜSIMUSTELE.';qs.append(qh);
  story.questions.forEach((q,qi)=>{
    const row=document.createElement('div');row.className='q';
    const n=document.createElement('span');n.className='n';n.textContent=String(qi+1);
    const body=document.createElement('div');body.className='qbody';
    const h=document.createElement('h3');h.textContent=q[0];body.append(h);
    const opts=document.createElement('div');opts.className='opts';
    q[1].forEach((o,oi)=>{const span=document.createElement('span');span.textContent=`${letters[oi]}. ${o}`;opts.append(span)});
    body.append(opts);
    const line=document.createElement('span');line.className='answer-line';line.setAttribute('aria-hidden','true');
    row.append(n,body,line);qs.append(row);
  });
  page.append(qs);

  const foot=document.createElement('footer');foot.className='footer';
  foot.innerHTML='<span class="footer-brand"><img src="assets/kiisu.png" alt=""><span>edukass.ee</span></span><span>Online: <a href="./">edukass.ee/materials/hommikulood/</a></span>';
  page.append(foot);root.append(page);
}

document.querySelector('#print-button')?.addEventListener('click',()=>window.print());
