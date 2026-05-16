# Публикация на npmjs.org
- `npm whoami` - если не залогинен `npm login` 
- в https://www.npmjs.com/settings/alezhu/tokens/ выпускаем токен с Bypass 2FA и Read and Write на пакет
- в package.json в команде **npmjs:deploy** заменяем **&lt;token>** на сгенерированный токен
- `npmjs:deploy`
