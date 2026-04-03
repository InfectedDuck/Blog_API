# Blog CMS API

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A RESTful Blog CMS API built with **NestJS** and **TypeScript**, featuring JWT authentication, role-based access control, full-text search, pagination, and auto-generated Swagger documentation.

## Features

- **Authentication** - Register, login, JWT-based auth with 7-day token expiry
- **Role-Based Access Control** - Three roles: `admin`, `author`, `reader` with granular permissions
- **Posts** - Full CRUD with draft/published workflow, auto-generated slugs, and tag associations
- **Comments** - Nested under posts, with ownership-based edit/delete permissions
- **Tags** - Categorize posts, filter by tag slug
- **Search** - Full-text search across post titles and content
- **Pagination** - All list endpoints return paginated responses with metadata
- **Swagger Docs** - Interactive API documentation at `/api/docs`
- **Validation** - Request validation with detailed error messages
- **Testing** - Unit tests + end-to-end tests with in-memory database

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **NestJS** | Backend framework with DI, modules, guards, interceptors |
| **TypeScript** | Type-safe development |
| **TypeORM** | Database ORM with decorator-based entities |
| **SQLite** | Zero-config embedded database (via better-sqlite3) |
| **Passport + JWT** | Authentication strategy |
| **Swagger** | Auto-generated API documentation |
| **Jest** | Unit and e2e testing |
| **GitHub Actions** | CI pipeline |

## Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd blog-cms-api

# Install dependencies
npm install

# Start the server
npm run start:dev
```

The API will be running at `http://localhost:3000`. Open `http://localhost:3000/api/docs` for interactive Swagger documentation.

### Environment Variables (optional)

Copy `.env.example` to `.env` and customize:

```bash
JWT_SECRET=your-secret-key    # Default: 'default-secret-change-me'
PORT=3000                      # Default: 3000
```

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login, returns JWT |
| `GET` | `/api/auth/profile` | Auth | Get current user profile |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/users` | Admin | List all users (paginated) |
| `GET` | `/api/users/:id` | Admin | Get user by ID |
| `PATCH` | `/api/users/:id/role` | Admin | Update user role |

### Posts
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/posts` | Public | List posts (paginated, searchable) |
| `GET` | `/api/posts/:slug` | Public | Get post by slug |
| `POST` | `/api/posts` | Author/Admin | Create a post |
| `PATCH` | `/api/posts/:id` | Owner/Admin | Update a post |
| `DELETE` | `/api/posts/:id` | Owner/Admin | Delete a post |

**Query parameters** for `GET /api/posts`:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search in title and content
- `tag` - Filter by tag slug
- `authorId` - Filter by author ID
- `status` - Filter by draft/published (admin/author only)

### Comments
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/posts/:postId/comments` | Public | List comments (paginated) |
| `POST` | `/api/posts/:postId/comments` | Auth | Create a comment |
| `PATCH` | `/api/comments/:id` | Owner/Admin | Update a comment |
| `DELETE` | `/api/comments/:id` | Owner/Admin | Delete a comment |

### Tags
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/tags` | Public | List all tags |
| `POST` | `/api/tags` | Admin | Create a tag |
| `DELETE` | `/api/tags/:id` | Admin | Delete a tag |

## Authentication

1. Register a new user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "username": "john", "password": "secret123"}'
```

2. Use the returned `accessToken` in subsequent requests:
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

## Project Structure

```
src/
  main.ts                    # App bootstrap, Swagger setup, global pipes
  app.module.ts              # Root module with TypeORM and feature modules
  common/
    decorators/              # @CurrentUser(), @Roles() decorators
    guards/                  # JWT auth guard, roles guard, optional auth guard
    dto/                     # Shared pagination DTO
  auth/                      # Auth module (register, login, JWT strategy)
  users/                     # Users module (admin user management)
  posts/                     # Posts module (CRUD, search, pagination)
  comments/                  # Comments module (nested under posts)
  tags/                      # Tags module (CRUD)
test/                        # E2E tests
```

## Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Design Decisions

- **SQLite** was chosen for zero-setup portability. The TypeORM abstraction makes switching to PostgreSQL trivial by changing the `TypeOrmModule` configuration.
- **Role-based access** is implemented via a custom `@Roles()` decorator and `RolesGuard`, keeping authorization logic declarative and centralized.
- **Slug-based post URLs** are auto-generated from titles with collision handling, simulating real-world SEO-friendly routing.
- **Optional JWT guard** allows the posts listing endpoint to serve public (published-only) and authenticated (all statuses) responses from the same route.

## License

MIT
