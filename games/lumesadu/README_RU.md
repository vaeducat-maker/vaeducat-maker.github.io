# LUMESADU — peidetud mänguprototüüp

Staatus: varajane peidetud prototüüp, mitte avalik väljalase.
Kuupäev: 19.09.2026.
Canonical test URL pärast GitHub Pages deployd: https://edukass.ee/games/lumesadu/

## Mida see kaust sisaldab

- index.html — töötav mobile-first prototüüp, kogu UI ja mängutsükkel.
- lumesadu.config.js — sõnavara ja peamised mänguparameetrid.
- LUMESADU_SPEC_RU.md — omaniku kinnitatud toote-, visuaali- ja mehaanikareeglid.
- QA_CHECKLIST_RU.md — kontrollnimekiri enne avalikku väljalaset.
- tests/config.test.cjs — minimaalsed konfiguratsiooni kaitsetestid.

Prototüüp ei ole lisatud avalikku kataloogi, menüüsse ega avaliku materjali lehele.

## Tähtis: “peidetud” ei tähenda “privaatne”

Lehel on robots noindex/nofollow/noarchive/nosnippet ning sellele ei lisata avalikku navigeerimislinki.
See vähendab juhuslikku leidmist, kuid EI ole paroolikaitse ega ligipääsukontroll.
Repo on avalik ja igaüks, kes teab URL-i, võib prototüübi avada.

Kui hiljem on vaja päriselt privaatset testimist, tuleb kasutada eraldi ligipääsukaitset.

## Kinnitatud LUMESADU v1 mehaanika

- Ekraanil on korraga 1 eestikeelne sõna ja 4 pildilist vastusevarianti.
- Rahulik režiim: sõnakaart langeb aeglaselt.
- Vale valik: valitud kaart punaseks.
- Seejärel näidatakse õiget vastust roheliselt.
- Tavavea ajal EI näidata teksti “Proovi uuesti!”.
- Iga viga kasvatab alt ühe jäärea.
- Üks jäärea = TÄPSELT 4 jääkuubikut.
- Vastuste plokk tõuseb koos jääseinaga üles.
- 5. viga = kaotus.
- 5. vea järel: vale punane → õige roheline → viimane jäärea → ekraani kerge värin → jääpragu ja krõbin → sein laguneb → alles siis “Proovi uuesti!”.
- Kaotus ei kasuta teksti “Game over” ega häbistavat tagasisidet.

## MVP sõnavara

lumi, kelk, lumememm, müts, sall, kindad, saapad, uisud, suusad, lumehelves.

Praeguses prototüübis on pildid teadlikult ajutised emoji-kohatäited. Need EI ole lõplik EDUKASS kunst.
Enne avalikku väljalaset tuleb need asendada omaniku kinnitatud originaalillustratsioonidega samas LUMESADU visuaalses keeles.

## Visuaalne suund

LOCKED suund:
- talvine cozy casual-game esteetika;
- sinine / helesinine / türkiis;
- lumi ja jää;
- puidust sildid;
- soojad laternad ja aknavalgus;
- ümarad, käega katsutava muljega nupud;
- kihiline talvine metsamaastik;
- suur selge sõnakaart;
- neli suurt vastusekaarti ühe reana;
- mobile-first püstformaat.

Kolmanda osapoole mängupildid olid ainult meeleolu- ja kvaliteedireferents.
EDUKASS lõplikud tegelased, taustad, kaardid ja muu graafika peavad olema originaalsed, mitte kopeeritud.

## Prototüübi tehniline ülesehitus

Leht on staatiline HTML/CSS/JavaScript ning sobib GitHub Pages + edukass.ee praeguse arhitektuuriga.
Mäng ei vaja serverit, runtime-AI-d ega välist õppeteenust.

Kasutatakse:
- konfigureeritavat sõnavara;
- localStorage'i ainult heli eelistuse jaoks;
- Web Audio API-ga protseduurseid lühikesi helisid;
- Web Share API-d koos clipboard fallbackiga;
- CSS animatsioone;
- prefers-reduced-motion tuge.

Lapse vastuseid, vigu ega lokaalset progressi prototüüp võrku ei saada.

## Seos Korrutustabeli treeneriga

LUMESADU ei kopeeri Korrutustabeli treeneri protected legacy koodi ega mängureegleid.
Ta kasutab samu kasulikke arhitektuuriprintsiipe:
- sisu eraldi konfiguratsioonis;
- üks selge mängutsükkel;
- lokaalne olek;
- heli/mute;
- mobiilne safe-area;
- Share;
- korduvkasutatav mängu shell;
- testitavad konstandid.

Tulevikus saab neist põhimõtetest kujundada ühise EDUKASS Game Core'i, kuid see prototüüp ei refaktori olemasolevaid avalikke mänge.

## Kuidas testida

Telefonis ava:
https://edukass.ee/games/lumesadu/

Kontrolli vähemalt:
1. ALUSTA avab mängu.
2. Ühel real on alati 4 vastusekaarti.
3. Õige vastus muutub roheliseks.
4. Vale muutub punaseks ja seejärel õige roheliseks.
5. Tavavea ajal ei ilmu “Proovi uuesti!”.
6. Pärast iga viga lisandub täpselt 4 kuubikuga jäärea.
7. Vastused tõusevad jääseina kasvades.
8. 5. viga käivitab prao/krõbina ja seina lagunemise.
9. “Proovi uuesti!” ilmub alles kaotusekraanil.
10. Heli saab täielikult välja lülitada.
11. Paus → Jätka taastab mängu.
12. Põhitegevus mahub telefoni viewporti ilma kohustusliku kerimiseta.

## Enne avalikku väljalaset

Ära lisa mängu data/catalog.json-i, avalikku menüüsse ega avalikule mängude lehele enne omaniku eraldi otsust.
Enne avalikustamist tuleb:
- asendada emoji-kohatäited lõplike originaalillustratsioonidega;
- kontrollida eesti keele microcopy;
- otsustada lõplik Rahulik kiirus päris lastega testimise järel;
- kontrollida delayed retry / korduse pedagoogiline loogika;
- teha 390×844, 412×915, 844×390 ja 1440×900 visuaalne QA;
- kontrollida heli ja reduced motion;
- teha eraldi owner visual acceptance;
- alles siis otsustada kataloogi ja avaliku lingi lisamine.

## Canonical dokumendid

Rakendamisel arvestada:
- docs/PROJECT_PASSPORT.md
- docs/ONLINE_GAME_STANDARD.md
- docs/PEDAGOGICAL_CONSTITUTION_RU.md
- docs/CREATIVE_RULES_RU.md
- AGENTS.md

Tootespetsiifilised omaniku kinnitatud LUMESADU otsused on kirjas failis LUMESADU_SPEC_RU.md.
