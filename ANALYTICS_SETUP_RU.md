# EDUKASS · Plausible Analytics v124

## Что уже встроено

- Plausible site script установлен на всех публичных HTML-страницах.
- Интерфейс сайта и игр для ребёнка не изменён: cookie/consent banner не добавлялся.
- PDF можно считать через встроенную функцию Plausible `File downloads`.
- В тренажёр умножения добавлены только агрегированные события без ответов ребёнка:
  - `Korrutustabel Start`
  - `Korrutustabel Mission Complete`
  - `Korrutustabel Chapter Complete`
  - `Korrutustabel Complete`
- В Koolikoti memomäng добавлены:
  - `Koolikott Start`
  - `Koolikott Complete`
- Добавлена страница `/privaatsus/` и ссылка `Privaatsus` в футерах сайта.

## Что нужно включить в кабинете Plausible

1. Открыть сайт `edukass.ee` в Plausible.
2. Site settings / Site Installation: включить `File downloads`.
3. В Goals добавить Custom event goals с точными именами событий выше.
4. После публикации v124 открыть сайт в обычном браузере, скачать один PDF и запустить обе игры для теста.
5. Проверить в Plausible:
   - pageview для нужной страницы;
   - `File Download`;
   - `Korrutustabel Start`;
   - `Koolikott Start`.

## Что намеренно НЕ отправляется

- имя ребёнка;
- e-mail;
- введённые ответы;
- конкретные ошибки;
- локально сохранённый прогресс;
- какой-либо собственный EDUKASS user ID.

## Важно

События считают действия, а не гарантированно уникальных людей. Например один человек может запустить игру несколько раз. Для оценки аудитории в Plausible отдельно смотри Visitors/Unique visitors и Events.
