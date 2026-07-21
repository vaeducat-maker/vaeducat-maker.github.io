(function(root,factory){
  const config=factory();
  if(typeof module==='object'&&module.exports)module.exports=config;
  else root.EDUKASS_CHAPTER_ONE=config;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  // EDUKASS · первая глава «Üks ja kaks»
  //
  // Этот файл описывает учебное содержание 15 миссий. Здесь можно увидеть:
  // - название и подпись миссии;
  // - способ ответа (выбор или самостоятельный ввод);
  // - время звездопада;
  // - группы примеров, из которых собираются 15 заданий.
  //
  // Типы групп примеров:
  // fixed          — перечисленные вручную примеры;
  // multiplication — умножение на 2 для заданных множителей;
  // division       — деление на 2 для заданных ответов;
  // adaptive       — повторение пяти наиболее трудных множителей ребёнка.

  const ONE_TO_TEN=[1,2,3,4,5,6,7,8,9,10];

  return {
    schemaVersion:1,
    id:'uks-ja-kaks',
    title:'Üks ja kaks',
    roundLength:15,
    practiceTable:2,
    practiceFactors:ONE_TO_TEN,
    lesson:{
      initialMode:'multiply',
      divisionMode:'divide',
      demoFactor:4,
      divisionMissionId:11
    },
    story:{
      segmentLength:5,
      shipMissionId:5,
      engineMissionId:10,
      finalMissionId:15,
      planetMissionIds:[3,6,9,10,12,15]
    },
    defaultLanguage:'et',
    supportedLanguages:['et'],
    storage:{
      progressKey:'edukass-chapter-one-v18',
      soundKey:'edukass-sound-enabled',
      introKey:'edukass-opening-seen-v28',
      progressSchemaVersion:1
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
    ],
    fallbackQuestionGroups:[
      {type:'multiplication',factors:[1,2,3,4,5],orientation:'forward',copies:3}
    ]
  };
});
