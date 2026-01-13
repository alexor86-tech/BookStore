# Быстрое решение проблемы "Configuration error"

## Проблема
После входа через Google появляется ошибка "Configuration error" или "Server error".

## Решение

### 1. Убедитесь, что переменные окружения загружены

Перезапустите dev сервер после изменения `.env`:

```bash
# Остановите сервер (Ctrl+C)
npm run dev
```

### 2. Проверьте, что все переменные установлены

В `.env` должны быть:
```env
AUTH_SECRET="ваш_секрет"
GOOGLE_CLIENT_ID="ваш_client_id"
GOOGLE_CLIENT_SECRET="ваш_client_secret"
DATABASE_URL="ваш_database_url"
```

### 3. Проверьте Google OAuth настройки

В [Google Cloud Console](https://console.cloud.google.com/):
- Credentials → ваш OAuth 2.0 Client ID
- **Authorized redirect URIs** должен содержать:
  ```
  http://localhost:3000/api/auth/callback/google
  ```

### 4. Проверьте базу данных

Убедитесь, что таблицы созданы:
```bash
npm run db:push
```

### 5. Очистите кэш и перезапустите

```bash
# Очистите .next кэш
rm -rf .next

# Перезапустите сервер
npm run dev
```

### 6. Проверьте логи

В терминале, где запущен `npm run dev`, должны быть детали ошибки. Ищите строки с `[auth]` или `error`.

## Если проблема сохраняется

1. Проверьте, что `AUTH_SECRET` не пустой и не содержит пробелов
2. Убедитесь, что `GOOGLE_CLIENT_SECRET` правильный (не истек)
3. Проверьте подключение к базе данных: `npm run db:test` (если есть такой скрипт)
4. Попробуйте сгенерировать новый `AUTH_SECRET`:
   ```bash
   openssl rand -base64 32
   ```
