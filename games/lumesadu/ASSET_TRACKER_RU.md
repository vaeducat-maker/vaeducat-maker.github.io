# LUMESADU — ASSET TRACKER v1

Статус: рабочий трекер визуального производства.
Дата: 20.09.2026.
Visual Master: утверждённый экран LUMESADU из рабочего диалога владельца.
Цель: заменить технический prototype visual на финальный собственный EDUKASS/LUMESADU art layer без изменения LOCKED-механики.

## Легенда статусов

- LOCKED — визуальное направление утверждено владельцем.
- PLACEHOLDER — в прототипе есть временная техническая замена.
- TO CREATE — ассет надо создать.
- READY FOR INTEGRATION — ассет готов к установке в игру.
- INTEGRATED — ассет установлен в живой прототип.
- OWNER CHECK — требуется визуальная приёмка владельцем.

## P0 — основной игровой экран

| Asset | Путь | Приоритет | Статус | Сейчас в прототипе | Где используется |
|---|---|---:|---|---|---|
| Главный зимний фон | assets/bg/bg-main-winter-scene.webp | P0 | TO CREATE | CSS-пейзаж | весь игровой экран |
| Логотип LUMESADU | assets/ui/logo-lumesadu.webp | P0 | TO CREATE | CSS-текст | верхний центр |
| Табличка Leia õige pilt | assets/ui/wood-sign-title.webp | P0 | TO CREATE | CSS-плашка | под логотипом |
| Карточка падающего слова | assets/ui/word-snowflake-card.webp | P0 | TO CREATE | CSS-ледяная плитка | центр экрана |
| Базовая карточка ответа | assets/ui/answer-card-ice.webp | P0 | TO CREATE | CSS-card | 4 ответа в ряд |
| Кубик ледяной стены | assets/fx/ice-cube.webp | P0 | TO CREATE | CSS-cube | 4 кубика в каждом ряду |
| Кнопка Pause | assets/ui/btn-pause-purple.webp | P0 | TO CREATE | CSS-кнопка | левый верх |
| Табличка прогресса | assets/ui/progress-board.webp | P0 | TO CREATE | CSS wood | 1 / 10 |
| Плашка Rahulik | assets/ui/mode-pill-rahulik.webp | P0 | TO CREATE | CSS pill | правый верх |
| Звезда | assets/ui/icon-star-gold.webp | P0 | TO CREATE | отсутствует / упрощено | верхний HUD |

## P0 — первые 10 слов

| Asset | Путь | Приоритет | Статус | Сейчас | Требование |
|---|---|---:|---|---|---|
| lumi | assets/items/lumi.webp | P0 | TO CREATE | emoji | снег как явление/среда, не одна снежинка |
| kelk | assets/items/kelk.webp | P0 | TO CREATE | emoji | однозначные санки |
| lumememm | assets/items/lumememm.webp | P0 | TO CREATE | emoji | один дружелюбный снеговик |
| müts | assets/items/myts.webp | P0 | TO CREATE | emoji | зимняя шапка |
| sall | assets/items/sall.webp | P0 | TO CREATE | emoji | один шарф |
| kindad | assets/items/kindad.webp | P0 | TO CREATE | emoji | пара зимних варежек |
| saapad | assets/items/saapad.webp | P0 | TO CREATE | emoji | пара зимних сапог |
| uisud | assets/items/uisud.webp | P0 | TO CREATE | emoji | пара коньков |
| suusad | assets/items/suusad.webp | P0 | TO CREATE | emoji | лыжи, при необходимости палки |
| lumehelves | assets/items/lumehelves.webp | P0 | TO CREATE | emoji | одна крупная снежинка, явно не lumi |

## P1 — состояния ответа

| Asset / state | Реализация | Приоритет | Статус | Правило |
|---|---|---:|---|---|
| answer default | base asset + CSS | P1 | PLACEHOLDER | спокойная ледяная карточка |
| answer pressed | CSS transform / shadow | P1 | PLACEHOLDER | короткий tactile feedback |
| answer wrong | red overlay / glow | P1 | PLACEHOLDER | красным только неверный выбор |
| answer correct | green overlay / glow + check | P1 | PLACEHOLDER | зелёный визуально сильнее |
| disabled | CSS | P1 | PLACEHOLDER | taps блокируются до конца feedback |

## P1 — финальные экраны

| Asset | Путь | Приоритет | Статус | Сейчас |
|---|---|---:|---|---|
| Success panel | assets/ui/panel-success.webp | P1 | TO CREATE | CSS modal |
| Loss panel | assets/ui/panel-loss.webp | P1 | TO CREATE | CSS modal |
| Primary button | assets/ui/btn-primary.webp | P1 | TO CREATE | CSS button |
| Secondary button | assets/ui/btn-secondary.webp | P1 | TO CREATE | CSS button |
| Success decoration | assets/ui/success-decoration.webp | P1 | TO CREATE | emoji |
| Loss decoration | assets/ui/loss-decoration.webp | P1 | TO CREATE | emoji |

## P1 — проигрыш / FX

| Asset | Путь | Приоритет | Статус | Сейчас |
|---|---|---:|---|---|
| Crack overlay | assets/fx/ice-crack-overlay.webp | P1 | TO CREATE | CSS lines |
| Ice shard 1 | assets/fx/ice-shard-1.webp | P1 | TO CREATE | CSS cube fragments |
| Ice shard 2 | assets/fx/ice-shard-2.webp | P1 | TO CREATE | CSS cube fragments |
| Ice shard 3 | assets/fx/ice-shard-3.webp | P1 | TO CREATE | CSS cube fragments |
| Rumble animation | CSS/JS | P1 | PLACEHOLDER | уже работает |
| Crack sound | procedural / local audio | P1 | PLACEHOLDER | уже есть процедурный |
| Collapse animation | CSS/JS | P1 | PLACEHOLDER | уже работает |

## P2 — служебные иконки

| Asset | Путь | Приоритет | Статус |
|---|---|---:|---|
| Sound on | assets/ui/icon-sound-on.webp | P2 | TO CREATE |
| Sound off | assets/ui/icon-sound-off.webp | P2 | TO CREATE |
| Home | assets/ui/icon-home.webp | P2 | TO CREATE |
| Retry | assets/ui/icon-retry.webp | P2 | TO CREATE |
| Play | assets/ui/icon-play.webp | P2 | TO CREATE |
| Share | assets/ui/icon-share.webp | P2 | TO CREATE |

## LOCKED требования ко всем изображениям

1. Один визуальный язык для всего LUMESADU.
2. Полированная winter casual-game эстетика.
3. Мягкая голубая / бирюзовая палитра + тёплое дерево и огни.
4. Объёмные округлые формы.
5. Никаких emoji в финальной версии.
6. Никаких фотоколлажей.
7. Никакого копирования сторонних персонажей/артов.
8. Предметные картинки максимально однозначны.
9. В ряд всегда помещаются 4 answer cards.
10. Каждый ряд стены состоит ровно из 4 ледяных кубиков.
11. Финальные ассеты должны хорошо выглядеть на 390×844 и 412×915.

## Порядок производства

### Sprint A — visual identity
1. bg-main-winter-scene.webp
2. logo-lumesadu.webp
3. wood-sign-title.webp
4. word-snowflake-card.webp
5. progress-board.webp
6. btn-pause-purple.webp
7. mode-pill-rahulik.webp

Критерий завершения: верх и центр экрана уже воспринимаются как утверждённый Visual Master.

### Sprint B — gameplay objects
1. answer-card-ice.webp
2. ice-cube.webp
3. 10 item illustrations

Критерий завершения: основной игровой экран больше не содержит emoji/сырого CSS-art.

### Sprint C — feedback & ending
1. panel-success.webp
2. panel-loss.webp
3. crack overlay
4. ice shards
5. final buttons/icons

Критерий завершения: success и defeat выглядят частью той же игры.

## Правило интеграции

Каждый новый ассет:
1. сначала создаётся;
2. проверяется визуально отдельно;
3. устанавливается в hidden prototype;
4. проверяется на телефоне;
5. только после owner approval получает статус INTEGRATED / LOCKED.

Не менять механику во время asset-reskin, если это не нужно для корректного отображения.

## Ближайший следующий шаг

Начать Sprint A:
- главный зимний фон;
- логотип;
- деревянная табличка;
- карточка слова.

После их интеграции сделать первый owner-check на реальном телефоне.
