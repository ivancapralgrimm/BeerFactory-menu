# DEPLOY

## Production baseline

- Репозиторий: `ivancapralgrimm/BeerFactory-menu`.
- Ветка публикации: `main`.
- Проверенный production baseline перед RC: `31c3fe55e893defb03047ff1a0ab4fe369cbacca`.

## Порядок выпуска

1. Проверить `git diff --check` и синтаксис всех внешних и inline-скриптов.
2. Запустить сайт через HTTP, а не `file://`.
3. Проверить главную с доступной и недоступной NocoDB.
4. Проверить поиск, категории, flip, фото и калькулятор настоек.
5. Проверить загрузку статей, заметки, 15 вопросов аттестации и судоку.
6. Проверить iPhone и Android на узком viewport.
7. Слить release candidate в `main`.
8. Дождаться GitHub Pages и проверить опубликованный commit.

## Rollback

При критической регрессии вернуть GitHub Pages на последний проверенный commit `31c3fe55e893defb03047ff1a0ab4fe369cbacca` через обычный revert-коммит. Не переписывать историю `main`.
