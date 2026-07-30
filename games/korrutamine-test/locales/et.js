(function(root,factory){
  const locale=factory();
  if(typeof module==='object'&&module.exports)module.exports=locale;
  else{
    root.EDUKASS_LOCALES=root.EDUKASS_LOCALES||{};
    root.EDUKASS_LOCALES.et=locale;
  }
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  return {
    code:'et',
    name:'Eesti',
    strings:{
      'meta.title':'EDUKASS — Korrutustabeli treener',
      'meta.description':'EDUKASSi korrutustabeli treener: 51 korrutamise ja jagamise missiooni lastele.',
      'intro.aria':'EDUKASSi mängu algus',
      'intro.playAria':'Mängi',
      'intro.start':'MÄNGI!',
      'intro.continue':'MÄNGI!',
      'nav.homeAria':'Avalehele',
      'nav.prototype':'MÄNGU PROTOTÜÜP',
      'sound.offAria':'Lülita heli välja',
      'sound.onAria':'Lülita heli sisse',
      'action.reset':'Alusta uuesti',
      'share.button':'JAGA',
      'share.buttonAria':'Jaga mängu',
      'share.closeAria':'Sulge jagamise aken',
      'share.title':'Jaga mängu',
      'share.description':'Saada link sõbrale, lapsele või õpilasele.',
      'share.linkLabel':'Mängu link',
      'share.copy':'Kopeeri link',
      'share.copied':'Link kopeeritud!',
      'share.copyFailed':'Kopeeri link käsitsi.',
      'share.progressNote':'Edusammud salvestatakse mängija seadmes.',
      'share.nativeText':'Proovi EDUKASSi korrutustabeli treenerit!',
      'install.button':'LISA TELEFONI EKRAANILE',
      'lesson.eyebrowMultiply':'PEATÜKK 1 · ÜKS JA KAKS',
      'lesson.eyebrowDivide':'PEATÜKK 1 · JAGAMINE',
      'lesson.titleMultiply':'Avastame arvud 1 ja 2',
      'lesson.titleDivide':'Nüüd jagame kahega',
      'lesson.table2.eyebrowMultiply':'PEATÜKK 1 · ÜKS JA KAKS',
      'lesson.table2.eyebrowDivide':'PEATÜKK 1 · JAGAMINE',
      'lesson.table2.titleMultiply':'Avastame arvud 1 ja 2',
      'lesson.table2.titleDivide':'Nüüd jagame kahega',
      'lesson.table3.eyebrowMultiply':'PEATÜKK 2 · KOLM',
      'lesson.table3.eyebrowDivide':'PEATÜKK 2 · JAGAMINE',
      'lesson.table3.titleMultiply':'Nüüd korrutame kolmega',
      'lesson.table3.titleDivide':'Nüüd jagame kolmega',
      'lesson.table4.eyebrowMultiply':'PEATÜKK 3 · NELI',
      'lesson.table4.eyebrowDivide':'PEATÜKK 3 · JAGAMINE',
      'lesson.table4.titleMultiply':'Nüüd korrutame neljaga',
      'lesson.table4.titleDivide':'Nüüd jagame neljaga',
      'lesson.table5.eyebrowMultiply':'PEATÜKK 4 · VIIS',
      'lesson.table5.eyebrowDivide':'PEATÜKK 4 · JAGAMINE',
      'lesson.table5.titleMultiply':'Nüüd korrutame viiega',
      'lesson.table5.titleDivide':'Nüüd jagame viiega',
      'lesson.table6.eyebrowMultiply':'PEATÜKK 5 · KUUS',
      'lesson.table6.eyebrowDivide':'PEATÜKK 5 · JAGAMINE',
      'lesson.table6.titleMultiply':'Nüüd korrutame kuuega',
      'lesson.table6.titleDivide':'Nüüd jagame kuuega',
      'lesson.table7.eyebrowMultiply':'PEATÜKK 6 · SEITSE',
      'lesson.table7.eyebrowDivide':'PEATÜKK 6 · JAGAMINE',
      'lesson.table7.titleMultiply':'Nüüd korrutame seitsmega',
      'lesson.table7.titleDivide':'Nüüd jagame seitsmega',
      'lesson.table8.eyebrowMultiply':'PEATÜKK 7 · KAHEKSA',
      'lesson.table8.eyebrowDivide':'PEATÜKK 7 · JAGAMINE',
      'lesson.table8.titleMultiply':'Nüüd korrutame kaheksaga',
      'lesson.table8.titleDivide':'Nüüd jagame kaheksaga',
      'lesson.table9.eyebrowMultiply':'PEATÜKK 8 · ÜHEKSA',
      'lesson.table9.eyebrowDivide':'PEATÜKK 8 · JAGAMINE',
      'lesson.table9.titleMultiply':'Nüüd korrutame üheksaga',
      'lesson.table9.titleDivide':'Nüüd jagame üheksaga',
      'lesson.table10.eyebrowMultiply':'UUS KORRUTAMINE',
      'lesson.table10.titleMultiply':'Korrutame kümnega',
      'lesson.table10.eyebrowDivide':'UUS JAGAMINE',
      'lesson.table10.titleDivide':'Jagame kümnega',
      'lesson.explorerAria':'Interaktiivne selgitus',
      'lesson.hintMultiply':'Vajuta arvule.',
      'lesson.hintDivide':'Vajuta jagatavale.',
      'lesson.factorAria':'Vali arv',
      'lesson.dividendAria':'Vali jagatav',
      'lesson.numberAria':'Arv {value}',
      'lesson.dividendValueAria':'Jagatav {value}',
      'lesson.openMission':'Ava {number}. missioon',
      'lesson.toExplanations':'MÄNGI!',
      'lesson.toMissions':'← KAARDILE',
      'explanations.eyebrow':'SELGITUSED',
      'explanations.title':'Mida kordame?',
      'explanations.listAria':'Avatud korrutamise ja jagamise selgitused',
      'explanations.multiply':'Korrutamine',
      'explanations.oneAndTwo':'1 ja 2-ga',
      'explanations.repeatMultiplicationAria':'Korda ühe ja kahega korrutamise selgitust',
      'explanations.divide':'Jagamine',
      'explanations.byTwo':'2-ga',
      'explanations.repeatDivisionAria':'Korda kahega jagamise selgitust',
      'explanations.lockedDivisionAria':'Jagamise selgitus avaneb pärast 10. missiooni',
      'explanations.three':'3-ga',
      'explanations.four':'4-ga',
      'explanations.five':'5-ga',
      'explanations.six':'6-ga',
      'explanations.seven':'7-ga',
      'explanations.eight':'8-ga',
      'explanations.nine':'9-ga',
      'explanations.ten':'10-ga',
      'explanations.repeatThreeMultiplicationAria':'Korda kolmega korrutamise selgitust',
      'explanations.lockedThreeMultiplicationAria':'Kolmega korrutamise selgitus avaneb pärast 15. missiooni',
      'explanations.repeatThreeDivisionAria':'Korda kolmega jagamise selgitust',
      'explanations.lockedThreeDivisionAria':'Kolmega jagamise selgitus avaneb pärast 25. missiooni',
      'explanations.repeatFourMultiplicationAria':'Korda neljaga korrutamise selgitust',
      'explanations.lockedFourMultiplicationAria':'Neljaga korrutamise selgitus avaneb pärast 33. missiooni',
      'explanations.repeatFourDivisionAria':'Korda neljaga jagamise selgitust',
      'explanations.lockedFourDivisionAria':'Neljaga jagamise selgitus avaneb pärast 43. missiooni',
      'explanations.repeatFiveMultiplicationAria':'Korda viiega korrutamise selgitust',
      'explanations.lockedFiveMultiplicationAria':'Viiega korrutamise selgitus avaneb pärast 51. missiooni',
      'explanations.repeatFiveDivisionAria':'Korda viiega jagamise selgitust',
      'explanations.lockedFiveDivisionAria':'Viiega jagamise selgitus avaneb pärast 61. missiooni',
      'explanations.repeatSixMultiplicationAria':'Korda kuuega korrutamise selgitust',
      'explanations.lockedSixMultiplicationAria':'Kuuega korrutamise selgitus avaneb pärast 69. missiooni',
      'explanations.repeatSixDivisionAria':'Korda kuuega jagamise selgitust',
      'explanations.lockedSixDivisionAria':'Kuuega jagamise selgitus avaneb pärast 79. missiooni',
      'explanations.repeatSevenMultiplicationAria':'Korda seitsmega korrutamise selgitust',
      'explanations.lockedSevenMultiplicationAria':'Seitsmega korrutamise selgitus avaneb pärast 87. missiooni',
      'explanations.repeatSevenDivisionAria':'Korda seitsmega jagamise selgitust',
      'explanations.lockedSevenDivisionAria':'Seitsmega jagamise selgitus avaneb pärast 97. missiooni',
      'explanations.repeatEightMultiplicationAria':'Korda kaheksaga korrutamise selgitust',
      'explanations.lockedEightMultiplicationAria':'Kaheksaga korrutamise selgitus avaneb pärast 105. missiooni',
      'explanations.repeatEightDivisionAria':'Korda kaheksaga jagamise selgitust',
      'explanations.lockedEightDivisionAria':'Kaheksaga jagamise selgitus avaneb pärast 115. missiooni',
      'explanations.repeatNineMultiplicationAria':'Korda üheksaga korrutamise selgitust',
      'explanations.lockedNineMultiplicationAria':'Üheksaga korrutamise selgitus avaneb pärast 123. missiooni',
      'explanations.repeatNineDivisionAria':'Korda üheksaga jagamise selgitust',
      'explanations.lockedNineDivisionAria':'Üheksaga jagamise selgitus avaneb pärast 133. missiooni',
      'explanations.repeatTenMultiplicationAria':'Korda kümnega korrutamise selgitust',
      'explanations.lockedTenMultiplicationAria':'Kümnega korrutamise selgitus avaneb pärast 141. missiooni',
      'explanations.repeatTenDivisionAria':'Korda kümnega jagamise selgitust',
      'explanations.lockedTenDivisionAria':'Kümnega jagamise selgitus avaneb pärast 151. missiooni',
      'map.title':'Missioonide kaart',
      'map.energy':'Täheenergia',
      'map.routeAria':'Kosmosetee eesmärgid',
      'map.missionsAria':'Esimese kuni üheksanda peatüki missioonid',
      'map.multiply':'Korrutamine',
      'map.divide':'Jagamine',
      'map.repeatLesson':'Korda selgitust',
      'map.routeLabel':'KOSMOSETEE · MISSIOONID 1–185',
      'chapter.1.title':'1. PEATÜKK · ÜKS JA KAKS',
      'chapter.1.short':'ÜKS JA KAKS',
      'chapter.2.title':'2. PEATÜKK · KOLM',
      'chapter.2.short':'KOLM',
      'chapter.3.title':'3. PEATÜKK · NELI',
      'chapter.3.short':'NELI',
      'chapter.4.title':'4. PEATÜKK · VIIS',
      'chapter.4.short':'VIIS',
      'chapter.5.title':'5. PEATÜKK · KUUS',
      'chapter.5.short':'KUUS',
      'chapter.6.title':'6. PEATÜKK · SEITSE',
      'chapter.6.short':'SEITSE',
      'chapter.7.title':'7. PEATÜKK · KAHEKSA',
      'chapter.7.short':'KAHEKSA',
      'chapter.8.title':'8. PEATÜKK · ÜHEKSA',
      'chapter.8.short':'ÜHEKSA',
      'chapter.9.title':'9. PEATÜKK · KÜMME',
      'chapter.9.short':'KÜMME',
      'chapter.10.title':'10. PEATÜKK · DRAAKONITE TAEVAS',
      'chapter.10.short':'DRAAKONID',
      'story.goal1':'1. SIHT',
      'story.goal2':'2. SIHT',
      'story.goal3':'3. SIHT',
      'story.goal4':'4. SIHT',
      'story.complete':'PEATÜKK LÄBITUD',
      'story.findShip':'Leia kosmoselaev',
      'story.startEngine':'Käivita mootor',
      'story.openPortal':'Ava tähevärav',
      'story.newPlanet':'Uus planeet on avatud!',
      'story.ship':'Kosmoselaev',
      'story.engine':'Mootor',
      'story.portal':'Tähevärav',
      'story.worldArrival':'Saabumine',
      'story.worldNature':'Loodus ärkab',
      'story.worldFriends':'Maailm elab',
      'story.worldLight':'Maailm särab',
      'story.awakenWorld':'Ärata maailm',
      'story.worldAlive':'Maailm elab!',
      'story.leaveWorld':'Uus maailm jääb elama',
      'story.windArrival':'Saabumine',
      'story.windMotion':'Tuul ärkab',
      'story.windSky':'Taevas elab',
      'story.windLight':'Maailm helendab',
      'story.leaveWindWorld':'Tuulemaailm jääb elama',
      'battle.back':'← KAARDILE',
      'battle.mission':'MISSIOON {number} / {total}',
      'battle.answers':'Vastused',
      'battle.solve':'Lahenda tehe',
      'battle.doneAria':'Tehtud: {correct}/{total}',
      'battle.answerAria':'Vastus',
      'battle.choose':'Vali vastus',
      'battle.input':'Sisesta arv',
      'battle.optionsAria':'Vastusevariandid',
      'battle.keypadAria':'Vastuse numbriklahvid',
      'battle.clearAria':'Tühjenda',
      'battle.deleteAria':'Kustuta number',
      'feedback.correct':'Õige',
      'feedback.correctAnswer':'Õige vastus on {answer}',
      'mission.aria':'Missioon {number}: {title}{completed}{locked}',
      'mission.completedSuffix':', läbitud',
      'mission.lockedSuffix':', lukus',
      'result.rewardFirst':'★ +1 TÄHEENERGIA',
      'result.rewardCollected':'★ TÄHEENERGIA ON KOGUTUD',
      'result.missionPassed':'MISSIOON LÄBITUD',
      'result.chapterPassed':'PEATÜKK LÄBITUD',
      'result.titlePassed':'Missioon läbitud',
      'result.done':'Tehtud!',
      'result.tryAgainTitle':'Proovi uuesti!',
      'result.tryAgain':'Proovi uuesti',
      'result.next':'Edasi',
      'result.missions':'Missioonid',
      'result.toMissions':'← KAARDILE',
      'result.mistakes':'Vead',
      'result.time':'Aeg',
      'reset.confirm':'Kas alustame mängu uuesti? Läbitud missioonid lukustatakse.',
      'mission.1.title':'Korrutamise valik',
      'mission.1.short':'Vali ×',
      'mission.2.title':'Alustame kahega',
      'mission.2.short':'×2 · 1–5',
      'mission.3.title':'Jätkame kahega',
      'mission.3.short':'×2 · 6–10',
      'mission.4.title':'Kogu kahega korrutamine',
      'mission.4.short':'×2 · kõik',
      'mission.5.title':'Kaks teisel kohal',
      'mission.5.short':'arv × 2',
      'mission.6.title':'Vahetame järjekorda',
      'mission.6.short':'×2 ↔ 2×',
      'mission.7.title':'Kaks on selge',
      'mission.7.short':'Täpsus',
      'mission.8.title':'Kordame keerulisi',
      'mission.8.short':'Kordus',
      'mission.9.title':'Valmistume kontrolliks',
      'mission.9.short':'Segamini',
      'mission.10.title':'Korrutamise kontroll',
      'mission.10.short':'Kontroll ×',
      'mission.11.title':'Jagamise valik',
      'mission.11.short':'Vali ÷',
      'mission.12.title':'Jagame kahega',
      'mission.12.short':'÷2 · 1–5',
      'mission.13.title':'Jätkame jagamist',
      'mission.13.short':'÷2 · 6–10',
      'mission.14.title':'Kogu kahega jagamine',
      'mission.14.short':'÷2 · kõik',
      'mission.15.title':'Korrutamine ja jagamine',
      'mission.15.short':'× ja ÷',

      'mission.16.title':'Korrutamise valik',
      'mission.16.short':'Vali ×3',
      'mission.17.title':'Alustame kolmega',
      'mission.17.short':'×3 · 1–5',
      'mission.18.title':'Jätkame kolmega',
      'mission.18.short':'×3 · 6–10',
      'mission.19.title':'Kogu kolmega korrutamine',
      'mission.19.short':'×3 · kõik',
      'mission.20.title':'Kolm teisel kohal',
      'mission.20.short':'arv × 3',
      'mission.21.title':'Vahetame järjekorda',
      'mission.21.short':'×3 ↔ 3×',
      'mission.22.title':'Kaks ja kolm koos',
      'mission.22.short':'×2 ja ×3',
      'mission.23.title':'Kolm on selge',
      'mission.23.short':'Täpsus ×3',
      'mission.24.title':'Kordame kõike',
      'mission.24.short':'×1–3',
      'mission.25.title':'Korrutamise kontroll',
      'mission.25.short':'Kontroll ×1–3',
      'mission.26.title':'Jagamise valik',
      'mission.26.short':'Vali ÷3',
      'mission.27.title':'Jagame kolmega',
      'mission.27.short':'÷3 · 1–5',
      'mission.28.title':'Jätkame jagamist',
      'mission.28.short':'÷3 · 6–10',
      'mission.29.title':'Kogu kolmega jagamine',
      'mission.29.short':'÷3 · kõik',
      'mission.30.title':'Jagame kahe ja kolmega',
      'mission.30.short':'÷2 ja ÷3',
      'mission.31.title':'Korrutamine ja jagamine kolmega',
      'mission.31.short':'×3 ja ÷3',
      'mission.32.title':'Kõik segamini',
      'mission.32.short':'Kõik 1–3',
      'mission.33.title':'Peatüki kontroll',
      'mission.33.short':'Kontroll 1–3',
      'mission.34.title':'Korrutamise valik',
      'mission.34.short':'Vali ×4',
      'mission.35.title':'Alustame neljaga',
      'mission.35.short':'×4 · 1–5',
      'mission.36.title':'Jätkame neljaga',
      'mission.36.short':'×4 · 6–10',
      'mission.37.title':'Kogu neljaga korrutamine',
      'mission.37.short':'×4 · kõik',
      'mission.38.title':'Neli teisel kohal',
      'mission.38.short':'arv × 4',
      'mission.39.title':'Vahetame järjekorda',
      'mission.39.short':'×4 ↔ 4×',
      'mission.40.title':'Kolm ja neli koos',
      'mission.40.short':'×3 ja ×4',
      'mission.41.title':'Neli on selge',
      'mission.41.short':'Täpsus ×4',
      'mission.42.title':'Kordame kõike',
      'mission.42.short':'×1–4',
      'mission.43.title':'Korrutamise kontroll',
      'mission.43.short':'Kontroll ×1–4',
      'mission.44.title':'Jagamise valik',
      'mission.44.short':'Vali ÷4',
      'mission.45.title':'Jagame neljaga',
      'mission.45.short':'÷4 · 1–5',
      'mission.46.title':'Jätkame jagamist',
      'mission.46.short':'÷4 · 6–10',
      'mission.47.title':'Kogu neljaga jagamine',
      'mission.47.short':'÷4 · kõik',
      'mission.48.title':'Jagame kolme ja neljaga',
      'mission.48.short':'÷3 ja ÷4',
      'mission.49.title':'Korrutamine ja jagamine neljaga',
      'mission.49.short':'×4 ja ÷4',
      'mission.50.title':'Kõik segamini',
      'mission.50.short':'Kõik 1–4',
      'mission.51.title':'Peatüki kontroll',
      'mission.51.short':'Kontroll 1–4',
      'mission.52.title':'Korrutamise valik',
      'mission.52.short':'Vali ×5',
      'mission.53.title':'Alustame viiega',
      'mission.53.short':'×5 · 1–5',
      'mission.54.title':'Jätkame viiega',
      'mission.54.short':'×5 · 6–10',
      'mission.55.title':'Kogu viiega korrutamine',
      'mission.55.short':'×5 · kõik',
      'mission.56.title':'Viis teisel kohal',
      'mission.56.short':'arv × 5',
      'mission.57.title':'Vahetame järjekorda',
      'mission.57.short':'×5 ↔ 5×',
      'mission.58.title':'Neli ja viis koos',
      'mission.58.short':'×4 ja ×5',
      'mission.59.title':'Viis on selge',
      'mission.59.short':'Täpsus ×5',
      'mission.60.title':'Kordame kõike',
      'mission.60.short':'×1–5',
      'mission.61.title':'Korrutamise kontroll',
      'mission.61.short':'Kontroll ×1–5',
      'mission.62.title':'Jagamise valik',
      'mission.62.short':'Vali ÷5',
      'mission.63.title':'Jagame viiega',
      'mission.63.short':'÷5 · 1–5',
      'mission.64.title':'Jätkame jagamist',
      'mission.64.short':'÷5 · 6–10',
      'mission.65.title':'Kogu viiega jagamine',
      'mission.65.short':'÷5 · kõik',
      'mission.66.title':'Jagame nelja ja viiega',
      'mission.66.short':'÷4 ja ÷5',
      'mission.67.title':'Korrutamine ja jagamine viiega',
      'mission.67.short':'×5 ja ÷5',
      'mission.68.title':'Kõik segamini',
      'mission.68.short':'Kõik 1–5',
      'mission.69.title':'Peatüki kontroll',
      'mission.69.short':'Kontroll 1–5',
      'mission.70.title':'Korrutamise valik',
      'mission.70.short':'Vali ×6',
      'mission.71.title':'Alustame kuuega',
      'mission.71.short':'×6 · 1–5',
      'mission.72.title':'Jätkame kuuega',
      'mission.72.short':'×6 · 6–10',
      'mission.73.title':'Kogu kuuega korrutamine',
      'mission.73.short':'×6 · kõik',
      'mission.74.title':'Kuus teisel kohal',
      'mission.74.short':'arv × 6',
      'mission.75.title':'Vahetame järjekorda',
      'mission.75.short':'×6 ↔ 6×',
      'mission.76.title':'Viis ja kuus koos',
      'mission.76.short':'×5 ja ×6',
      'mission.77.title':'Kuus on selge',
      'mission.77.short':'Täpsus ×6',
      'mission.78.title':'Kordame kõike',
      'mission.78.short':'×1–6',
      'mission.79.title':'Korrutamise kontroll',
      'mission.79.short':'Kontroll ×1–6',
      'mission.80.title':'Jagamise valik',
      'mission.80.short':'Vali ÷6',
      'mission.81.title':'Jagame kuuega',
      'mission.81.short':'÷6 · 1–5',
      'mission.82.title':'Jätkame jagamist',
      'mission.82.short':'÷6 · 6–10',
      'mission.83.title':'Kogu kuuega jagamine',
      'mission.83.short':'÷6 · kõik',
      'mission.84.title':'Jagame viie ja kuuega',
      'mission.84.short':'÷5 ja ÷6',
      'mission.85.title':'Korrutamine ja jagamine kuuega',
      'mission.85.short':'×6 ja ÷6',
      'mission.86.title':'Kõik segamini',
      'mission.86.short':'Kõik 1–6',
      'mission.87.title':'Peatüki kontroll',
      'mission.87.short':'Kontroll 1–6',
      'mission.88.title':'Korrutamise valik','mission.88.short':'Vali ×7',
      'mission.89.title':'Alustame seitsmega','mission.89.short':'×7 · 1–5',
      'mission.90.title':'Jätkame seitsmega','mission.90.short':'×7 · 6–10',
      'mission.91.title':'Kogu seitsmega korrutamine','mission.91.short':'×7 · kõik',
      'mission.92.title':'Seitse teisel kohal','mission.92.short':'arv × 7',
      'mission.93.title':'Vahetame järjekorda','mission.93.short':'×7 ↔ 7×',
      'mission.94.title':'Kuus ja seitse koos','mission.94.short':'×6 ja ×7',
      'mission.95.title':'Seitse on selge','mission.95.short':'Täpsus ×7',
      'mission.96.title':'Kordame kõike','mission.96.short':'×1–7',
      'mission.97.title':'Korrutamise kontroll','mission.97.short':'Kontroll ×1–7',
      'mission.98.title':'Jagamise valik','mission.98.short':'Vali ÷7',
      'mission.99.title':'Jagame seitsmega','mission.99.short':'÷7 · 1–5',
      'mission.100.title':'Jätkame jagamist','mission.100.short':'÷7 · 6–10',
      'mission.101.title':'Kogu seitsmega jagamine','mission.101.short':'÷7 · kõik',
      'mission.102.title':'Jagame kuue ja seitsmega','mission.102.short':'÷6 ja ÷7',
      'mission.103.title':'Korrutamine ja jagamine seitsmega','mission.103.short':'×7 ja ÷7',
      'mission.104.title':'Kõik segamini','mission.104.short':'Kõik 1–7',
      'mission.105.title':'Peatüki kontroll','mission.105.short':'Kontroll 1–7'
      ,'mission.106.title':'Korrutamise valik','mission.106.short':'Vali ×8'
      ,'mission.107.title':'Alustame kaheksaga','mission.107.short':'×8 · 1–5'
      ,'mission.108.title':'Jätkame kaheksaga','mission.108.short':'×8 · 6–10'
      ,'mission.109.title':'Kogu kaheksaga korrutamine','mission.109.short':'×8 · kõik'
      ,'mission.110.title':'Kaheksa teisel kohal','mission.110.short':'arv × 8'
      ,'mission.111.title':'Vahetame järjekorda','mission.111.short':'×8 ↔ 8×'
      ,'mission.112.title':'Seitse ja kaheksa koos','mission.112.short':'×7 ja ×8'
      ,'mission.113.title':'Kaheksa on selge','mission.113.short':'Täpsus ×8'
      ,'mission.114.title':'Kordame kõike','mission.114.short':'×1–8'
      ,'mission.115.title':'Korrutamise kontroll','mission.115.short':'Kontroll ×1–8'
      ,'mission.116.title':'Jagamise valik','mission.116.short':'Vali ÷8'
      ,'mission.117.title':'Jagame kaheksaga','mission.117.short':'÷8 · 1–5'
      ,'mission.118.title':'Jätkame jagamist','mission.118.short':'÷8 · 6–10'
      ,'mission.119.title':'Kogu kaheksaga jagamine','mission.119.short':'÷8 · kõik'
      ,'mission.120.title':'Jagame seitsme ja kaheksaga','mission.120.short':'÷7 ja ÷8'
      ,'mission.121.title':'Korrutamine ja jagamine kaheksaga','mission.121.short':'×8 ja ÷8'
      ,'mission.122.title':'Kõik segamini','mission.122.short':'Kõik 1–8'
      ,'mission.123.title':'Peatüki kontroll','mission.123.short':'Kontroll 1–8'
      ,'mission.124.title':'Korrutamise valik','mission.124.short':'Vali ×9'
      ,'mission.125.title':'Alustame üheksaga','mission.125.short':'×9 · 1–5'
      ,'mission.126.title':'Jätkame üheksaga','mission.126.short':'×9 · 6–10'
      ,'mission.127.title':'Kogu üheksaga korrutamine','mission.127.short':'×9 · kõik'
      ,'mission.128.title':'Üheksa teisel kohal','mission.128.short':'arv × 9'
      ,'mission.129.title':'Vahetame järjekorda','mission.129.short':'×9 ↔ 9×'
      ,'mission.130.title':'Kaheksa ja üheksa koos','mission.130.short':'×8 ja ×9'
      ,'mission.131.title':'Üheksa on selge','mission.131.short':'Täpsus ×9'
      ,'mission.132.title':'Kordame kõike','mission.132.short':'×1–9'
      ,'mission.133.title':'Korrutamise kontroll','mission.133.short':'Kontroll ×1–9'
      ,'mission.134.title':'Jagamise valik','mission.134.short':'Vali ÷9'
      ,'mission.135.title':'Jagame üheksaga','mission.135.short':'÷9 · 1–5'
      ,'mission.136.title':'Jätkame jagamist','mission.136.short':'÷9 · 6–10'
      ,'mission.137.title':'Kogu üheksaga jagamine','mission.137.short':'÷9 · kõik'
      ,'mission.138.title':'Jagame kaheksa ja üheksaga','mission.138.short':'÷8 ja ÷9'
      ,'mission.139.title':'Korrutamine ja jagamine üheksaga','mission.139.short':'×9 ja ÷9'
      ,'mission.140.title':'Kõik segamini','mission.140.short':'Kõik 1–9'
      ,'mission.141.title':'Peatüki kontroll','mission.141.short':'Kontroll 1–9'
      ,'mission.142.title':'Korrutamise valik','mission.142.short':'Vali ×10'
      ,'mission.143.title':'Alustame kümnega','mission.143.short':'×10 · 1–5'
      ,'mission.144.title':'Jätkame kümnega','mission.144.short':'×10 · 6–10'
      ,'mission.145.title':'Kogu kümnega korrutamine','mission.145.short':'×10 · kõik'
      ,'mission.146.title':'Kümme teisel kohal','mission.146.short':'arv × 10'
      ,'mission.147.title':'Vahetame järjekorda','mission.147.short':'×10 ↔ 10×'
      ,'mission.148.title':'Üheksa ja kümme koos','mission.148.short':'×9 ja ×10'
      ,'mission.149.title':'Kümme on selge','mission.149.short':'Täpsus ×10'
      ,'mission.150.title':'Kordame kõike','mission.150.short':'×1–10'
      ,'mission.151.title':'Korrutamise kontroll','mission.151.short':'Kontroll ×1–10'
      ,'mission.152.title':'Jagamise valik','mission.152.short':'Vali ÷10'
      ,'mission.153.title':'Jagame kümnega','mission.153.short':'÷10 · 1–5'
      ,'mission.154.title':'Jätkame jagamist','mission.154.short':'÷10 · 6–10'
      ,'mission.155.title':'Kogu kümnega jagamine','mission.155.short':'÷10 · kõik'
      ,'mission.156.title':'Jagame üheksa ja kümnega','mission.156.short':'÷9 ja ÷10'
      ,'mission.157.title':'Korrutamine ja jagamine kümnega','mission.157.short':'×10 ja ÷10'
      ,'mission.158.title':'Kõik segamini','mission.158.short':'Kõik 1–10'
      ,'mission.159.title':'Peatüki kontroll','mission.159.short':'Kontroll 1–10'
      ,'mission.160.title':'Korrutamine ärkab','mission.160.short':'Korrutamine 1–10'
      ,'mission.161.title':'Jagamine ärkab','mission.161.short':'Jagamine 1–10'
      ,'mission.162.title':'Kerged paarid','mission.162.short':'× ja ÷ · 2, 5, 10'
      ,'mission.163.title':'Kolm ja neli','mission.163.short':'× ja ÷ · 3, 4'
      ,'mission.164.title':'Kuus ja seitse','mission.164.short':'× ja ÷ · 6, 7'
      ,'mission.165.title':'Kaheksa ja üheksa','mission.165.short':'× ja ÷ · 8, 9'
      ,'mission.166.title':'Vaheta kiiresti','mission.166.short':'Korruta või jaga'
      ,'mission.167.title':'Keerulisemad tehted','mission.167.short':'Rasked paarid'
      ,'mission.168.title':'Draakoni lend','mission.168.short':'Kõik 1–10'
      ,'mission.169.title':'Täpsuse rada','mission.169.short':'Täpsus 1–10'
      ,'mission.170.title':'Kiiruse rada','mission.170.short':'Kiirus 1–10'
      ,'mission.171.title':'Suur kordamine','mission.171.short':'Kõik segamini'
      ,'mission.172.title':'Draakoniplaneedi kontroll','mission.172.short':'Kontroll 1–10'
      ,'chapter.11.title':'11. PEATÜKK · PEEGELLIIVAD','chapter.11.short':'Peegelliivad'
      ,'mission.173.title':'Peegelliiva algus','mission.173.short':'Korrutamine 1–10'
      ,'mission.174.title':'Täpsed jagamised','mission.174.short':'Jagamine 1–10'
      ,'mission.175.title':'Väikesed ja suured','mission.175.short':'× ja ÷ · 2–10'
      ,'mission.176.title':'Pööratud tehted','mission.176.short':'Järjekord vahetub'
      ,'mission.177.title':'Kuue ja seitsme rada','mission.177.short':'× ja ÷ · 6, 7'
      ,'mission.178.title':'Kaheksa ja üheksa rada','mission.178.short':'× ja ÷ · 8, 9'
      ,'mission.179.title':'Peegelduvad paarid','mission.179.short':'Seotud tehted'
      ,'mission.180.title':'Rasked korrutamised','mission.180.short':'Täpsus ×6–9'
      ,'mission.181.title':'Rasked jagamised','mission.181.short':'Täpsus ÷6–9'
      ,'mission.182.title':'Kiire vahetus','mission.182.short':'Korruta või jaga'
      ,'mission.183.title':'Tähtede ränd','mission.183.short':'Kõik 1–10'
      ,'mission.184.title':'Vaikne suurkontroll','mission.184.short':'Kõik segamini'
      ,'mission.185.title':'Peegelliiva kontroll','mission.185.short':'Kontroll 1–10'
      ,'chapter.12.title':'12. PEATÜKK · HIIDLILLED','chapter.12.short':'Hiidlilled'
      ,'chapter.13.title':'13. PEATÜKK · KRISTALLHIIGLASED','chapter.13.short':'Kristallhiiglased'
      ,'chapter.14.title':'14. PEATÜKK · LÕPUTU VIHM','chapter.14.short':'Lõputu vihm'
      ,'chapter.15.title':'15. PEATÜKK · TULEPLANEET','chapter.15.short':'Tuleplaneet'
      ,...Object.fromEntries([
        ...['Esimene hiidleht','Vesised tehted','Korrutamise õied','Jagamise õied','Helendavad juured','Ujuv saar','Uued värvid','Lehesillad','Esimene elanik','Lillepere','Väikesed õiepungad','Õitsev planeet','Lilleplaneedi kontroll'].flatMap((title,index)=>[[`mission.${186+index}.title`,title],[`mission.${186+index}.short`,index===12?'Kontroll 1–10':index===0?'Korrutamine 1–10':index===1?'Jagamine 1–10':'Kõik 1–10']]),
        ...['Kristallide org','Sügavad jagamised','Esimesed kristallid','Valgusrada','Kristallrahvas','Hõbedane kuru','Iidsed märgid','Hiiglase silmad','Ärkav mägi','Särav süda','Valgusvõrk','Kosmiline majakas','Kristallplaneedi kontroll'].flatMap((title,index)=>[[`mission.${199+index}.title`,title],[`mission.${199+index}.short`,index===12?'Kontroll 1–10':index===0?'Korrutamine 1–10':index===1?'Jagamine 1–10':'Kõik 1–10']]),
        ...['Esimene kosmiline vihm','Peegelduvad tehted','Helendavad lombid','Hiigelvari','Veekerad','Peegeljärved','Piiskade rada','Soojad tuled','Vihmaelanik','Varjualune pere','Vesikookonid','Tähtvihm','Vihmaplaneedi kontroll'].flatMap((title,index)=>[[`mission.${212+index}.title`,title],[`mission.${212+index}.short`,index===12?'Kontroll 1–10':index===0?'Korrutamine 1–10':index===1?'Jagamine 1–10':'Kõik 1–10']]),
        ...['Vaikne tuliplaneet','Kuumad tehted','Esimene lõhe','Laavajõgi','Tulekristall','Leeklill','Uinuv tulemägi','Kuldsed märgid','Tuleelanik','Elavad sädemed','Taevane tulerõngas','Valguse tee','Tuliplaneedi kontroll'].flatMap((title,index)=>[[`mission.${225+index}.title`,title],[`mission.${225+index}.short`,index===12?'Kontroll 1–10':index===0?'Korrutamine 1–10':index===1?'Jagamine 1–10':'Kõik 1–10']])
      ])
    }
  };
});
