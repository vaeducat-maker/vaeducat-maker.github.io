# EDUKASS — текущая техническая сводка

EDUKASS — статический образовательный сайт на домене `edukass.ee`.
Основная ветка репозитория — `main`.

## Основная математическая игра

`Korrutustabeli treener` находится в `games/korrutamine-test/`.
Игра содержит 16 глав и 252 миссии. Учебная конфигурация, прогресс, интерфейс,
локализация, визуальные миры и проверки хранятся внутри этой папки и связанных
документов проекта.

## Опубликованные материалы

Актуальный реестр опубликованных материалов хранится в `data/catalog.json`.
В него входят:

- `Minu suvi`;
- `Pildidetektiiv: Kes siin töötab?`;
- `Ristsõnad: Sügis`;
- `Metsloomad`;
- `Mis on koolikotis?`;
- `Minu tänased ülesanded`;
- `Minu tunniplaan`;
- `Lõika! Kosmoserada`;
- `Korrutustabel`;
- `Ümbermõõt ja pindala` — бесплатный печатный материал: A7-kaart и A4-leht nelja kaardiga.

Для `Ümbermõõt ja pindala` сохраняются только опубликованная страница материала,
превью и два PDF-файла для печати.

## Структура репозитория

- `materials/` — страницы материалов и мобильные workbook;
- `downloads/` — публичные PDF-файлы;
- `games/` — действующие браузерные игры;
- `assets/` — публичные изображения и превью;
- `data/catalog.json` — единый реестр публичных материалов;
- `docs/` — постоянные правила и стандарты проекта;
- `brand/` — визуальные стандарты и reference-файлы;
- `scripts/` — аудит, сборка и защита каталога.

## Основные документы

Перед существенной работой с проектом используются:

- `AGENTS.md`;
- `docs/PROJECT_PASSPORT.md`;
- `docs/ONLINE_GAME_STANDARD.md`;
- `docs/PEDAGOGICAL_CONSTITUTION_RU.md`;
- `docs/WORKBOOK_VISUAL_STANDARD.md`;
- `docs/AI_WORKFLOW.md`.

## Проверка проекта

Базовая техническая проверка запускается командой:

```bash
node scripts/audit-project.js
```

Публичная сборка формируется через `scripts/build-public-site.js` и проверяет
разрешённый список файлов, локальные ссылки, каталог, manifest и service worker.

Текущий реестр материалов соответствует выпуску `v124`.
