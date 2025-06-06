## Что нужно для запуска билда

1. скачать node.js https://nodejs.org/dist/v22.16.0/node-v22.16.0-x64.msi lts
2. установить node.js
3. выполнить команду в терминале `npm install -g pnpm@latest-10`
4. выполнить команду в терминале `pnpm i`
5. собрать проект `pnpm build`
6. билд будет доступен в папке `dist`

## Что нужно для смены конфига

1. открываем файл `config.json` в `public\config.json`
2. меняем id групп
3. `type` может быть `"subscribe" | "messages"`. `subscribe` - подписаться. `messages` - разрешить сообщения от группы
