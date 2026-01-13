# Устранение проблем с аутентификацией

## Ошибка "Server error" после входа

Если после входа через Google появляется ошибка "Server error", проверьте следующее:

### 1. Переменные окружения

Убедитесь, что в `.env` файле есть все необходимые переменные:

```env
DATABASE_URL="..."
AUTH_SECRET="..."  # Должен быть установлен
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

### 2. База данных

Убедитесь, что таблицы для Auth.js созданы:

```bash
npm run db:push
```

Проверьте, что в базе данных есть таблицы:
- `users`
- `accounts`
- `sessions`
- `verification_tokens`

### 3. Google OAuth настройки

В Google Cloud Console проверьте:
- **Authorized redirect URIs** должен включать:
  - `http://localhost:3000/api/auth/callback/google` (для разработки)
  - `https://yourdomain.com/api/auth/callback/google` (для продакшена)

### 4. Перезапуск сервера

После изменения `.env` файла обязательно перезапустите dev сервер:

```bash
# Остановите сервер (Ctrl+C)
# Запустите заново
npm run dev
```

### 5. Проверка логов

Проверьте логи в терминале, где запущен `npm run dev`. Там должны быть детали ошибки.

### 6. Проверка консоли браузера

Откройте DevTools (F12) и проверьте вкладку Console на наличие ошибок.

## Частые проблемы

### Проблема: "Invalid redirect_uri"

**Решение**: Убедитесь, что в Google Cloud Console добавлен правильный redirect URI:
- `http://localhost:3000/api/auth/callback/google` для локальной разработки

### Проблема: "Database error" или "Adapter error"

**Решение**: 
1. Проверьте подключение к базе данных (`DATABASE_URL`)
2. Убедитесь, что миграции применены: `npm run db:push`
3. Проверьте, что Prisma Client сгенерирован: `npx prisma generate`

### Проблема: "AUTH_SECRET is missing"

**Решение**: 
1. Сгенерируйте секрет: `openssl rand -base64 32`
2. Добавьте в `.env`: `AUTH_SECRET="ваш_секрет"`
3. Перезапустите сервер

## Проверка работоспособности

1. Откройте `http://localhost:3000/login`
2. Нажмите "Войти через Google"
3. Выберите аккаунт Google
4. Должен произойти редирект на `/dashboard`

Если проблема сохраняется, проверьте логи сервера для детальной информации об ошибке.
