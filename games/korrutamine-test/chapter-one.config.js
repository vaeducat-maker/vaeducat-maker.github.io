(function(root,factory){
  const config=factory();
  if(typeof module==='object'&&module.exports)module.exports=config;
  else root.EDUKASS_CHAPTER_ONE=config;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  // EDUKASS · главы 1–2: «Üks ja kaks» и «Kolm»
  //
  // Этот файл описывает учебное содержание 33 миссий. Здесь можно увидеть:
  // - название и подпись миссии;
  // - способ ответа (выбор или самостоятельный ввод);
  // - время звездопада;
  // - группы примеров, из которых собираются 15 заданий.
  //
  // Типы групп примеров:
  // fixed          — перечисленные вручную примеры;
  // multiplication — умножение на выбранную таблицу для заданных множителей;
  // division       — деление на выбранный делитель для заданных ответов;
  // adaptive       — повторение трудных фактов одной или нескольких изученных семей.

  const ONE_TO_TEN=[1,2,3,4,5,6,7,8,9,10];
  const ONE_TO_FIVE=[1,2,3,4,5];
  const SIX_TO_TEN=[6,7,8,9,10];

  // Until the unified 1–250 timer curve is approved, the second chapter reuses
  // the tested v28 timing profile by mission function rather than inventing
  // isolated values. These values are explicitly provisional.
  const TIMER_PROFILE={
    choice:175,
    firstHalf:165,
    secondHalf:150,
    fullTable:140,
    reverse:132,
    reorder:125,
    firstMix:118,
    adaptive:112,
    cumulative:106,
    control:100,
    divisionFull:135,
    familyMixed:120
  };

  const LESSON_TRIGGERS=[
    {
      id:'multiply-2',missionId:1,chapterId:1,mode:'multiply',table:2,
      eyebrowKey:'lesson.table2.eyebrowMultiply',titleKey:'lesson.table2.titleMultiply'
    },
    {
      id:'divide-2',missionId:11,chapterId:1,mode:'divide',table:2,
      eyebrowKey:'lesson.table2.eyebrowDivide',titleKey:'lesson.table2.titleDivide'
    },
    {
      id:'multiply-3',missionId:16,chapterId:2,mode:'multiply',table:3,
      eyebrowKey:'lesson.table3.eyebrowMultiply',titleKey:'lesson.table3.titleMultiply'
    },
    {
      id:'divide-3',missionId:26,chapterId:2,mode:'divide',table:3,
      eyebrowKey:'lesson.table3.eyebrowDivide',titleKey:'lesson.table3.titleDivide'
    },
    {
      id:'multiply-4',missionId:34,chapterId:3,mode:'multiply',table:4,
      eyebrowKey:'lesson.table4.eyebrowMultiply',titleKey:'lesson.table4.titleMultiply'
    },
    {
      id:'divide-4',missionId:44,chapterId:3,mode:'divide',table:4,
      eyebrowKey:'lesson.table4.eyebrowDivide',titleKey:'lesson.table4.titleDivide'
    },
    {
      id:'multiply-5',missionId:52,chapterId:4,mode:'multiply',table:5,
      eyebrowKey:'lesson.table5.eyebrowMultiply',titleKey:'lesson.table5.titleMultiply'
    },
    {
      id:'divide-5',missionId:62,chapterId:4,mode:'divide',table:5,
      eyebrowKey:'lesson.table5.eyebrowDivide',titleKey:'lesson.table5.titleDivide'
    },
    {
      id:'multiply-6',missionId:70,chapterId:5,mode:'multiply',table:6,
      eyebrowKey:'lesson.table6.eyebrowMultiply',titleKey:'lesson.table6.titleMultiply'
    },
    {
      id:'divide-6',missionId:80,chapterId:5,mode:'divide',table:6,
      eyebrowKey:'lesson.table6.eyebrowDivide',titleKey:'lesson.table6.titleDivide'
    },
    {
      id:'multiply-7',missionId:88,chapterId:6,mode:'multiply',table:7,
      eyebrowKey:'lesson.table7.eyebrowMultiply',titleKey:'lesson.table7.titleMultiply'
    },
    {
      id:'divide-7',missionId:98,chapterId:6,mode:'divide',table:7,
      eyebrowKey:'lesson.table7.eyebrowDivide',titleKey:'lesson.table7.titleDivide'
    },
    {
      id:'multiply-8',missionId:106,chapterId:7,mode:'multiply',table:8,
      eyebrowKey:'lesson.table8.eyebrowMultiply',titleKey:'lesson.table8.titleMultiply'
    },
    {
      id:'divide-8',missionId:116,chapterId:7,mode:'divide',table:8,
      eyebrowKey:'lesson.table8.eyebrowDivide',titleKey:'lesson.table8.titleDivide'
    }
  ];

  const CHAPTER_EIGHT_MISSIONS=[
    {id:106,title:'Korrutamise valik',short:'Vali ×8',mode:'choice',operation:'multiply',seconds:TIMER_PROFILE.choice,accent:'#f1b53c',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:8,statsTable:8,factors:[2,4,6,8,10],orientation:'forward',copies:1}]},
    {id:107,title:'Alustame kaheksaga',short:'×8 · 1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstHalf,accent:'#e9aa45',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:ONE_TO_FIVE,orientation:'forward',copies:3}]},
    {id:108,title:'Jätkame kaheksaga',short:'×8 · 6–10',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.secondHalf,accent:'#dfa04f',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:SIX_TO_TEN,orientation:'forward',copies:3}]},
    {id:109,title:'Kogu kaheksaga korrutamine',short:'×8 · kõik',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.fullTable,accent:'#d49759',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:8,statsTable:8,factors:SIX_TO_TEN,orientation:'forward',copies:1}]},
    {id:110,title:'Kaheksa teisel kohal',short:'arv × 8',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reverse,accent:'#c88e64',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:ONE_TO_TEN,orientation:'reverse',copies:1},{type:'multiplication',table:8,statsTable:8,factors:SIX_TO_TEN,orientation:'reverse',copies:1}]},
    {id:111,title:'Vahetame järjekorda',short:'×8 ↔ 8×',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reorder,accent:'#ba866f',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'multiplication',table:8,statsTable:8,factors:SIX_TO_TEN,orientation:'mixed',copies:1}]},
    {id:112,title:'Seitse ja kaheksa koos',short:'×7 ja ×8',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstMix,accent:'#aa7e7b',questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:[2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'multiplication',table:8,statsTable:8,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}]},
    {id:113,title:'Kaheksa on selge',short:'Täpsus ×8',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.adaptive,accent:'#987888',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'adaptive',operation:'multiply',table:8,statsTable:8,factors:[5,6,7,8,9],count:5,orientation:'mixed'}]},
    {id:114,title:'Kordame kõike',short:'×1–8',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.cumulative,accent:'#827395',questionGroups:[{type:'multiplication',table:3,statsTable:3,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[6,9],orientation:'mixed',copies:1},{type:'multiplication',table:8,statsTable:8,factors:[1,2,3,4,5,6,7,8,9],orientation:'mixed',copies:1}]},
    {id:115,title:'Korrutamise kontroll',short:'Kontroll ×1–8',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.control,accent:'#6970a1',questionGroups:[{type:'multiplication',table:3,statsTable:3,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[6,9],orientation:'mixed',copies:1},{type:'multiplication',table:8,statsTable:8,factors:[2,3,4,5,6,7,8,9,10],orientation:'mixed',copies:1}]},
    {id:116,title:'Jagamise valik',short:'Vali ÷8',mode:'choice',operation:'divide',seconds:TIMER_PROFILE.choice,accent:'#5170a7',questionGroups:[{type:'division',divisor:8,statsTable:8,factors:ONE_TO_TEN,copies:1},{type:'division',divisor:8,statsTable:8,factors:[2,4,6,8,10],copies:1}]},
    {id:117,title:'Jagame kaheksaga',short:'÷8 · 1–5',mode:'input',operation:'divide',seconds:TIMER_PROFILE.firstHalf,accent:'#3978aa',questionGroups:[{type:'division',divisor:8,statsTable:8,factors:ONE_TO_FIVE,copies:3}]},
    {id:118,title:'Jätkame jagamist',short:'÷8 · 6–10',mode:'input',operation:'divide',seconds:TIMER_PROFILE.secondHalf,accent:'#2d86a9',questionGroups:[{type:'division',divisor:8,statsTable:8,factors:SIX_TO_TEN,copies:3}]},
    {id:119,title:'Kogu kaheksaga jagamine',short:'÷8 · kõik',mode:'input',operation:'divide',seconds:TIMER_PROFILE.divisionFull,accent:'#3195a3',questionGroups:[{type:'division',divisor:8,statsTable:8,factors:ONE_TO_TEN,copies:1},{type:'adaptive',operation:'divide',divisor:8,statsTable:8,factors:ONE_TO_TEN,count:5}]},
    {id:120,title:'Jagame seitsme ja kaheksaga',short:'÷7 ja ÷8',mode:'input',operation:'divide',seconds:TIMER_PROFILE.reorder,accent:'#45a297',questionGroups:[{type:'division',divisor:7,statsTable:7,factors:[2,3,4,5,6,7,8],copies:1},{type:'division',divisor:8,statsTable:8,factors:[1,2,3,4,5,6,7,8],copies:1}]},
    {id:121,title:'Korrutamine ja jagamine kaheksaga',short:'×8 ja ÷8',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.familyMixed,accent:'#62ad86',questionGroups:[{type:'multiplication',table:8,statsTable:8,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'division',divisor:8,statsTable:8,factors:[4,5,6,7,8,9,10],copies:1}]},
    {id:122,title:'Kõik segamini',short:'Kõik 1–8',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.adaptive,accent:'#85b675',questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:8,statsTable:8,factors:[4,7],orientation:'mixed',copies:1},{type:'division',divisor:5,statsTable:5,factors:[8],copies:1},{type:'division',divisor:6,statsTable:6,factors:[9],copies:1},{type:'division',divisor:7,statsTable:7,factors:[8],copies:1},{type:'division',divisor:8,statsTable:8,factors:[3,8],copies:1},{type:'adaptive',count:6,families:[{operation:'multiply',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:8,statsTable:8,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'divide',divisor:6,statsTable:6,factors:ONE_TO_TEN},{operation:'divide',divisor:7,statsTable:7,factors:ONE_TO_TEN},{operation:'divide',divisor:8,statsTable:8,factors:ONE_TO_TEN}]}]},
    {id:123,title:'Peatüki kontroll',short:'Kontroll 1–8',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.control,accent:'#abbf64',questionGroups:[{type:'multiplication',table:3,statsTable:3,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:8,statsTable:8,factors:[4,5,6,7,8,9],orientation:'mixed',copies:1},{type:'division',divisor:5,statsTable:5,factors:[8],copies:1},{type:'division',divisor:6,statsTable:6,factors:[9],copies:1},{type:'division',divisor:7,statsTable:7,factors:[8],copies:1},{type:'division',divisor:8,statsTable:8,factors:[5,10],copies:1}]}
  ].map(mission=>({...mission,chapterId:7,titleKey:`mission.${mission.id}.title`,shortKey:`mission.${mission.id}.short`}));

  return {
    schemaVersion:2,
    id:'uks-ja-kaks',
    title:'Üks ja kaks',
    roundLength:15,
    practiceTable:2,
    practiceFactors:ONE_TO_TEN,
    lesson:{
      initialMode:'multiply',
      divisionMode:'divide',
      initialLessonId:'multiply-2',
      demoFactor:4,
      divisionMissionId:11,
      triggers:LESSON_TRIGGERS
    },
    story:{
      segmentLength:5,
      shipMissionId:5,
      engineMissionId:10,
      finalMissionId:15,
      planetMissionIds:[3,6,9,10,12,15,18,20,23,25,28,30,33],
      chapterTwo:{
        startMissionId:16,
        finalMissionId:33,
        worldSteps:[
          {missionId:16,role:'rocket'},
          {missionId:17,role:'cat'},
          {missionId:18,role:'crystals-one'},
          {missionId:19,role:'water'},
          {missionId:20,role:'mushrooms'},
          {missionId:21,role:'grass'},
          {missionId:22,role:'flowers'},
          {missionId:23,role:'crystals-two'},
          {missionId:24,role:'creature-one'},
          {missionId:25,role:'creature-two'},
          {missionId:26,role:'sky'},
          {missionId:27,role:'far-crystals'},
          {missionId:28,role:'arch'},
          {missionId:29,role:'path'},
          {missionId:30,role:'tower'},
          {missionId:31,role:'tower-light'},
          {missionId:32,role:'final-glow'},
          {missionId:33,role:'departure'}
        ]
      },
      chapterThree:{
        startMissionId:34,
        finalMissionId:51,
        worldSteps:[
          {missionId:34,role:'arrival'},
          {missionId:35,role:'clouds'},
          {missionId:36,role:'home'},
          {missionId:37,role:'home-awake'},
          {missionId:38,role:'sun-ring'},
          {missionId:39,role:'plant-one'},
          {missionId:40,role:'workshop'},
          {missionId:41,role:'gliders'},
          {missionId:42,role:'rock-arch'},
          {missionId:43,role:'energy-device'},
          {missionId:44,role:'energy-flow'},
          {missionId:45,role:'plants-more'},
          {missionId:46,role:'sky-domes'},
          {missionId:47,role:'settlement-path'},
          {missionId:48,role:'resident'},
          {missionId:49,role:'settlement-light'},
          {missionId:50,role:'final-breeze'},
          {missionId:51,role:'departure'}
        ]
      },
      chapterFour:{
        startMissionId:52,
        finalMissionId:69,
        worldSteps:[
          {missionId:52,role:'arrival'},
          {missionId:53,role:'moon'},
          {missionId:54,role:'ground-veins'},
          {missionId:55,role:'lighthouse-home'},
          {missionId:56,role:'home-light'},
          {missionId:57,role:'crystal-garden'},
          {missionId:58,role:'sky-ribbons'},
          {missionId:59,role:'light-rift'},
          {missionId:60,role:'extractor'},
          {missionId:61,role:'storage'},
          {missionId:62,role:'light-road'},
          {missionId:63,role:'night-flowers'},
          {missionId:64,role:'floating-lights'},
          {missionId:65,role:'energy-stream'},
          {missionId:66,role:'lumin'},
          {missionId:67,role:'city-light'},
          {missionId:68,role:'final-glow'},
          {missionId:69,role:'departure'}
        ]
      },
      chapterFive:{
        startMissionId:70,
        finalMissionId:87,
        worldSteps:[
          {missionId:70,role:'arrival'},
          {missionId:71,role:'fjord'},
          {missionId:72,role:'white-cliffs'},
          {missionId:73,role:'northern-forest'},
          {missionId:74,role:'pier'},
          {missionId:75,role:'cliff-home'},
          {missionId:76,role:'home-light'},
          {missionId:77,role:'boat'},
          {missionId:78,role:'fishing-nets'},
          {missionId:79,role:'boardwalk'},
          {missionId:80,role:'moss-berries'},
          {missionId:81,role:'resident'},
          {missionId:82,role:'resident-to-pier'},
          {missionId:83,role:'work-yard'},
          {missionId:84,role:'boat-return'},
          {missionId:85,role:'living-village'},
          {missionId:86,role:'finished-north'},
          {missionId:87,role:'departure'}
        ]
      },
      chapterSix:{
        startMissionId:88,
        finalMissionId:105,
        worldSteps:[
          {missionId:88,role:'arrival'},
          {missionId:89,role:'landing-leaf'},
          {missionId:90,role:'lagoon'},
          {missionId:91,role:'reverse-rain'},
          {missionId:92,role:'blue-trunk'},
          {missionId:93,role:'high-leaf'},
          {missionId:94,role:'root-bridge'},
          {missionId:95,role:'giant-flower'},
          {missionId:96,role:'floating-seeds'},
          {missionId:97,role:'fruit-home'},
          {missionId:98,role:'home-light'},
          {missionId:99,role:'more-homes'},
          {missionId:100,role:'root-paths'},
          {missionId:101,role:'residents'},
          {missionId:102,role:'upper-canopy'},
          {missionId:103,role:'living-rainforest'},
          {missionId:104,role:'finished-world'},
          {missionId:105,role:'departure'}
        ]
      },
      chapterSeven:{
        startMissionId:106,
        finalMissionId:123,
        worldSteps:[
          {missionId:106,role:'arrival'},
          {missionId:107,role:'terraces'},
          {missionId:108,role:'singing-bowls'},
          {missionId:109,role:'glaze-light'},
          {missionId:110,role:'first-home'},
          {missionId:111,role:'more-homes'},
          {missionId:112,role:'home-light'},
          {missionId:113,role:'meeting-circle'},
          {missionId:114,role:'ceramic-lamps'},
          {missionId:115,role:'resident-one'},
          {missionId:116,role:'residents-more'},
          {missionId:117,role:'resonators'},
          {missionId:118,role:'wall-inlays'},
          {missionId:119,role:'vents'},
          {missionId:120,role:'warm-steam'},
          {missionId:121,role:'settlement-mosaic'},
          {missionId:122,role:'sound-waves'},
          {missionId:123,role:'departure'}
        ]
      }
    },
    chapters:[
      {id:1,titleKey:'chapter.1.title',shortKey:'chapter.1.short',startMissionId:1,endMissionId:15,accent:'#70d9cf'},
      {id:2,titleKey:'chapter.2.title',shortKey:'chapter.2.short',startMissionId:16,endMissionId:33,accent:'#8f7de2'},
      {id:3,titleKey:'chapter.3.title',shortKey:'chapter.3.short',startMissionId:34,endMissionId:51,accent:'#ed8f72'},
      {id:4,titleKey:'chapter.4.title',shortKey:'chapter.4.short',startMissionId:52,endMissionId:69,accent:'#f4e75b'},
      {id:5,titleKey:'chapter.5.title',shortKey:'chapter.5.short',startMissionId:70,endMissionId:87,accent:'#bd5d3a'},
      {id:6,titleKey:'chapter.6.title',shortKey:'chapter.6.short',startMissionId:88,endMissionId:105,accent:'#a6df45'},
      {id:7,titleKey:'chapter.7.title',shortKey:'chapter.7.short',startMissionId:106,endMissionId:123,accent:'#f1b53c'}
    ],
    defaultLanguage:'et',
    supportedLanguages:['et'],
    storage:{
      progressKey:'edukass-chapter-one-v18',
      soundKey:'edukass-sound-enabled',
      introKey:'edukass-opening-seen-v28',
      progressSchemaVersion:2
    },
    missions:[
      {
        id:1,
        titleKey:'mission.1.title',
        shortKey:'mission.1.short',
        title:'Korrutamise valik',
        short:'Vali ×',
        mode:'choice',
        operation:'multiply',
        seconds:175,
        accent:'#70d9cf',
        questionGroups:[
          {type:'fixed',questions:[
            {operation:'multiply',a:3,b:1},
            {operation:'multiply',a:1,b:7},
            {operation:'multiply',a:9,b:1}
          ]},
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'forward',copies:1},
          {type:'fixed',questions:[
            {operation:'multiply',a:2,b:6},
            {operation:'multiply',a:2,b:9}
          ]}
        ]
      },
      {
        id:2,
        titleKey:'mission.2.title',
        shortKey:'mission.2.short',
        title:'Alustame kahega',
        short:'×2 · 1–5',
        mode:'input',
        operation:'multiply',
        seconds:165,
        accent:'#70d9cf',
        questionGroups:[
          {type:'multiplication',factors:[1,2,3,4,5],orientation:'forward',copies:3}
        ]
      },
      {
        id:3,
        titleKey:'mission.3.title',
        shortKey:'mission.3.short',
        title:'Jätkame kahega',
        short:'×2 · 6–10',
        mode:'input',
        operation:'multiply',
        seconds:150,
        accent:'#69cde0',
        questionGroups:[
          {type:'multiplication',factors:[6,7,8,9,10],orientation:'forward',copies:3}
        ]
      },
      {
        id:4,
        titleKey:'mission.4.title',
        shortKey:'mission.4.short',
        title:'Kogu kahega korrutamine',
        short:'×2 · kõik',
        mode:'input',
        operation:'multiply',
        seconds:140,
        accent:'#63bfe4',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'forward',copies:1},
          {type:'multiplication',factors:[6,7,8,9,10],orientation:'forward',copies:1}
        ]
      },
      {
        id:5,
        titleKey:'mission.5.title',
        shortKey:'mission.5.short',
        title:'Kaks teisel kohal',
        short:'arv × 2',
        mode:'input',
        operation:'multiply',
        seconds:132,
        accent:'#6baee5',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'reverse',copies:1},
          {type:'multiplication',factors:[6,7,8,9,10],orientation:'reverse',copies:1}
        ]
      },
      {
        id:6,
        titleKey:'mission.6.title',
        shortKey:'mission.6.short',
        title:'Vahetame järjekorda',
        short:'×2 ↔ 2×',
        mode:'input',
        operation:'multiply',
        seconds:125,
        accent:'#779ce2',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'multiplication',factors:[6,7,8,9,10],orientation:'mixed',copies:1}
        ]
      },
      {
        id:7,
        titleKey:'mission.7.title',
        shortKey:'mission.7.short',
        title:'Kaks on selge',
        short:'Täpsus',
        mode:'input',
        operation:'multiply',
        seconds:118,
        accent:'#858bdd',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'adaptive',operation:'multiply',count:5,orientation:'mixed'}
        ]
      },
      {
        id:8,
        titleKey:'mission.8.title',
        shortKey:'mission.8.short',
        title:'Kordame keerulisi',
        short:'Kordus',
        mode:'input',
        operation:'multiply',
        seconds:112,
        accent:'#927bd5',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'adaptive',operation:'multiply',count:5,orientation:'mixed'}
        ]
      },
      {
        id:9,
        titleKey:'mission.9.title',
        shortKey:'mission.9.short',
        title:'Valmistume kontrolliks',
        short:'Segamini',
        mode:'input',
        operation:'multiply',
        seconds:106,
        accent:'#9d70cd',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'multiplication',factors:[5,6,7,8,9],orientation:'mixed',copies:1}
        ]
      },
      {
        id:10,
        titleKey:'mission.10.title',
        shortKey:'mission.10.short',
        title:'Korrutamise kontroll',
        short:'Kontroll ×',
        mode:'input',
        operation:'multiply',
        seconds:100,
        accent:'#a966c2',
        questionGroups:[
          {type:'multiplication',factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'fixed',questions:[
            {operation:'multiply',a:2,b:6},
            {operation:'multiply',a:7,b:2},
            {operation:'multiply',a:2,b:8},
            {operation:'multiply',a:9,b:2},
            {operation:'multiply',a:2,b:10}
          ]}
        ]
      },
      {
        id:11,
        titleKey:'mission.11.title',
        shortKey:'mission.11.short',
        title:'Jagamise valik',
        short:'Vali ÷',
        mode:'choice',
        operation:'divide',
        seconds:175,
        accent:'#e561a0',
        questionGroups:[
          {type:'fixed',questions:[
            {operation:'divide',factor:3,divisor:1},
            {operation:'divide',factor:8,divisor:1}
          ]},
          {type:'division',factors:ONE_TO_TEN,copies:1},
          {type:'fixed',questions:[
            {operation:'divide',factor:6,divisor:2},
            {operation:'divide',factor:9,divisor:2},
            {operation:'divide',factor:10,divisor:2}
          ]}
        ]
      },
      {
        id:12,
        titleKey:'mission.12.title',
        shortKey:'mission.12.short',
        title:'Jagame kahega',
        short:'÷2 · 1–5',
        mode:'input',
        operation:'divide',
        seconds:165,
        accent:'#e86f91',
        questionGroups:[
          {type:'division',factors:[1,2,3,4,5],copies:3}
        ]
      },
      {
        id:13,
        titleKey:'mission.13.title',
        shortKey:'mission.13.short',
        title:'Jätkame jagamist',
        short:'÷2 · 6–10',
        mode:'input',
        operation:'divide',
        seconds:150,
        accent:'#ed7d80',
        questionGroups:[
          {type:'division',factors:[6,7,8,9,10],copies:3}
        ]
      },
      {
        id:14,
        titleKey:'mission.14.title',
        shortKey:'mission.14.short',
        title:'Kogu kahega jagamine',
        short:'÷2 · kõik',
        mode:'input',
        operation:'divide',
        seconds:135,
        accent:'#ef8d6e',
        questionGroups:[
          {type:'division',factors:ONE_TO_TEN,copies:1},
          {type:'adaptive',operation:'divide',count:5}
        ]
      },
      {
        id:15,
        titleKey:'mission.15.title',
        shortKey:'mission.15.short',
        title:'Korrutamine ja jagamine',
        short:'× ja ÷',
        mode:'input',
        operation:'mixed',
        seconds:120,
        accent:'#f39b60',
        questionGroups:[
          {type:'fixed',questions:[
            {operation:'multiply',a:2,b:4},
            {operation:'multiply',a:5,b:2},
            {operation:'multiply',a:2,b:6},
            {operation:'multiply',a:7,b:2},
            {operation:'multiply',a:2,b:8},
            {operation:'multiply',a:9,b:2},
            {operation:'multiply',a:2,b:10},
            {operation:'divide',factor:3,divisor:2},
            {operation:'divide',factor:4,divisor:2},
            {operation:'divide',factor:5,divisor:2},
            {operation:'divide',factor:6,divisor:2},
            {operation:'divide',factor:7,divisor:2},
            {operation:'divide',factor:8,divisor:2},
            {operation:'divide',factor:9,divisor:2},
            {operation:'divide',factor:10,divisor:2}
          ]}
        ]
      }
      ,
      {
        id:16,
        chapterId:2,
        titleKey:'mission.16.title',
        shortKey:'mission.16.short',
        title:'Korrutamise valik',
        short:'Vali ×3',
        mode:'choice',
        operation:'multiply',
        seconds:TIMER_PROFILE.choice,
        accent:'#8f7de2',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'forward',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[2,4,6,8,10],orientation:'forward',copies:1}
        ]
      },
      {
        id:17,
        chapterId:2,
        titleKey:'mission.17.title',
        shortKey:'mission.17.short',
        title:'Alustame kolmega',
        short:'×3 · 1–5',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.firstHalf,
        accent:'#857fdc',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:ONE_TO_FIVE,orientation:'forward',copies:3}
        ]
      },
      {
        id:18,
        chapterId:2,
        titleKey:'mission.18.title',
        shortKey:'mission.18.short',
        title:'Jätkame kolmega',
        short:'×3 · 6–10',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.secondHalf,
        accent:'#7b82d7',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:SIX_TO_TEN,orientation:'forward',copies:3}
        ]
      },
      {
        id:19,
        chapterId:2,
        titleKey:'mission.19.title',
        shortKey:'mission.19.short',
        title:'Kogu kolmega korrutamine',
        short:'×3 · kõik',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.fullTable,
        accent:'#7186d2',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'forward',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:SIX_TO_TEN,orientation:'forward',copies:1}
        ]
      },
      {
        id:20,
        chapterId:2,
        titleKey:'mission.20.title',
        shortKey:'mission.20.short',
        title:'Kolm teisel kohal',
        short:'arv × 3',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.reverse,
        accent:'#688bcd',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'reverse',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:SIX_TO_TEN,orientation:'reverse',copies:1}
        ]
      },
      {
        id:21,
        chapterId:2,
        titleKey:'mission.21.title',
        shortKey:'mission.21.short',
        title:'Vahetame järjekorda',
        short:'×3 ↔ 3×',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.reorder,
        accent:'#6191c8',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:SIX_TO_TEN,orientation:'mixed',copies:1}
        ]
      },
      {
        id:22,
        chapterId:2,
        titleKey:'mission.22.title',
        shortKey:'mission.22.short',
        title:'Kaks ja kolm koos',
        short:'×2 ja ×3',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.firstMix,
        accent:'#5c98c2',
        questionGroups:[
          {type:'multiplication',table:2,factors:[2,3,4,5,6,7,8],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}
        ]
      },
      {
        id:23,
        chapterId:2,
        titleKey:'mission.23.title',
        shortKey:'mission.23.short',
        title:'Kolm on selge',
        short:'Täpsus ×3',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.adaptive,
        accent:'#58a0bc',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'adaptive',operation:'multiply',table:3,statsTable:3,factors:ONE_TO_TEN,count:5,orientation:'mixed'}
        ]
      },
      {
        id:24,
        chapterId:2,
        titleKey:'mission.24.title',
        shortKey:'mission.24.short',
        title:'Kordame kõike',
        short:'×1–3',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.cumulative,
        accent:'#55a8b5',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[3,7,9],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[4,6,8,10],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}
        ]
      },
      {
        id:25,
        chapterId:2,
        titleKey:'mission.25.title',
        shortKey:'mission.25.short',
        title:'Korrutamise kontroll',
        short:'Kontroll ×1–3',
        mode:'input',
        operation:'multiply',
        seconds:TIMER_PROFILE.control,
        accent:'#55afae',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[6,9],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[3,5,6,8,10],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[2,3,4,5,6,7,8,9],orientation:'mixed',copies:1}
        ]
      },
      {
        id:26,
        chapterId:2,
        titleKey:'mission.26.title',
        shortKey:'mission.26.short',
        title:'Jagamise valik',
        short:'Vali ÷3',
        mode:'choice',
        operation:'divide',
        seconds:TIMER_PROFILE.choice,
        accent:'#c96aa5',
        questionGroups:[
          {type:'division',divisor:3,statsTable:3,factors:ONE_TO_TEN,copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[2,4,6,8,10],copies:1}
        ]
      },
      {
        id:27,
        chapterId:2,
        titleKey:'mission.27.title',
        shortKey:'mission.27.short',
        title:'Jagame kolmega',
        short:'÷3 · 1–5',
        mode:'input',
        operation:'divide',
        seconds:TIMER_PROFILE.firstHalf,
        accent:'#d16e9b',
        questionGroups:[
          {type:'division',divisor:3,statsTable:3,factors:ONE_TO_FIVE,copies:3}
        ]
      },
      {
        id:28,
        chapterId:2,
        titleKey:'mission.28.title',
        shortKey:'mission.28.short',
        title:'Jätkame jagamist',
        short:'÷3 · 6–10',
        mode:'input',
        operation:'divide',
        seconds:TIMER_PROFILE.secondHalf,
        accent:'#d87391',
        questionGroups:[
          {type:'division',divisor:3,statsTable:3,factors:SIX_TO_TEN,copies:3}
        ]
      },
      {
        id:29,
        chapterId:2,
        titleKey:'mission.29.title',
        shortKey:'mission.29.short',
        title:'Kogu kolmega jagamine',
        short:'÷3 · kõik',
        mode:'input',
        operation:'divide',
        seconds:TIMER_PROFILE.divisionFull,
        accent:'#df7986',
        questionGroups:[
          {type:'division',divisor:3,statsTable:3,factors:ONE_TO_TEN,copies:1},
          {type:'adaptive',operation:'divide',divisor:3,statsTable:3,factors:ONE_TO_TEN,count:5}
        ]
      },
      {
        id:30,
        chapterId:2,
        titleKey:'mission.30.title',
        shortKey:'mission.30.short',
        title:'Jagame kahe ja kolmega',
        short:'÷2 ja ÷3',
        mode:'input',
        operation:'divide',
        seconds:TIMER_PROFILE.reorder,
        accent:'#e27f7d',
        questionGroups:[
          {type:'division',divisor:2,factors:[2,3,4,5,6,7,8],copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[1,2,3,4,5,6,7,8],copies:1}
        ]
      },
      {
        id:31,
        chapterId:2,
        titleKey:'mission.31.title',
        shortKey:'mission.31.short',
        title:'Korrutamine ja jagamine kolmega',
        short:'×3 ja ÷3',
        mode:'input',
        operation:'mixed',
        seconds:TIMER_PROFILE.familyMixed,
        accent:'#e68774',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[4,5,6,7,8,9,10],copies:1}
        ]
      },
      {
        id:32,
        chapterId:2,
        titleKey:'mission.32.title',
        shortKey:'mission.32.short',
        title:'Kõik segamini',
        short:'Kõik 1–3',
        mode:'input',
        operation:'mixed',
        seconds:TIMER_PROFILE.adaptive,
        accent:'#eb906a',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[7,9],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[4,7],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[6,8],orientation:'mixed',copies:1},
          {type:'division',divisor:2,factors:[6,9],copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[7,10],copies:1},
          {type:'adaptive',count:5,families:[
            {operation:'multiply',table:2,factors:ONE_TO_TEN,orientation:'mixed'},
            {operation:'multiply',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'mixed'},
            {operation:'divide',divisor:2,factors:ONE_TO_TEN},
            {operation:'divide',divisor:3,statsTable:3,factors:ONE_TO_TEN}
          ]}
        ]
      },
      {
        id:33,
        chapterId:2,
        titleKey:'mission.33.title',
        shortKey:'mission.33.short',
        title:'Peatüki kontroll',
        short:'Kontroll 1–3',
        mode:'input',
        operation:'mixed',
        seconds:TIMER_PROFILE.control,
        accent:'#f09a60',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[7,10],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[4,7,9],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[4,6,8],orientation:'mixed',copies:1},
          {type:'division',divisor:2,factors:[5,8,10],copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[4,7,9,10],copies:1}
        ]
      },
      {
        id:34,chapterId:3,titleKey:'mission.34.title',shortKey:'mission.34.short',
        title:'Korrutamise valik',short:'Vali ×4',mode:'choice',operation:'multiply',seconds:TIMER_PROFILE.choice,accent:'#ed8f72',
        questionGroups:[
          {type:'multiplication',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'forward',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:[2,4,6,8,10],orientation:'forward',copies:1}
        ]
      },
      {
        id:35,chapterId:3,titleKey:'mission.35.title',shortKey:'mission.35.short',
        title:'Alustame neljaga',short:'×4 · 1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstHalf,accent:'#e99373',
        questionGroups:[{type:'multiplication',table:4,statsTable:4,factors:ONE_TO_FIVE,orientation:'forward',copies:3}]
      },
      {
        id:36,chapterId:3,titleKey:'mission.36.title',shortKey:'mission.36.short',
        title:'Jätkame neljaga',short:'×4 · 6–10',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.secondHalf,accent:'#e69773',
        questionGroups:[{type:'multiplication',table:4,statsTable:4,factors:SIX_TO_TEN,orientation:'forward',copies:3}]
      },
      {
        id:37,chapterId:3,titleKey:'mission.37.title',shortKey:'mission.37.short',
        title:'Kogu neljaga korrutamine',short:'×4 · kõik',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.fullTable,accent:'#df9b75',
        questionGroups:[
          {type:'multiplication',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'forward',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:SIX_TO_TEN,orientation:'forward',copies:1}
        ]
      },
      {
        id:38,chapterId:3,titleKey:'mission.38.title',shortKey:'mission.38.short',
        title:'Neli teisel kohal',short:'arv × 4',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reverse,accent:'#d99e78',
        questionGroups:[
          {type:'multiplication',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'reverse',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:SIX_TO_TEN,orientation:'reverse',copies:1}
        ]
      },
      {
        id:39,chapterId:3,titleKey:'mission.39.title',shortKey:'mission.39.short',
        title:'Vahetame järjekorda',short:'×4 ↔ 4×',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reorder,accent:'#d1a17d',
        questionGroups:[
          {type:'multiplication',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:SIX_TO_TEN,orientation:'mixed',copies:1}
        ]
      },
      {
        id:40,chapterId:3,titleKey:'mission.40.title',shortKey:'mission.40.short',
        title:'Kolm ja neli koos',short:'×3 ja ×4',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstMix,accent:'#c9a482',
        questionGroups:[
          {type:'multiplication',table:3,statsTable:3,factors:[2,3,4,5,6,7,8],orientation:'mixed',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}
        ]
      },
      {
        id:41,chapterId:3,titleKey:'mission.41.title',shortKey:'mission.41.short',
        title:'Neli on selge',short:'Täpsus ×4',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.adaptive,accent:'#bfa786',
        questionGroups:[
          {type:'multiplication',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'mixed',copies:1},
          {type:'adaptive',operation:'multiply',table:4,statsTable:4,factors:[5,6,7,8,9],count:5,orientation:'mixed'}
        ]
      },
      {
        id:42,chapterId:3,titleKey:'mission.42.title',shortKey:'mission.42.short',
        title:'Kordame kõike',short:'×1–4',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.cumulative,accent:'#b4aa8b',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[7,9],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[4,7],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[5,8],orientation:'mixed',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:[1,2,3,4,5,6,7,8,9],orientation:'mixed',copies:1}
        ]
      },
      {
        id:43,chapterId:3,titleKey:'mission.43.title',shortKey:'mission.43.short',
        title:'Korrutamise kontroll',short:'Kontroll ×1–4',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.control,accent:'#a9ac90',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[7],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[6,9],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[4,7,9],orientation:'mixed',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:[2,3,4,5,6,7,8,9,10],orientation:'mixed',copies:1}
        ]
      },
      {
        id:44,chapterId:3,titleKey:'mission.44.title',shortKey:'mission.44.short',
        title:'Jagamise valik',short:'Vali ÷4',mode:'choice',operation:'divide',seconds:TIMER_PROFILE.choice,accent:'#b5839d',
        questionGroups:[
          {type:'division',divisor:4,statsTable:4,factors:ONE_TO_TEN,copies:1},
          {type:'division',divisor:4,statsTable:4,factors:[2,4,6,8,10],copies:1}
        ]
      },
      {
        id:45,chapterId:3,titleKey:'mission.45.title',shortKey:'mission.45.short',
        title:'Jagame neljaga',short:'÷4 · 1–5',mode:'input',operation:'divide',seconds:TIMER_PROFILE.firstHalf,accent:'#bf8097',
        questionGroups:[{type:'division',divisor:4,statsTable:4,factors:ONE_TO_FIVE,copies:3}]
      },
      {
        id:46,chapterId:3,titleKey:'mission.46.title',shortKey:'mission.46.short',
        title:'Jätkame jagamist',short:'÷4 · 6–10',mode:'input',operation:'divide',seconds:TIMER_PROFILE.secondHalf,accent:'#ca7e91',
        questionGroups:[{type:'division',divisor:4,statsTable:4,factors:SIX_TO_TEN,copies:3}]
      },
      {
        id:47,chapterId:3,titleKey:'mission.47.title',shortKey:'mission.47.short',
        title:'Kogu neljaga jagamine',short:'÷4 · kõik',mode:'input',operation:'divide',seconds:TIMER_PROFILE.divisionFull,accent:'#d47e88',
        questionGroups:[
          {type:'division',divisor:4,statsTable:4,factors:ONE_TO_TEN,copies:1},
          {type:'adaptive',operation:'divide',divisor:4,statsTable:4,factors:ONE_TO_TEN,count:5}
        ]
      },
      {
        id:48,chapterId:3,titleKey:'mission.48.title',shortKey:'mission.48.short',
        title:'Jagame kolme ja neljaga',short:'÷3 ja ÷4',mode:'input',operation:'divide',seconds:TIMER_PROFILE.reorder,accent:'#dd8080',
        questionGroups:[
          {type:'division',divisor:3,statsTable:3,factors:[2,3,4,5,6,7,8],copies:1},
          {type:'division',divisor:4,statsTable:4,factors:[1,2,3,4,5,6,7,8],copies:1}
        ]
      },
      {
        id:49,chapterId:3,titleKey:'mission.49.title',shortKey:'mission.49.short',
        title:'Korrutamine ja jagamine neljaga',short:'×4 ja ÷4',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.familyMixed,accent:'#e48377',
        questionGroups:[
          {type:'multiplication',table:4,statsTable:4,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1},
          {type:'division',divisor:4,statsTable:4,factors:[4,5,6,7,8,9,10],copies:1}
        ]
      },
      {
        id:50,chapterId:3,titleKey:'mission.50.title',shortKey:'mission.50.short',
        title:'Kõik segamini',short:'Kõik 1–4',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.adaptive,accent:'#e98770',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[8],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[6,9],orientation:'mixed',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:[5,7],orientation:'mixed',copies:1},
          {type:'division',divisor:2,factors:[8],copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[7],copies:1},
          {type:'division',divisor:4,statsTable:4,factors:[6,9],copies:1},
          {type:'adaptive',count:6,families:[
            {operation:'multiply',table:2,factors:ONE_TO_TEN,orientation:'mixed'},
            {operation:'multiply',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'mixed'},
            {operation:'multiply',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'mixed'},
            {operation:'divide',divisor:2,factors:ONE_TO_TEN},
            {operation:'divide',divisor:3,statsTable:3,factors:ONE_TO_TEN},
            {operation:'divide',divisor:4,statsTable:4,factors:ONE_TO_TEN}
          ]}
        ]
      },
      {
        id:51,chapterId:3,titleKey:'mission.51.title',shortKey:'mission.51.short',
        title:'Peatüki kontroll',short:'Kontroll 1–4',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.control,accent:'#ee8c69',
        questionGroups:[
          {type:'multiplication',table:1,statsTable:1,factors:[9],orientation:'forward',copies:1},
          {type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},
          {type:'multiplication',table:3,statsTable:3,factors:[6,8],orientation:'mixed',copies:1},
          {type:'multiplication',table:4,statsTable:4,factors:[4,6,7,8,9],orientation:'mixed',copies:1},
          {type:'division',divisor:2,factors:[9],copies:1},
          {type:'division',divisor:3,statsTable:3,factors:[7,10],copies:1},
          {type:'division',divisor:4,statsTable:4,factors:[5,7,9],copies:1}
        ]
      },
      {
        id:52,chapterId:4,titleKey:'mission.52.title',shortKey:'mission.52.short',title:'Korrutamise valik',short:'Vali ×5',mode:'choice',operation:'multiply',seconds:TIMER_PROFILE.choice,accent:'#f4e75b',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[2,4,6,8,10],orientation:'forward',copies:1}]
      },
      {
        id:53,chapterId:4,titleKey:'mission.53.title',shortKey:'mission.53.short',title:'Alustame viiega',short:'×5 · 1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstHalf,accent:'#eadf63',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:ONE_TO_FIVE,orientation:'forward',copies:3}]
      },
      {
        id:54,chapterId:4,titleKey:'mission.54.title',shortKey:'mission.54.short',title:'Jätkame viiega',short:'×5 · 6–10',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.secondHalf,accent:'#dfd66d',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:SIX_TO_TEN,orientation:'forward',copies:3}]
      },
      {
        id:55,chapterId:4,titleKey:'mission.55.title',shortKey:'mission.55.short',title:'Kogu viiega korrutamine',short:'×5 · kõik',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.fullTable,accent:'#d2cc78',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:5,statsTable:5,factors:SIX_TO_TEN,orientation:'forward',copies:1}]
      },
      {
        id:56,chapterId:4,titleKey:'mission.56.title',shortKey:'mission.56.short',title:'Viis teisel kohal',short:'arv × 5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reverse,accent:'#c4c183',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'reverse',copies:1},{type:'multiplication',table:5,statsTable:5,factors:SIX_TO_TEN,orientation:'reverse',copies:1}]
      },
      {
        id:57,chapterId:4,titleKey:'mission.57.title',shortKey:'mission.57.short',title:'Vahetame järjekorda',short:'×5 ↔ 5×',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reorder,accent:'#b7b68e',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:SIX_TO_TEN,orientation:'mixed',copies:1}]
      },
      {
        id:58,chapterId:4,titleKey:'mission.58.title',shortKey:'mission.58.short',title:'Neli ja viis koos',short:'×4 ja ×5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstMix,accent:'#aaa999',
        questionGroups:[{type:'multiplication',table:4,statsTable:4,factors:[2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}]
      },
      {
        id:59,chapterId:4,titleKey:'mission.59.title',shortKey:'mission.59.short',title:'Viis on selge',short:'Täpsus ×5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.adaptive,accent:'#9e9da4',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'adaptive',operation:'multiply',table:5,statsTable:5,factors:[5,6,7,8,9],count:5,orientation:'mixed'}]
      },
      {
        id:60,chapterId:4,titleKey:'mission.60.title',shortKey:'mission.60.short',title:'Kordame kõike',short:'×1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.cumulative,accent:'#9291af',
        questionGroups:[{type:'multiplication',table:1,statsTable:1,factors:[7],orientation:'forward',copies:1},{type:'multiplication',table:2,factors:[6,9],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[5,8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[4,7],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}]
      },
      {
        id:61,chapterId:4,titleKey:'mission.61.title',shortKey:'mission.61.short',title:'Korrutamise kontroll',short:'Kontroll ×1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.control,accent:'#8784bb',
        questionGroups:[{type:'multiplication',table:1,statsTable:1,factors:[9],orientation:'forward',copies:1},{type:'multiplication',table:2,factors:[7,10],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[6,8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[5,9],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[2,3,4,6,7,8,9,10],orientation:'mixed',copies:1}]
      },
      {
        id:62,chapterId:4,titleKey:'mission.62.title',shortKey:'mission.62.short',title:'Jagamise valik',short:'Vali ÷5',mode:'choice',operation:'divide',seconds:TIMER_PROFILE.choice,accent:'#9675c5',
        questionGroups:[{type:'division',divisor:5,statsTable:5,factors:ONE_TO_TEN,copies:1},{type:'division',divisor:5,statsTable:5,factors:[2,4,6,8,10],copies:1}]
      },
      {
        id:63,chapterId:4,titleKey:'mission.63.title',shortKey:'mission.63.short',title:'Jagame viiega',short:'÷5 · 1–5',mode:'input',operation:'divide',seconds:TIMER_PROFILE.firstHalf,accent:'#a96bc1',
        questionGroups:[{type:'division',divisor:5,statsTable:5,factors:ONE_TO_FIVE,copies:3}]
      },
      {
        id:64,chapterId:4,titleKey:'mission.64.title',shortKey:'mission.64.short',title:'Jätkame jagamist',short:'÷5 · 6–10',mode:'input',operation:'divide',seconds:TIMER_PROFILE.secondHalf,accent:'#bd62ba',
        questionGroups:[{type:'division',divisor:5,statsTable:5,factors:SIX_TO_TEN,copies:3}]
      },
      {
        id:65,chapterId:4,titleKey:'mission.65.title',shortKey:'mission.65.short',title:'Kogu viiega jagamine',short:'÷5 · kõik',mode:'input',operation:'divide',seconds:TIMER_PROFILE.divisionFull,accent:'#d057b0',
        questionGroups:[{type:'division',divisor:5,statsTable:5,factors:ONE_TO_TEN,copies:1},{type:'adaptive',operation:'divide',divisor:5,statsTable:5,factors:ONE_TO_TEN,count:5}]
      },
      {
        id:66,chapterId:4,titleKey:'mission.66.title',shortKey:'mission.66.short',title:'Jagame nelja ja viiega',short:'÷4 ja ÷5',mode:'input',operation:'divide',seconds:TIMER_PROFILE.reorder,accent:'#df55a2',
        questionGroups:[{type:'division',divisor:4,statsTable:4,factors:[2,3,4,5,6,7,8],copies:1},{type:'division',divisor:5,statsTable:5,factors:[1,2,3,4,5,6,7,8],copies:1}]
      },
      {
        id:67,chapterId:4,titleKey:'mission.67.title',shortKey:'mission.67.short',title:'Korrutamine ja jagamine viiega',short:'×5 ja ÷5',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.familyMixed,accent:'#e75b93',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'division',divisor:5,statsTable:5,factors:[4,5,6,7,8,9,10],copies:1}]
      },
      {
        id:68,chapterId:4,titleKey:'mission.68.title',shortKey:'mission.68.short',title:'Kõik segamini',short:'Kõik 1–5',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.adaptive,accent:'#ed6884',
        questionGroups:[{type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[5,8],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[4,7],orientation:'mixed',copies:1},{type:'division',divisor:2,factors:[9],copies:1},{type:'division',divisor:3,statsTable:3,factors:[8],copies:1},{type:'division',divisor:4,statsTable:4,factors:[6],copies:1},{type:'division',divisor:5,statsTable:5,factors:[3,9],copies:1},{type:'adaptive',count:6,families:[{operation:'multiply',table:3,statsTable:3,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'divide',divisor:3,statsTable:3,factors:ONE_TO_TEN},{operation:'divide',divisor:4,statsTable:4,factors:ONE_TO_TEN},{operation:'divide',divisor:5,statsTable:5,factors:ONE_TO_TEN}]}]
      },
      {
        id:69,chapterId:4,titleKey:'mission.69.title',shortKey:'mission.69.short',title:'Peatüki kontroll',short:'Kontroll 1–5',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.control,accent:'#f17a76',
        questionGroups:[{type:'multiplication',table:1,statsTable:1,factors:[10],orientation:'forward',copies:1},{type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[6,8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[5,9],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[4,6,7,8,9],orientation:'mixed',copies:1},{type:'division',divisor:2,factors:[9],copies:1},{type:'division',divisor:3,statsTable:3,factors:[7],copies:1},{type:'division',divisor:4,statsTable:4,factors:[8],copies:1},{type:'division',divisor:5,statsTable:5,factors:[6,10],copies:1}]
      },
      {
        id:70,chapterId:5,titleKey:'mission.70.title',shortKey:'mission.70.short',title:'Korrutamise valik',short:'Vali ×6',mode:'choice',operation:'multiply',seconds:TIMER_PROFILE.choice,accent:'#bd5d3a',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[2,4,6,8,10],orientation:'forward',copies:1}]
      },
      {
        id:71,chapterId:5,titleKey:'mission.71.title',shortKey:'mission.71.short',title:'Alustame kuuega',short:'×6 · 1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstHalf,accent:'#b9653d',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:ONE_TO_FIVE,orientation:'forward',copies:3}]
      },
      {
        id:72,chapterId:5,titleKey:'mission.72.title',shortKey:'mission.72.short',title:'Jätkame kuuega',short:'×6 · 6–10',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.secondHalf,accent:'#b06e42',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:SIX_TO_TEN,orientation:'forward',copies:3}]
      },
      {
        id:73,chapterId:5,titleKey:'mission.73.title',shortKey:'mission.73.short',title:'Kogu kuuega korrutamine',short:'×6 · kõik',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.fullTable,accent:'#a77647',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:6,statsTable:6,factors:SIX_TO_TEN,orientation:'forward',copies:1}]
      },
      {
        id:74,chapterId:5,titleKey:'mission.74.title',shortKey:'mission.74.short',title:'Kuus teisel kohal',short:'arv × 6',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reverse,accent:'#9e7e4c',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'reverse',copies:1},{type:'multiplication',table:6,statsTable:6,factors:SIX_TO_TEN,orientation:'reverse',copies:1}]
      },
      {
        id:75,chapterId:5,titleKey:'mission.75.title',shortKey:'mission.75.short',title:'Vahetame järjekorda',short:'×6 ↔ 6×',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reorder,accent:'#958650',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:SIX_TO_TEN,orientation:'mixed',copies:1}]
      },
      {
        id:76,chapterId:5,titleKey:'mission.76.title',shortKey:'mission.76.short',title:'Viis ja kuus koos',short:'×5 ja ×6',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstMix,accent:'#8b8e55',
        questionGroups:[{type:'multiplication',table:5,statsTable:5,factors:[2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}]
      },
      {
        id:77,chapterId:5,titleKey:'mission.77.title',shortKey:'mission.77.short',title:'Kuus on selge',short:'Täpsus ×6',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.adaptive,accent:'#81955b',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'adaptive',operation:'multiply',table:6,statsTable:6,factors:[5,6,7,8,9],count:5,orientation:'mixed'}]
      },
      {
        id:78,chapterId:5,titleKey:'mission.78.title',shortKey:'mission.78.short',title:'Kordame kõike',short:'×1–6',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.cumulative,accent:'#779d61',
        questionGroups:[{type:'multiplication',table:1,statsTable:1,factors:[8],orientation:'forward',copies:1},{type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[5],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[4,9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[1,2,3,4,5,6,7,8,9],orientation:'mixed',copies:1}]
      },
      {
        id:79,chapterId:5,titleKey:'mission.79.title',shortKey:'mission.79.short',title:'Korrutamise kontroll',short:'Kontroll ×1–6',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.control,accent:'#6da468',
        questionGroups:[{type:'multiplication',table:1,statsTable:1,factors:[9],orientation:'forward',copies:1},{type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[4,9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[2,3,4,5,6,7,8,9,10],orientation:'mixed',copies:1}]
      },
      {
        id:80,chapterId:5,titleKey:'mission.80.title',shortKey:'mission.80.short',title:'Jagamise valik',short:'Vali ÷6',mode:'choice',operation:'divide',seconds:TIMER_PROFILE.choice,accent:'#829867',
        questionGroups:[{type:'division',divisor:6,statsTable:6,factors:ONE_TO_TEN,copies:1},{type:'division',divisor:6,statsTable:6,factors:[2,4,6,8,10],copies:1}]
      },
      {
        id:81,chapterId:5,titleKey:'mission.81.title',shortKey:'mission.81.short',title:'Jagame kuuega',short:'÷6 · 1–5',mode:'input',operation:'divide',seconds:TIMER_PROFILE.firstHalf,accent:'#988b62',
        questionGroups:[{type:'division',divisor:6,statsTable:6,factors:ONE_TO_FIVE,copies:3}]
      },
      {
        id:82,chapterId:5,titleKey:'mission.82.title',shortKey:'mission.82.short',title:'Jätkame jagamist',short:'÷6 · 6–10',mode:'input',operation:'divide',seconds:TIMER_PROFILE.secondHalf,accent:'#aa7e5c',
        questionGroups:[{type:'division',divisor:6,statsTable:6,factors:SIX_TO_TEN,copies:3}]
      },
      {
        id:83,chapterId:5,titleKey:'mission.83.title',shortKey:'mission.83.short',title:'Kogu kuuega jagamine',short:'÷6 · kõik',mode:'input',operation:'divide',seconds:TIMER_PROFILE.divisionFull,accent:'#bb7155',
        questionGroups:[{type:'division',divisor:6,statsTable:6,factors:ONE_TO_TEN,copies:1},{type:'adaptive',operation:'divide',divisor:6,statsTable:6,factors:ONE_TO_TEN,count:5}]
      },
      {
        id:84,chapterId:5,titleKey:'mission.84.title',shortKey:'mission.84.short',title:'Jagame viie ja kuuega',short:'÷5 ja ÷6',mode:'input',operation:'divide',seconds:TIMER_PROFILE.reorder,accent:'#c5664d',
        questionGroups:[{type:'division',divisor:5,statsTable:5,factors:[2,3,4,5,6,7,8],copies:1},{type:'division',divisor:6,statsTable:6,factors:[1,2,3,4,5,6,7,8],copies:1}]
      },
      {
        id:85,chapterId:5,titleKey:'mission.85.title',shortKey:'mission.85.short',title:'Korrutamine ja jagamine kuuega',short:'×6 ja ÷6',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.familyMixed,accent:'#ce6147',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'division',divisor:6,statsTable:6,factors:[4,5,6,7,8,9,10],copies:1}]
      },
      {
        id:86,chapterId:5,titleKey:'mission.86.title',shortKey:'mission.86.short',title:'Kõik segamini',short:'Kõik 1–6',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.adaptive,accent:'#d65d40',
        questionGroups:[{type:'multiplication',table:3,statsTable:3,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[4,7],orientation:'mixed',copies:1},{type:'division',divisor:3,statsTable:3,factors:[8],copies:1},{type:'division',divisor:4,statsTable:4,factors:[7],copies:1},{type:'division',divisor:5,statsTable:5,factors:[9],copies:1},{type:'division',divisor:6,statsTable:6,factors:[3,8],copies:1},{type:'adaptive',count:6,families:[{operation:'multiply',table:4,statsTable:4,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'divide',divisor:4,statsTable:4,factors:ONE_TO_TEN},{operation:'divide',divisor:5,statsTable:5,factors:ONE_TO_TEN},{operation:'divide',divisor:6,statsTable:6,factors:ONE_TO_TEN}]}]
      },
      {
        id:87,chapterId:5,titleKey:'mission.87.title',shortKey:'mission.87.short',title:'Peatüki kontroll',short:'Kontroll 1–6',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.control,accent:'#df5939',
        questionGroups:[{type:'multiplication',table:1,statsTable:1,factors:[10],orientation:'forward',copies:1},{type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[4,5,6,7,8,9],orientation:'mixed',copies:1},{type:'division',divisor:3,statsTable:3,factors:[7],copies:1},{type:'division',divisor:4,statsTable:4,factors:[8],copies:1},{type:'division',divisor:5,statsTable:5,factors:[6],copies:1},{type:'division',divisor:6,statsTable:6,factors:[5,10],copies:1}]
      },
      {
        id:88,chapterId:6,titleKey:'mission.88.title',shortKey:'mission.88.short',title:'Korrutamise valik',short:'Vali ×7',mode:'choice',operation:'multiply',seconds:TIMER_PROFILE.choice,accent:'#a6df45',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[2,4,6,8,10],orientation:'forward',copies:1}]
      },
      {
        id:89,chapterId:6,titleKey:'mission.89.title',shortKey:'mission.89.short',title:'Alustame seitsmega',short:'×7 · 1–5',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstHalf,accent:'#8ddd54',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:ONE_TO_FIVE,orientation:'forward',copies:3}]
      },
      {
        id:90,chapterId:6,titleKey:'mission.90.title',shortKey:'mission.90.short',title:'Jätkame seitsmega',short:'×7 · 6–10',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.secondHalf,accent:'#72d665',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:SIX_TO_TEN,orientation:'forward',copies:3}]
      },
      {
        id:91,chapterId:6,titleKey:'mission.91.title',shortKey:'mission.91.short',title:'Kogu seitsmega korrutamine',short:'×7 · kõik',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.fullTable,accent:'#58ce79',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'forward',copies:1},{type:'multiplication',table:7,statsTable:7,factors:SIX_TO_TEN,orientation:'forward',copies:1}]
      },
      {
        id:92,chapterId:6,titleKey:'mission.92.title',shortKey:'mission.92.short',title:'Seitse teisel kohal',short:'arv × 7',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reverse,accent:'#45c58c',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'reverse',copies:1},{type:'multiplication',table:7,statsTable:7,factors:SIX_TO_TEN,orientation:'reverse',copies:1}]
      },
      {
        id:93,chapterId:6,titleKey:'mission.93.title',shortKey:'mission.93.short',title:'Vahetame järjekorda',short:'×7 ↔ 7×',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.reorder,accent:'#39b99f',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:SIX_TO_TEN,orientation:'mixed',copies:1}]
      },
      {
        id:94,chapterId:6,titleKey:'mission.94.title',shortKey:'mission.94.short',title:'Kuus ja seitse koos',short:'×6 ja ×7',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.firstMix,accent:'#36abaf',
        questionGroups:[{type:'multiplication',table:6,statsTable:6,factors:[2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1}]
      },
      {
        id:95,chapterId:6,titleKey:'mission.95.title',shortKey:'mission.95.short',title:'Seitse on selge',short:'Täpsus ×7',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.adaptive,accent:'#409cb9',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'mixed',copies:1},{type:'adaptive',operation:'multiply',table:7,statsTable:7,factors:[5,6,7,8,9],count:5,orientation:'mixed'}]
      },
      {
        id:96,chapterId:6,titleKey:'mission.96.title',shortKey:'mission.96.short',title:'Kordame kõike',short:'×1–7',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.cumulative,accent:'#578dc0',
        questionGroups:[{type:'multiplication',table:2,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[4,8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[1,2,3,4,5,6,7,8,9],orientation:'mixed',copies:1}]
      },
      {
        id:97,chapterId:6,titleKey:'mission.97.title',shortKey:'mission.97.short',title:'Korrutamise kontroll',short:'Kontroll ×1–7',mode:'input',operation:'multiply',seconds:TIMER_PROFILE.control,accent:'#717dc4',
        questionGroups:[{type:'multiplication',table:2,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[4,8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[2,3,4,5,6,7,8,9,10],orientation:'mixed',copies:1}]
      },
      {
        id:98,chapterId:6,titleKey:'mission.98.title',shortKey:'mission.98.short',title:'Jagamise valik',short:'Vali ÷7',mode:'choice',operation:'divide',seconds:TIMER_PROFILE.choice,accent:'#896dc3',
        questionGroups:[{type:'division',divisor:7,statsTable:7,factors:ONE_TO_TEN,copies:1},{type:'division',divisor:7,statsTable:7,factors:[2,4,6,8,10],copies:1}]
      },
      {
        id:99,chapterId:6,titleKey:'mission.99.title',shortKey:'mission.99.short',title:'Jagame seitsmega',short:'÷7 · 1–5',mode:'input',operation:'divide',seconds:TIMER_PROFILE.firstHalf,accent:'#a061bd',
        questionGroups:[{type:'division',divisor:7,statsTable:7,factors:ONE_TO_FIVE,copies:3}]
      },
      {
        id:100,chapterId:6,titleKey:'mission.100.title',shortKey:'mission.100.short',title:'Jätkame jagamist',short:'÷7 · 6–10',mode:'input',operation:'divide',seconds:TIMER_PROFILE.secondHalf,accent:'#b75ab1',
        questionGroups:[{type:'division',divisor:7,statsTable:7,factors:SIX_TO_TEN,copies:3}]
      },
      {
        id:101,chapterId:6,titleKey:'mission.101.title',shortKey:'mission.101.short',title:'Kogu seitsmega jagamine',short:'÷7 · kõik',mode:'input',operation:'divide',seconds:TIMER_PROFILE.divisionFull,accent:'#ca599f',
        questionGroups:[{type:'division',divisor:7,statsTable:7,factors:ONE_TO_TEN,copies:1},{type:'adaptive',operation:'divide',divisor:7,statsTable:7,factors:ONE_TO_TEN,count:5}]
      },
      {
        id:102,chapterId:6,titleKey:'mission.102.title',shortKey:'mission.102.short',title:'Jagame kuue ja seitsmega',short:'÷6 ja ÷7',mode:'input',operation:'divide',seconds:TIMER_PROFILE.reorder,accent:'#d45d8a',
        questionGroups:[{type:'division',divisor:6,statsTable:6,factors:[2,3,4,5,6,7,8],copies:1},{type:'division',divisor:7,statsTable:7,factors:[1,2,3,4,5,6,7,8],copies:1}]
      },
      {
        id:103,chapterId:6,titleKey:'mission.103.title',shortKey:'mission.103.short',title:'Korrutamine ja jagamine seitsmega',short:'×7 ja ÷7',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.familyMixed,accent:'#dc6675',
        questionGroups:[{type:'multiplication',table:7,statsTable:7,factors:[1,2,3,4,5,6,7,8],orientation:'mixed',copies:1},{type:'division',divisor:7,statsTable:7,factors:[4,5,6,7,8,9,10],copies:1}]
      },
      {
        id:104,chapterId:6,titleKey:'mission.104.title',shortKey:'mission.104.short',title:'Kõik segamini',short:'Kõik 1–7',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.adaptive,accent:'#e27463',
        questionGroups:[{type:'multiplication',table:4,statsTable:4,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[4,7],orientation:'mixed',copies:1},{type:'division',divisor:4,statsTable:4,factors:[8],copies:1},{type:'division',divisor:5,statsTable:5,factors:[9],copies:1},{type:'division',divisor:6,statsTable:6,factors:[7],copies:1},{type:'division',divisor:7,statsTable:7,factors:[3,8],copies:1},{type:'adaptive',count:6,families:[{operation:'multiply',table:5,statsTable:5,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:6,statsTable:6,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'multiply',table:7,statsTable:7,factors:ONE_TO_TEN,orientation:'mixed'},{operation:'divide',divisor:5,statsTable:5,factors:ONE_TO_TEN},{operation:'divide',divisor:6,statsTable:6,factors:ONE_TO_TEN},{operation:'divide',divisor:7,statsTable:7,factors:ONE_TO_TEN}]}]
      },
      {
        id:105,chapterId:6,titleKey:'mission.105.title',shortKey:'mission.105.short',title:'Peatüki kontroll',short:'Kontroll 1–7',mode:'input',operation:'mixed',seconds:TIMER_PROFILE.control,accent:'#e98555',
        questionGroups:[{type:'multiplication',table:2,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:3,statsTable:3,factors:[7],orientation:'mixed',copies:1},{type:'multiplication',table:4,statsTable:4,factors:[6],orientation:'mixed',copies:1},{type:'multiplication',table:5,statsTable:5,factors:[9],orientation:'mixed',copies:1},{type:'multiplication',table:6,statsTable:6,factors:[8],orientation:'mixed',copies:1},{type:'multiplication',table:7,statsTable:7,factors:[4,5,6,7,8,9],orientation:'mixed',copies:1},{type:'division',divisor:4,statsTable:4,factors:[8],copies:1},{type:'division',divisor:5,statsTable:5,factors:[9],copies:1},{type:'division',divisor:6,statsTable:6,factors:[7],copies:1},{type:'division',divisor:7,statsTable:7,factors:[5,10],copies:1}]
      },
      ...CHAPTER_EIGHT_MISSIONS

    ],
    fallbackQuestionGroups:[
      {type:'multiplication',factors:[1,2,3,4,5],orientation:'forward',copies:3}
    ]
  };
});
