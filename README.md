# 🛠 Ticket System API

Простая система управления обращениями (тикетами) на NestJS с PostgreSQL.

---

## 📌 Возможности

- ✅ Создание обращения с темой и описанием
- 🔄 Перевод обращения в статус:
  - Новый
  - В работе
  - Завершено
  - Отменено
- 📝 Добавление текста решения или причины отмены
- 📅 Фильтрация обращений по дате или диапазону дат
- 🚫 Массовая отмена всех обращений в статусе "В работе"
- 🔍 Swagger UI для удобного тестирования API
- 🧪 Unit-тесты на контроллеры и сервис
- ⚙️ GitHub Actions для автоматического CI

---

## 🚀 Технологии

- **Node.js** / **TypeScript**
- **NestJS**
- **PostgreSQL**
- **TypeORM**
- **Swagger (OpenAPI)**
- **Jest**
- **GitHub Actions**

---

## 🔧 Установка и запуск

```bash
git clone https://github.com/hovgor/ticket-system.git
cd ticket-system
npm install


- **PostgreSQL**
.env.example
удалите example и добавьте ваши данные базы 

- **Swagger (OpenAPI)**
http://localhost:3000/swagger


- **Jest**
npm run test


src/
 ┣ tickets/
 ┃ ┣ dto/                → DTO для создания, обновления и фильтрации обращений
 ┃ ┣ entities/           → TypeORM-сущность Request
 ┃ ┣ request.controller.ts
 ┃ ┣ request.service.ts
 ┃ ┗ request.module.ts
 ┣ app.module.ts
 ┣ main.ts