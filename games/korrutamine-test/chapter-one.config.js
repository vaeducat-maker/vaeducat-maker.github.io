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
    }
  ];

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
        version:3,
        startMissionId:16,
        flightEndMissionId:18,
        explorationEndMissionId:25,
        returnEndMissionId:30,
        upgradeMissionIds:[31,32],
        finalMissionId:33
      }
    },
    chapters:[
      {id:1,titleKey:'chapter.1.title',shortKey:'chapter.1.short',startMissionId:1,endMissionId:15,accent:'#70d9cf'},
      {id:2,titleKey:'chapter.2.title',shortKey:'chapter.2.short',startMissionId:16,endMissionId:33,accent:'#8f7de2'}
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
      }

    ],
    fallbackQuestionGroups:[
      {type:'multiplication',factors:[1,2,3,4,5],orientation:'forward',copies:3}
    ]
  };
});
