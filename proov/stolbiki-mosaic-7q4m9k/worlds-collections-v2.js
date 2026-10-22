/* EDUKASS worlds: original illustrated block-built scenes. Keep the demo
   intro picture unchanged. Every pupil gets a shuffled selection. */
(()=>{
const themes=[
 {id:'egiptus',name:'Kõrbetempel',sky:['#442c67','#f6a761'],ground:['#eeb66f','#b96b34','#79402d'],accent:'#ffe3a3',kind:'desert',seed:11},
 {id:'kosmos',name:'Kosmosebaas',sky:['#070c39','#3a337c'],ground:['#a6b9d9','#5b7197','#374467'],accent:'#7ff7f1',kind:'space',seed:21},
 {id:'halloween',name:'Halloweeni linn',sky:['#1b144b','#703572'],ground:['#484069','#2e2752','#191633'],accent:'#ffa84a',kind:'halloween',seed:31},
 {id:'talv',name:'Lumemaailm',sky:['#2259a0','#a4e7ff'],ground:['#e9f7ff','#b0d8f8','#6082b7'],accent:'#a9ffff',kind:'snow',seed:41},
 {id:'mets',name:'Võlumets',sky:['#0b3047','#447b6f'],ground:['#51996e','#235b56','#15364b'],accent:'#ffde8d',kind:'forest',seed:51},
 {id:'linn',name:'Taevalinn',sky:['#637db7','#ffd7b2'],ground:['#7dc682','#376b65','#2d4a64'],accent:'#ffe0a4',kind:'castle',seed:61},
 {id:'saladus',name:'Draakonisaar',sky:['#371744','#be5171'],ground:['#96585f','#4b314f','#281c37'],accent:'#ff6a3a',kind:'dragon',seed:71},
 {id:'ookean',name:'Veealune kuningriik',sky:['#064574','#03a2bc'],ground:['#4bb7cc','#287f9b','#125273'],accent:'#a9feff',kind:'ocean',seed:81},
 {id:'saared',name:'Õitemaailm',sky:['#7a87c9','#ffceea'],ground:['#85c979','#457e71','#386077'],accent:'#ff8bbb',kind:'blossom',seed:91},
 {id:'kristall',name:'Kristallikoobas',sky:['#160e4e','#6547a0'],ground:['#604d9b','#392e75','#1d2052'],accent:'#de91ff',kind:'crystal',seed:101},
 {id:'P2-meresadam',name:'Vana sadamalinn',sky:["#275387","#ffc78b"],ground:["#b9c8ab","#647b80","#344765"],accent:'#f4bc7e',kind:'harbor',seed:211},
 {id:'P2-talukyla',name:'Taluküla',sky:["#4e93cb","#f5d4a0"],ground:["#83ba55","#477f47","#755239"],accent:'#f6dd64',kind:'farm',seed:224},
 {id:'P2-tuulikud',name:'Tuulikute org',sky:["#56a2d3","#e6edac"],ground:["#75bd73","#3f8151","#524960"],accent:'#fff0b7',kind:'windmill',seed:237},
 {id:'P2-tramm',name:'Trammilinn',sky:["#e17a78","#ffdeac"],ground:["#a4a5af","#736481","#4b4a68"],accent:'#ffe484',kind:'tram',seed:250},
 {id:'P2-ounaaed',name:'Õunaaed',sky:["#61b5d8","#ffe7a0"],ground:["#8cc45a","#4d8a50","#6b6047"],accent:'#ff7770',kind:'orchard',seed:263},
 {id:'P2-maalinn',name:'Kõrbebasaar',sky:["#fd965e","#ffd69b"],ground:["#e8ba74","#b88554","#935a47"],accent:'#f7ff9b',kind:'bazaar',seed:276},
 {id:'P2-raamatukogu',name:'Raamatuküla',sky:["#3e73a1","#d7b1b4"],ground:["#aab491","#826b72","#514966"],accent:'#f2c979',kind:'library',seed:289},
 {id:'P2-talvejaam',name:'Mägiraudtee',sky:["#5a7eb6","#c6e4ff"],ground:["#aac0d4","#6c88a7","#4e5578"],accent:'#ffd467',kind:'rail',seed:302},
 {id:'P2-kuujaam',name:'Kuujaam',sky:["#0c1139","#624394"],ground:["#b5c5d7","#7788ab","#474764"],accent:'#8ef7e9',kind:'moon',seed:315},
 {id:'P2-kommilaat',name:'Kommilaat',sky:["#8f88d8","#ffd4e5"],ground:["#ffaac5","#bc7daa","#715caa"],accent:'#ffe38b',kind:'fair',seed:328},
 {id:'P3-dinod',name:'Dinosauruste org',sky:["#eda27d","#f9dea4"],ground:["#69a16b","#477866","#5e6a73"],accent:'#f8e38e',kind:'dino',seed:341},
 {id:'P3-tarud',name:'Mesilaste aed',sky:["#5ab1bd","#fff1a5"],ground:["#9bbd56","#518752","#526f61"],accent:'#ffd73f',kind:'bees',seed:354},
 {id:'P3-korallid',name:'Korallilaguun',sky:["#0766a9","#36d6dc"],ground:["#54bacc","#258ea5","#145375"],accent:'#fca6de',kind:'reef',seed:367},
 {id:'P3-kaevandus',name:'Tulekaevandus',sky:["#321b42","#b85558"],ground:["#a96a52","#7c3d3e","#492839"],accent:'#ffb04a',kind:'mine',seed:380},
 {id:'P3-pingviinid',name:'Pingviinilaht',sky:["#2066a7","#b2f6ff"],ground:["#e5faff","#a9d2e9","#587da6"],accent:'#ffffff',kind:'penguin',seed:393},
 {id:'P3-teaduspark',name:'Teaduspark',sky:["#3b6eb2","#d6e6ff"],ground:["#99aebb","#6785a4","#45617a"],accent:'#6ae7ff',kind:'science',seed:406},
 {id:'P3-vanaobserv',name:'Tähetorn',sky:["#161b59","#6050a1"],ground:["#7382a9","#4b6394","#32446e"],accent:'#f6e5af',kind:'observatory',seed:419},
 {id:'P3-metsarong',name:'Metsaraudtee',sky:["#558c94","#e4c89c"],ground:["#679d68","#496b66","#385365"],accent:'#ffa34c',kind:'steamtrain',seed:432},
 {id:'P3-laager',name:'Metsalaager',sky:["#476e7b","#f4b080"],ground:["#5f9b59","#36664b","#405a52"],accent:'#ffd88b',kind:'camp',seed:445},
 {id:'P3-kanjon',name:'Kanjonilinn',sky:["#bd7376","#ffc987"],ground:["#d9a073","#a65f4c","#71466a"],accent:'#ffe0a8',kind:'canyon',seed:458},
 {id:'P4-sakura',name:'Sakura küla',sky:["#8c86ba","#f7c9de"],ground:["#b6ca99","#678d78","#5b648a"],accent:'#f7a7d5',kind:'sakura',seed:471},
 {id:'P4-termaal',name:'Kuumaveeallikad',sky:["#8e658f","#ffbb94"],ground:["#b6a09a","#82677e","#4d5772"],accent:'#9ffaff',kind:'springs',seed:484},
 {id:'P4-ohulaev',name:'Õhulaevasadam',sky:["#447bb7","#ffdcbb"],ground:["#96aa91","#5d7390","#40536b"],accent:'#ffcc66',kind:'airship',seed:497},
 {id:'P4-robotid',name:'Robotitöökoda',sky:["#4a779b","#8dbec4"],ground:["#a4b5bb","#597481","#364d69"],accent:'#71f6fb',kind:'robot',seed:510},
 {id:'P4-aurujaam',name:'Aururongijaam',sky:["#aa6f77","#f9bd80"],ground:["#b6a39a","#816871","#5b4e68"],accent:'#ffc65a',kind:'station',seed:523},
 {id:'P4-seened',name:'Seeneküla',sky:["#564a92","#af8fcc"],ground:["#83a072","#48685f","#433969"],accent:'#ff8e9e',kind:'mushroom',seed:536},
 {id:'P4-lavendel',name:'Lavendlipõllud',sky:["#8d93cb","#ffc9d7"],ground:["#b1a6cb","#8574a7","#6b5d83"],accent:'#e2aaff',kind:'lavender',seed:549},
 {id:'P4-kalur',name:'Kalurite rand',sky:["#4c9ec8","#ffcfa5"],ground:["#d8c28e","#869b9b","#567588"],accent:'#f2eaa1',kind:'fishing',seed:562},
 {id:'P4-ohupallid',name:'Õhupallilaat',sky:["#75a6dd","#ffdaaf"],ground:["#80b993","#5b897e","#6a6d78"],accent:'#ffda66',kind:'balloon',seed:575},
 {id:'P4-puumajad',name:'Puulatvade küla',sky:["#3a9386","#cfe8aa"],ground:["#61a068","#316b53","#315965"],accent:'#f5d37d',kind:'treehouse',seed:588},
 {id:'P5-safari',name:'Safari oaas',sky:["#ec8f59","#fed38a"],ground:["#ceb277","#877e56","#705b4e"],accent:'#ffe792',kind:'safari',seed:601},
 {id:'P5-allveelaev',name:'Allveelaev',sky:["#074576","#21b6ca"],ground:["#60bac7","#258aa6","#13516d"],accent:'#ffdd72',kind:'submarine',seed:614},
 {id:'P5-lumejaam',name:'Lumeküla jaam',sky:["#2e7eb5","#b6e8f9"],ground:["#dceaf9","#9fbedb","#6483ac"],accent:'#ffe292',kind:'snowstation',seed:627},
 {id:'P5-kasvuhoone',name:'Klaaskasvuhoone',sky:["#6bb9bd","#d0e0a6"],ground:["#81b57a","#457b6d","#516975"],accent:'#b7f7d2',kind:'greenhouse',seed:640},
 {id:'P5-majakas',name:'Majakasaar',sky:["#388eb9","#ffe0ae"],ground:["#82b6a0","#547b88","#3a6176"],accent:'#fff4ba',kind:'lighthouse',seed:653},
 {id:'P5-ohtuturg',name:'Ööturg',sky:["#251942","#ab5686"],ground:["#82759a","#5e456f","#44365c"],accent:'#ffd76f',kind:'nightmarket',seed:666},
 {id:'P5-planeedid',name:'Planeedimuuseum',sky:["#090f44","#39479b"],ground:["#8495c9","#5368a4","#343e6c"],accent:'#a4ffff',kind:'planetarium',seed:679},
 {id:'P5-korvits',name:'Kõrvitsafarm',sky:["#a14b66","#feb577"],ground:["#b4a06b","#807151","#735055"],accent:'#ffa449',kind:'pumpkin',seed:692},
 {id:'P5-sepp',name:'Sepikoda',sky:["#574052","#de866b"],ground:["#a38b85","#68535f","#4f4052"],accent:'#ffa947',kind:'forge',seed:705},
 {id:'P5-seiklus',name:'Seikluspark',sky:["#429d9e","#d7e7ab"],ground:["#77a980","#46715b","#4b6772"],accent:'#f6db79',kind:'adventure',seed:718}
];
const r=(n)=>Math.round(n),tag=(s)=>s;
function block(x,y,w,h,front,side,top,d=12){
 x=r(x);y=r(y);w=r(w);h=r(h);d=r(d);
 return '<polygon points="'+x+','+y+' '+(x+d)+','+(y-d*.55)+' '+(x+w+d)+','+(y-d*.55)+' '+(x+w)+','+y+'" fill="'+top+'"/>'+
 '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+front+'"/>'+
 '<polygon points="'+(x+w)+','+y+' '+(x+w+d)+','+(y-d*.55)+' '+(x+w+d)+','+(y+h-d*.55)+' '+(x+w)+','+(y+h)+'" fill="'+side+'"/>'+
 '<path d="M'+x+' '+(y+h)+'h'+w+'" stroke="#080c3260" stroke-width="2"/>';
}
function pixelStars(seed,count,color){
 let m=seed,s='';for(let i=0;i<count;i++){m=(m*1664525+1013904223)>>>0;const x=m%600;m=(m*1664525+1013904223)>>>0;const y=m%460;
 const z=2+(m%5);s+='<rect x="'+x+'" y="'+y+'" width="'+z+'" height="'+z+'" fill="'+color+'" opacity="'+(.18+(m%6)*.10)+'"/>'}return s;
}
function art(t){
 const [sky1,sky2]=t.sky,[g0,g1,g2]=t.ground;let s='';
 s+='<svg xmlns="http://www.w3.org/2000/svg" width="600" height="680" viewBox="0 0 600 680"><defs>'+
 '<linearGradient id="sky" x2=".7" y2="1"><stop stop-color="'+sky1+'"/><stop offset="1" stop-color="'+sky2+'"/></linearGradient>'+
 '<radialGradient id="gl"><stop stop-color="'+t.accent+'" stop-opacity=".65"/><stop offset="1" stop-color="'+t.accent+'" stop-opacity="0"/></radialGradient>'+
 '</defs><rect width="600" height="680" fill="url(#sky)"/><circle cx="444" cy="173" r="190" fill="url(#gl)"/>';
 if(['space','halloween','crystal'].includes(t.kind))s+='<circle cx="442" cy="124" r="57" fill="'+t.accent+'" opacity=".65"/>';
 else s+='<circle cx="459" cy="125" r="45" fill="'+t.accent+'" opacity=".75"/>';
 s+=pixelStars(t.seed,68,'#ffffff');
 const dark=['space','halloween','crystal','dragon'].includes(t.kind);
 // Distant stepped block clouds, mountains and floating fragments.
 for(let i=0;i<9;i++){
  const x=(i*91+t.seed*3)%650-45,y=185+(i*49)%175,w=68+(i%3)*19;
  s+=block(x,y,w,13,dark?'#92a2d436':'#ffffff56',dark?'#ffffff16':'#b2d7ec51',dark?'#c4caff33':'#ffffff73',9);
 }
 for(let i=0;i<8;i++){
  const x=22+(i*113)%575,y=340+(i*37)%180;
  s+=block(x,y,17+(i%2)*12,9,g1,g2,g0,7);
 }
 // Cubic floating island with descending 3-D stone strata.
 for(let layer=5;layer>=0;layer--){
  const w=455-layer*27,x=(600-w)/2,y=458+layer*19;
  s+=block(x,y,w,33,g1,g2,layer===0?g0:g1,22);
 }
 // Vertical cube-cliff teeth and diagonal depth blocks.
 for(let i=0;i<11;i++){
  const x=104+i*39,down=20+((i*17+t.seed)%5)*18;
  s+=block(x,582,32,down,g1,g2,g0,12);
 }
 function light(x,y,w=9,h=16,col=t.accent){s+='<rect x="'+r(x)+'" y="'+r(y)+'" width="'+w+'" height="'+h+'" fill="'+col+'" opacity=".94"/>'}
 function tower(x,y,w,h,c=g0,roof=t.accent){
  s+=block(x,y,w,h,c,g2,g1,13);
  s+=block(x-8,y-19,w+16,19,roof,g2,roof,12);
  s+=block(x-3,y-29,w+7,13,roof,g2,roof,7);
  for(let j=0;j<Math.max(2,Math.floor(h/40));j++)light(x+w/2-5,y+24+j*39,10,13,t.accent);
 }
 function tree(x,y,leaves='#478c55',blossoms=false){
  s+=block(x,y,17,76,'#80503e','#58372e','#ae7953',7);
  s+=block(x-35,y-54,87,39,leaves,blossoms?'#a04b8a':'#264d4a',blossoms?'#ffc6df':'#73cc79',15);
  s+=block(x-20,y-86,60,40,leaves,blossoms?'#a04b8a':'#264d4a',blossoms?'#ffdceb':'#73cc79',13);
  s+=block(x-9,y-112,39,29,blossoms?'#ffb4d5':'#519b65',blossoms?'#a04b8a':'#255345',blossoms?'#ffe0ef':'#7bdc88',9);
 }
 if(t.kind==='castle'){
  tower(200,281,54,188,'#f7ece1','#4787ed');tower(340,292,56,177,'#fff0dd','#3675da');
  tower(274,245,72,220,'#ffeedb','#e2a352');tower(240,355,124,115,'#f7e4d2','#4588ed');
  tree(160,405);tree(421,417);s+='<rect x="289" y="408" width="28" height="61" fill="#8e6d69"/>';
 }else if(t.kind==='forest'){
  for(let i=0;i<5;i++)tree(159+i*69,411-(i%2)*36,['#236852','#347d5e','#28694f'][i%3]);
  tower(251,350,63,124,'#9d795f','#f3bb63');light(282,365,10,25,'#fff0b5');
 }else if(t.kind==='desert'){
  for(let level=0;level<5;level++){const w=270-level*39;s+=block(300-w/2,442-level*34,w,35,level%2?'#e6ac6a':'#f6cc83','#8e542d','#ffe0a4',16)}
  tower(122,383,42,88,'#df9864','#f8c88b');tower(441,363,42,107,'#eeb274','#f8c88b');
  s+='<rect x="286" y="351" width="34" height="74" fill="#654233"/>';
 }else if(t.kind==='snow'){
  tower(188,308,60,165,'#def8ff','#f8ffff');tower(356,314,57,161,'#e4efff','#ffffff');
  tower(274,265,76,213,'#eff9ff','#b5eaff');
  for(let i=0;i<5;i++){let x=139+i*77;s+=block(x,454,19,22,'#1f7290','#15567c','#b3f7ff');s+=block(x-13,422,46,31,'#d0f8ff','#4b96be','#f8ffff')}
 }else if(t.kind==='space'){
  tower(192,333,61,142,'#d2e4f7','#a6faff');tower(354,353,62,121,'#c4dff6','#82f3ff');
  tower(265,242,78,233,'#f1f7ff','#85c8ed');
  for(let i=0;i<4;i++)s+=block(179+i*72,423,62,33,'#6080a4','#324f86','#c4ecf6',10);
  light(297,263,15,128,'#55efff');
 }else if(t.kind==='ocean'){
  tower(241,333,117,141,'#d5f4ed','#8cf7ed');
  tower(195,386,39,90,'#d9faf0','#82e8de');
  tower(386,396,39,82,'#d9faf0','#82e8de');
  for(let i=0;i<7;i++){let x=145+i*51;s+=block(x,446-(i%3)*13,15,21,['#ff85c1','#be70f4','#46dfe6'][i%3],'#605ca0','#e1aeff',7)}
 }else if(t.kind==='halloween'){
  tower(205,285,75,190,'#393456','#a960aa');tower(333,300,63,177,'#3f355b','#8251ba');
  tower(271,230,67,244,'#44375e','#6e43a4');
  s+='<path d="M274 229l31-62 36 62Z" fill="#272040"/>';
  for(let i=0;i<7;i++)light(229+i*25,399-(i%3)*61,9,18,'#ffad49');
 }else if(t.kind==='crystal'){
  for(let i=0;i<14;i++){let x=148+i*22,y=454-(i%4)*17,h=70+((i*47)%130);
   s+='<polygon points="'+x+','+y+' '+(x+15)+','+(y-h)+' '+(x+35)+','+y+'" fill="'+(['#6deaff','#bd70ff','#ed9eff'][i%3])+'" stroke="#f9d9ff" stroke-width="3"/>';
   s+='<polygon points="'+(x+15)+','+(y-h)+' '+(x+35)+','+y+' '+(x+19)+','+(y-10)+'" fill="#392d85" opacity=".65"/>'}
  tower(265,362,56,107,'#3a3974','#a974f1');
 }else if(t.kind==='blossom'){
  tower(246,354,108,120,'#fae7e0','#ed9ba1');tree(179,389,'#f5a0d0',true);tree(389,394,'#ffacd5',true);
  for(let i=0;i<18;i++){const x=155+(i*31)%290,y=340+(i*19)%135;light(x,y,5,6,['#ffe1f2','#fb84b9','#fff7c7'][i%3])}
 }else if(t.kind==='dragon'){
  tower(190,330,55,145,'#5d3b4c','#b85a57');tower(362,340,52,137,'#533448','#a45e69');
  // Blocky fire dragon: square tail, wings, eyes and jaws.
  s+=block(251,319,105,68,'#bb383b','#71243d','#ea6445',18);
  s+=block(325,280,47,46,'#da453a','#84233a','#f46e41',11);
  s+=block(360,296,45,18,'#ce453b','#872b2a','#f87346',9);
  s+='<polygon points="265,325 212,225 305,289" fill="#d64b47"/><polygon points="346,321 393,224 311,285" fill="#9f2d48"/>';
  light(373,286,9,9,'#ffe268');
  for(let i=0;i<8;i++)light(160+i*40,480+i%3*9,28,9,['#ff8b31','#fb5a22','#ffe064'][i%3]);
 }

 // Thirty-five special scene variants add non-castle silhouettes, vehicles,
 // vegetation, machinery, animals and small settlements.
 const draw=(x,y,w,h,a=g0)=>s+=block(x,y,w,h,a,g2,g1,11);
 const roof=(x,y,w=62,col=t.accent)=>s+='<polygon points="'+x+','+y+' '+(x+w/2)+','+(y-37)+' '+(x+w)+','+y+'" fill="'+col+'" stroke="#f5e5c9" stroke-width="4"/>';
 const house=(x,y,a='#f1cea4',cap='#c66b50')=>{draw(x,y,62,72,a);roof(x-8,y,78,cap);light(x+23,y+30,13,19)};
 const bridge=(x,y,w=260)=>{for(let i=0;i<w;i+=36)draw(x+i,y,29,12,'#a97855');draw(x,y-5,w,13,'#bf956e')};
 const wheel=(x,y,r=16)=>s+='<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#212940" stroke="#dec4a7" stroke-width="6"/><circle cx="'+x+'" cy="'+y+'" r="'+(r/3)+'" fill="#f8ce79"/>';
 const plant=(x,y,col='#f7b668')=>{draw(x,y,8,34,'#357850');s+='<rect x="'+(x-8)+'" y="'+(y-12)+'" width="24" height="22" fill="'+col+'"/>'};
 const balloon=(x,y,col='#ffa17f')=>{s+='<ellipse cx="'+x+'" cy="'+y+'" rx="38" ry="47" fill="'+col+'" stroke="#fff3d0" stroke-width="8"/><path d="M'+(x-18)+' '+(y+43)+'l10 25h16l12-25" fill="none" stroke="#7b5d5f" stroke-width="5"/>'+block(x-17,y+65,34,17,'#9d673e','#78543f','#ddb67e',5)};
 const boat=(x,y)=>{draw(x,y,110,20,'#9a674d');s+='<path d="M'+x+' '+(y+20)+'l25 31h65l20-31" fill="#604a4b"/><path d="M'+(x+56)+' '+y+'v-125l52 99z" fill="#fff1d5" stroke="#ba795c" stroke-width="5"/>'};
 const train=(x,y)=>{draw(x,y,158,52,'#a63842');draw(x+95,y-44,57,44,'#e7ba80');wheel(x+32,y+53);wheel(x+95,y+53);wheel(x+141,y+53)};
 const mech=(x,y)=>{draw(x,y,77,55,'#8fa2b4');draw(x+12,y-27,47,27,'#c1e8f1');light(x+18,y+14,14,12,'#67f7ff');light(x+47,y+14,14,12,'#67f7ff')};
 const pathSteps=(x,y)=>{for(let i=0;i<6;i++)draw(x+i*28,y+i*15,28,11,'#d6bc97')};
 const trees=(n,col='#4f9f75')=>{for(let i=0;i<n;i++)tree(134+i*65,405-i%3*12,col)};
 const flowers=(n,col='#ee74bf')=>{for(let i=0;i<n;i++)plant(150+(i*41)%300,422+(i%3)*9,col)};
 const roofHouse=(n)=>{for(let i=0;i<n;i++)house(140+i*92,385-(i%2)*18)};
 if(t.kind==='harbor'){house(150,376);house(368,358);boat(244,454);tower(405,310,34,142,'#eee0b8','#de5747');bridge(117,454,158)}
 else if(t.kind==='farm'){house(249,361);trees(4);for(let i=0;i<7;i++)draw(147+i*45,461,33,8,'#e9c65f');plant(186,418,'#ffd35f')}
 else if(t.kind==='windmill'){house(338,388);tower(214,302,64,174,'#e9e2ca','#bd7860');s+='<path d="M248 295l-92-70m92 70l93-70m-93 70l-89 75m89-75l91 75" stroke="#f2e7bf" stroke-width="16"/>';trees(2)}
 else if(t.kind==='tram'){roofHouse(4);draw(199,440,199,45,'#d04643');for(let i=0;i<5;i++)light(221+i*34,450,20,19,'#ffe68d');s+='<path d="M155 505H453" stroke="#313b47" stroke-width="9"/>'}
 else if(t.kind==='orchard'){trees(5,'#4a995b');for(let i=0;i<16;i++)plant(157+i*18,379+i%4*17,'#f65055');house(255,397)}
 else if(t.kind==='bazaar'){roofHouse(3);for(let i=0;i<4;i++){const x=155+i*73;draw(x,453,57,20,'#f3d392');roof(x-8,453,68,['#c84e62','#edc46f','#4d99ac','#e37456'][i])}}
 else if(t.kind==='library'){draw(205,322,180,148,'#e4c0a3');roof(188,322,214,'#625c9a');for(let i=0;i<5;i++)light(218+i*31,373,20,56,'#ffd68f');draw(175,445,230,15,'#9b6c60')}
 else if(t.kind==='rail'||t.kind==='steamtrain'||t.kind==='station'||t.kind==='snowstation'){house(350,352);bridge(125,469,333);train(162,401);if(t.kind==='snowstation')for(let i=0;i<5;i++)draw(135+i*70,463,58,14,'#f9ffff')}
 else if(t.kind==='moon'||t.kind==='science'||t.kind==='planetarium'){mech(188,390);mech(337,405);tower(278,326,47,145,'#bed4e3','#73e5ec');s+='<circle cx="314" cy="286" r="50" fill="#9ae8f1" opacity=".74"/>'}
 else if(t.kind==='fair'||t.kind==='balloon'){balloon(181,271,'#ffb167');balloon(401,238,'#ec79c6');roofHouse(3);for(let i=0;i<8;i++)plant(142+i*37,429,['#ffd669','#ff7fbb'][i%2])}
 else if(t.kind==='dino'){trees(3);draw(221,376,126,60,'#579474');draw(317,329,30,65,'#579474');draw(341,312,52,32,'#579474');for(let i=0;i<5;i++)draw(212+i*23,370,16,14,'#6daa72');plant(166,424)}
 else if(t.kind==='bees'){trees(3);flowers(10,'#ffd04c');for(let i=0;i<3;i++){let x=173+i*113;draw(x,348,38,39,'#efba57');roof(x-7,348,55,'#f5dc85')}}
 else if(t.kind==='reef'||t.kind==='submarine'){flowers(12,'#ed83cd');for(let i=0;i<7;i++)draw(177+i*45,395+i%3*12,17,73,['#58e4db','#fa7ab2','#ae87ef'][i%3]);if(t.kind==='submarine'){draw(199,340,203,65,'#e7bf54');wheel(251,373,22);wheel(349,373,22)}}
 else if(t.kind==='mine'||t.kind==='forge'){for(let i=0;i<8;i++)draw(150+i*39,404-(i%3)*31,28,90,'#654750');draw(211,383,164,59,'#3b3447');s+='<path d="M256 444l34 70 33-70" fill="#ff753b"/>';bridge(159,380,252)}
 else if(t.kind==='penguin'){for(let i=0;i<6;i++){let x=152+i*62;s+='<ellipse cx="'+x+'" cy="423" rx="19" ry="29" fill="#23334b"/><ellipse cx="'+x+'" cy="430" rx="10" ry="19" fill="#effeff"/>';light(x-3,410,6,5,'#ffc760')} }
 else if(t.kind==='observatory'){draw(198,357,202,116,'#d7d4e7');s+='<path d="M201 362A100 100 0 0 1 401 362Z" fill="#91accd"/><circle cx="301" cy="320" r="34" fill="#88e9f4"/>';light(274,405,43,47)}
 else if(t.kind==='camp'||t.kind==='adventure'){trees(4);s+='<path d="M222 458l60-110 73 110z" fill="#f4b86d" stroke="#9f6b58" stroke-width="10"/>';bridge(155,445,270)}
 else if(t.kind==='canyon'){for(let i=0;i<5;i++)draw(156+i*60,355-i%2*55,45,155,'#c88667');bridge(175,340,234);house(245,411)}
 else if(t.kind==='sakura'||t.kind==='lavender'){trees(4,t.kind==='sakura'?'#eea0c9':'#9f80bf');flowers(14,t.kind==='sakura'?'#f19ac6':'#ca96e5');house(270,379)}
 else if(t.kind==='springs'){for(let i=0;i<6;i++){let x=163+i*49;draw(x,420,36,29,'#c9aca6');s+='<ellipse cx="'+(x+20)+'" cy="428" rx="26" ry="9" fill="#9bf5ff" opacity=".8"/>'}house(270,345)}
 else if(t.kind==='airship'){balloon(309,237,'#e6b778');tower(176,358,39,117,'#a68b75','#db8b60');tower(401,343,39,132,'#a68b75','#db8b60');bridge(180,374,246)}
 else if(t.kind==='robot'){for(let i=0;i<4;i++)mech(165+i*91,355+i%2*36);draw(175,455,270,24,'#667b88');for(let i=0;i<5;i++)wheel(195+i*57,469,10)}
 else if(t.kind==='mushroom'){trees(2);for(let i=0;i<5;i++){let x=154+i*72;draw(x,403,41,71,'#f5d5b8');s+='<ellipse cx="'+(x+18)+'" cy="403" rx="39" ry="21" fill="'+['#da648c','#875ac4','#da955e'][i%3]+'"/>';light(x+12,430)}}
 else if(t.kind==='fishing'){house(155,378);tower(384,317,37,142,'#f1eee2','#e15f45');bridge(144,462,286);boat(246,454)}
 else if(t.kind==='treehouse'){trees(5);draw(209,340,160,50,'#b77a53');roof(206,340,170,'#e7be81');bridge(174,404,278)}
 else if(t.kind==='safari'){trees(3,'#b8b263');draw(222,391,126,55,'#b7a16e');s+='<path d="M217 391l67-77 67 77" fill="#c59f6f"/>';flowers(5,'#edd161')}
 else if(t.kind==='greenhouse'){for(let i=0;i<7;i++)draw(160+i*44,335,9,138,'#c6e9dd');s+='<path d="M143 346Q300 200 458 346v129H143z" fill="#b8fff038" stroke="#d5f7f1" stroke-width="12"/>';trees(2)}
 else if(t.kind==='lighthouse'){tower(271,277,65,199,'#fcf5ec','#d34c48');boat(146,452);trees(2)}
 else if(t.kind==='nightmarket'){for(let i=0;i<5;i++){let x=142+i*77;draw(x,426,63,52,'#685279');roof(x-4,426,71,['#f67a9e','#dbbb6c','#68d0d2'][i%3]);light(x+23,443)}}
 else if(t.kind==='pumpkin'){house(274,372);trees(3,'#d88447');for(let i=0;i<12;i++){let x=156+(i*29)%270;s+='<circle cx="'+x+'" cy="'+(452+i%3*7)+'" r="16" fill="#f58c32" stroke="#d86e2e" stroke-width="4"/>'}}

 // Tiny colored cube flora and magical dust.
 for(let i=0;i<25;i++){
  const x=140+(i*47+t.seed)%325,y=434+(i*31)%43;
  s+=block(x,y,5+i%3*3,8+i%5,g0,g2,t.accent,3);
 }
 s+='<rect width="600" height="680" fill="none" stroke="#ffffff" stroke-opacity=".10" stroke-width="5"/></svg>';
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(s);
}
window.EDUKASS_WORLD_PACKS=Array.from({length:5},(_,i)=>themes.slice(i*10,i*10+10).map(t=>t.id));
window.EDUKASS_WORLD_ART=themes.map((t,i)=>({id:t.id,name:t.name,pack:Math.floor(i/10),src:art(t)}));
window.EDUKASS_VOXEL_ART_VERSION='2.0-50-worlds';
})();
