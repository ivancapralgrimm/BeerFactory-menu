# BeerFactory-menu
# BeerFactory menu

Временная статическая версия будущего портала BeerFactory.

## Текущее состояние

- Production: GitHub Pages из ветки `main`, commit `31c3fe55e893defb03047ff1a0ab4fe369cbacca`.
- Подготовлено: stabilization RC — исправления отказоустойчивости без смены интерфейса и удаления функций.
- Source of truth для меню: две таблицы NocoDB.
- Source of truth для обучения и аттестации: `training-data.txt` и `questions.txt` в репозитории.
- Локально на устройстве хранятся только личные заметки и прогресс судоку.

## Локальный запуск

Открывать HTML через `file://` нельзя: браузер заблокирует загрузку текстовых файлов. Запускайте локальный HTTP-сервер:

```bash
python -m http.server 4173
```

Затем откройте `http://127.0.0.1:4173/`.

## Страницы

- `index.html` — меню и ТТК;
- `training.html` — база знаний;
- `attestation.html` — аттестация;
- `sudoku.html` — дополнительная игра.

Архитектура и состояние работ описаны в `PROJECT_SPEC.md` и `TASKS.md`.
