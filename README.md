# MillFlow

MillFlow is a full-stack academic web application for managing grain intake, flour production, warehouse inventory, shipments and reporting in a flour mill enterprise.

The project was created as an educational internship prototype for a Software Engineering student who completed industrial practice at a flour mill company. The system is intentionally designed as a realistic MVP that is easy to explain during code demonstration, report writing and university defense.

## English

### Project Description

MillFlow automates several core flour mill processes:

- grain intake from suppliers
- production batch accounting
- warehouse inventory tracking
- shipment registration
- reporting and dashboard analytics
- multilingual UI in Russian, English and Kazakh
- demo authentication with roles
- audit logging of operational actions

### Internship Context

This repository is suitable for:

- internship report screenshots
- architecture explanation
- database explanation
- CRUD/API demonstration
- university defense presentation

### Technology Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- MongoDB
- Mongoose
- Next.js Route Handlers
- Recharts
- JWT/cookie-based demo authentication

### Main Features

- Dashboard with KPI cards and charts
- Grain Intake module
- Production module
- Warehouse module
- Shipments module
- Reports page
- About Project page
- Audit Log page for admin
- Role-based access control
- MongoDB seed script with realistic milling data

### Multilingual Support

The UI supports:

- `ru` default
- `en`
- `kk`

Language selection is stored in `localStorage` and cookie.

### Folder Structure

```text
app/
app/api/
components/
components/auth/
components/dashboard/
components/forms/
components/layout/
components/modules/
components/providers/
components/ui/
data/
hooks/
lib/
lib/auth/
lib/db/
messages/
models/
scripts/
types/
```

### Environment Variables

Create `.env` based on `.env.example`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/millflow
JWT_SECRET=super_secret_key_for_demo_project
```

### How to Install

1. Install Node.js 18.18+ or newer.
2. Start local MongoDB.
3. Copy `.env.example` to `.env`.
4. Run `npm install`.
5. Run `npm run seed`.
6. Run `npm run dev`.
7. Open `http://localhost:3000`.

### MongoDB Configuration

If you use a local MongoDB server, the default URI from `.env.example` is enough:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/millflow
```

If you use MongoDB Compass or MongoDB Community Server, make sure the database service is running before seeding and starting the app.

### Demo Credentials

- `admin@millflow.local / 123456`
- `operator@millflow.local / 123456`
- `warehouse@millflow.local / 123456`

### Notes For Academic Use

- authentication is intentionally simplified for demonstration
- architecture is clean and not overengineered
- multilingual logic uses simple dictionary files
- database models are easy to explain in a defense presentation
- seed data is realistic for a flour mill domain

## Русская версия

### Описание проекта

MillFlow — учебная full-stack веб-система для автоматизации ключевых процессов мукомольного предприятия: приема зерна, учета производства, складских остатков, отгрузок и отчетности.

Проект разработан в рамках производственной практики студента специальности Software Engineering и предназначен для демонстрации анализа предметной области, проектирования архитектуры, разработки backend/frontend, работы с базой данных MongoDB и реализации CRUD/API-логики.

### Основные возможности

- панель управления с KPI и графиками
- модуль приема зерна
- модуль производства
- модуль склада
- модуль отгрузок
- модуль отчетов
- страница «О проекте»
- журнал действий администратора
- ролевая модель доступа
- интерфейс на русском, английском и казахском языках

### Как запустить локально

1. Установить Node.js 18.18+.
2. Запустить MongoDB локально.
3. Создать файл `.env` по примеру `.env.example`.
4. Выполнить `npm install`.
5. Выполнить `npm run seed`.
6. Выполнить `npm run dev`.
7. Открыть `http://localhost:3000`.

### Демо-учетные записи

- `admin@millflow.local / 123456`
- `operator@millflow.local / 123456`
- `warehouse@millflow.local / 123456`

### Переменные окружения

```env
MONGODB_URI=mongodb://127.0.0.1:27017/millflow
JWT_SECRET=super_secret_key_for_demo_project
```

### Комментарий для учебного использования

Проект представляет собой реалистичный, но управляемый MVP, который удобно объяснять на защите практики: есть понятные сущности базы данных, чистая модульная структура, role-based access, API-маршруты и демонстрационные данные для скриншотов и презентации.
