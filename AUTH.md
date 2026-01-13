# Аутентификация через Google OAuth

Проект использует Auth.js (NextAuth.js) для аутентификации через Google OAuth.

## Настройка

1. **Переменные окружения** - см. `ENV_SETUP.md`
2. **База данных** - выполните миграцию:
   ```bash
   npm run db:push
   ```

## Использование

### Страницы

- `/login` - страница входа через Google
- `/dashboard` - личный кабинет (защищено)
- `/my-prompts` - список промтов пользователя (защищено)

### Server Components

Используйте функции из `@/lib/auth-server`:

```typescript
import { getCurrentUser, requireAuth } from "@/lib/auth-server"

// Получить текущего пользователя (может быть null)
const user = await getCurrentUser()

// Требовать авторизацию (выбросит ошибку, если не авторизован)
const user = await requireAuth()
```

### API Routes

Пример защищенного API роута:

```typescript
import { requireAuth } from "@/lib/auth-server"

export async function GET(request: NextRequest)
{
    const user = await requireAuth()
    // user.id - стабильный userId пользователя
    // ...
}
```

### Client Components

Используйте хуки из `next-auth/react`:

```typescript
"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export function MyComponent()
{
    const { data: session } = useSession()
    // session?.user.id - userId пользователя
}
```

## Защита маршрутов

Маршруты защищены через `middleware.ts`:
- `/dashboard/*`
- `/my-prompts/*`

Неавторизованные пользователи автоматически перенаправляются на `/login`.

## Модель User

После первого входа через Google пользователь автоматически создается в БД:

```prisma
model User {
    id        String   @id @default(cuid())
    email     String   @unique
    name      String?
    image     String?
    createdAt DateTime @default(now())
    // ...
}
```

## Связь данных с пользователем

Все Book связаны с пользователем через `ownerId`:

```typescript
const book = await prisma.book.create({
    data: {
        title: "My Book",
        content: "...",
        ownerId: user.id, // userId из сессии
        // ...
    },
})
```

Приватные книги (`visibility: PRIVATE`) доступны только владельцу.
