# TaskMaster API

A robust backend REST API for a collaborative task tracking and management system. Built with Node.js and Express.js, TaskMaster enables teams to create, assign, and track tasks while collaborating through comments and attachments.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication-endpoints)
  - [Users](#user-endpoints)
  - [Tasks](#task-endpoints)
  - [Teams & Projects](#team--project-endpoints)
  - [Comments & Attachments](#comments--attachments-endpoints)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication & Authorization** — JWT-based secure login, registration, and session management
- **Task Management** — Full CRUD operations with filtering, sorting, and search
- **Team Collaboration** — Create/join teams, assign tasks, invite members
- **Comments & Attachments** — Per-task comment threads and file attachment support
- **Input Validation** — Request validation and sanitization on all endpoints
- **Error Handling** — Centralized, consistent error responses
- **Optional: Real-time Notifications** — WebSocket support for live task updates

---

## Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Runtime      | Node.js (v18+)                |
| Framework    | Express.js                    |
| Database     | PostgreSQL (via Sequelize ORM)|
| Auth         | JWT + bcrypt                  |
| Validation   | express-validator             |
| File Uploads | Multer                        |
| Real-time    | Socket.io (optional)          |
| Testing      | Jest + Supertest              |
| Linting      | ESLint + Prettier             |

---

## Project Structure

```
taskmaster/
├── src/
│   ├── config/
│   │   ├── database.js         # Sequelize DB connection
│   │   └── app.js              # Express app setup
│   ├── controllers/
│   │   ├── authController.js   # Register, login, logout
│   │   ├── userController.js   # Profile CRUD
│   │   ├── taskController.js   # Task CRUD + filters
│   │   ├── teamController.js   # Team/project management
│   │   └── commentController.js# Comments & attachments
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   ├── validate.js         # Request validation middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── upload.js           # Multer file upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Team.js
│   │   ├── Comment.js
│   │   └── Attachment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── tasks.js
│   │   ├── teams.js
│   │   └── comments.js
│   ├── services/
│   │   ├── authService.js      # Auth business logic
│   │   ├── taskService.js      # Task business logic
│   │   └── notificationService.js # WebSocket notifications
│   └── utils/
│       ├── logger.js           # Winston logger
│       ├── constants.js        # App-wide constants
│       └── helpers.js          # Utility functions
├── tests/
│   ├── unit/                   # Unit tests per module
│   └── integration/            # End-to-end API tests
├── docs/
│   └── api.md                  # Extended API reference
├── uploads/                    # Uploaded attachment files (gitignored)
├── .env.example                # Environment variable template
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── jest.config.js
├── package.json
└── server.js                   # Application entry point
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) v13 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/taskmaster.git
cd taskmaster

# 2. Install dependencies
npm install

# 3. Copy environment template and fill in your values
cp .env.example .env

# 4. Run database migrations
npm run db:migrate

# 5. (Optional) Seed the database with sample data
npm run db:seed
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmaster_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10

# Optional: WebSocket
ENABLE_WEBSOCKETS=false
```

### Running the Application

```bash
# Development mode (with hot-reload)
npm run dev

# Production mode
npm start

# Run tests
npm test

# Lint code
npm run lint
```

The API will be available at `http://localhost:3000`.

---

## API Documentation

All endpoints are prefixed with `/api/v1`. Protected routes require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

| Method | Endpoint              | Auth | Description             |
|--------|-----------------------|------|-------------------------|
| POST   | `/auth/register`      | ✗    | Register a new user     |
| POST   | `/auth/login`         | ✗    | Login and receive token |
| POST   | `/auth/logout`        | ✓    | Invalidate session      |

**POST /auth/register**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```

**POST /auth/login**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123!"
}
```
Returns: `{ "token": "<jwt>", "user": { ... } }`

---

### User Endpoints

| Method | Endpoint          | Auth | Description              |
|--------|-------------------|------|--------------------------|
| GET    | `/users/me`       | ✓    | Get own profile          |
| PUT    | `/users/me`       | ✓    | Update own profile       |
| DELETE | `/users/me`       | ✓    | Delete own account       |

---

### Task Endpoints

| Method | Endpoint            | Auth | Description                         |
|--------|---------------------|------|-------------------------------------|
| GET    | `/tasks`            | ✓    | List tasks (filterable, searchable) |
| POST   | `/tasks`            | ✓    | Create a new task                   |
| GET    | `/tasks/:id`        | ✓    | Get a single task                   |
| PUT    | `/tasks/:id`        | ✓    | Update a task                       |
| DELETE | `/tasks/:id`        | ✓    | Delete a task                       |
| PATCH  | `/tasks/:id/status` | ✓    | Update task status                  |
| POST   | `/tasks/:id/assign` | ✓    | Assign task to a user               |

**Query Parameters for GET /tasks:**

| Param      | Type   | Description                          |
|------------|--------|--------------------------------------|
| `status`   | string | Filter by `open`, `in_progress`, `completed` |
| `assignee` | uuid   | Filter by assigned user ID           |
| `team`     | uuid   | Filter by team ID                    |
| `search`   | string | Search in title and description      |
| `sortBy`   | string | `dueDate`, `createdAt`, `title`      |
| `order`    | string | `asc` or `desc`                      |
| `page`     | number | Pagination page (default: 1)         |
| `limit`    | number | Items per page (default: 20)         |

---

### Team / Project Endpoints

| Method | Endpoint                    | Auth | Description                  |
|--------|-----------------------------|------|------------------------------|
| GET    | `/teams`                    | ✓    | List user's teams             |
| POST   | `/teams`                    | ✓    | Create a new team             |
| GET    | `/teams/:id`                | ✓    | Get team details             |
| PUT    | `/teams/:id`                | ✓    | Update team (owner only)     |
| DELETE | `/teams/:id`                | ✓    | Delete team (owner only)     |
| POST   | `/teams/:id/invite`         | ✓    | Invite a member              |
| DELETE | `/teams/:id/members/:userId`| ✓    | Remove a member              |

---

### Comments & Attachments Endpoints

| Method | Endpoint                        | Auth | Description              |
|--------|---------------------------------|------|--------------------------|
| GET    | `/tasks/:id/comments`           | ✓    | List comments on a task  |
| POST   | `/tasks/:id/comments`           | ✓    | Add a comment            |
| DELETE | `/tasks/:taskId/comments/:id`   | ✓    | Delete a comment         |
| POST   | `/tasks/:id/attachments`        | ✓    | Upload attachment        |
| DELETE | `/tasks/:taskId/attachments/:id`| ✓    | Delete attachment        |

---

## Database Schema

### Entity Relationship Overview

```
User ─────────────── TeamMember ─────── Team
 │                                        │
 └──── Task (assigned_to / created_by) ───┘
         │
         ├──── Comment (author)
         └──── Attachment
```

Key models: `users`, `tasks`, `teams`, `team_members`, `comments`, `attachments`

See [`docs/api.md`](./docs/api.md) for full schema definitions.

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

Tests live in `tests/unit/` and `tests/integration/`. Each controller and service has a corresponding test file.

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the [Conventional Commits](https://www.conventionalcommits.org/) specification and ensure all tests pass before submitting a PR.

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
