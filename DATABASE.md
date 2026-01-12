## Что есть в системе (сущности):

Note - заметки
User — владелец названий и описаний Book, автор, голосующий
Book — сама книга (может быть приватным или публичным)
Tag — метки (многие-ко-многим с Book)
Vote — голос пользователя за публичный Book (уникально: один пользователь → один голос на book)
(опционально) Collection / Folder — папки/коллекции для организации
(опционально) BookVersion — версии Book (история изменений)

## Ключевые правила:

- Публичность — это свойство Book (visibility)
- Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, bookId) — уникальный индекс

## Схема базы данных
- Note: id, ownerId -> User, title, createdAt
- User: id (cuid), email unique, name optional, createdAt
- Book: id, ownerId -> User, title, content, description optional, categoryId -> Category,
  visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
- Vote: id, userId -> User, bookId -> Book, value int default 1, createdAt
- Category: id, category
- Ограничение: один пользователь может проголосовать за Book только один раз:
  UNIQUE(userId, bookId)
- Индексы:
  Book(ownerId, updatedAt)
  Book(visibility, createdAt)
  Vote(bookId)
  Vote(userId)
- onDelete: Cascade для связей
