# Finance Dashboard Backend

Production-ready Node.js backend for a Finance Dashboard with JWT auth, RBAC, records management, and analytics.

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- Input validation with express-validator
- Rate limiting with express-rate-limit
- API docs with Swagger
- Unit testing with Jest + Supertest

## Project Structure

```text
.
├── app.js
├── server.js
├── package.json
├── .env.example
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── validators
└── tests
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` values:

```env
PORT=5001
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

4. Run in development:

```bash
npm run dev
```

5. Run tests:

```bash
npm test
```

## API Base URL

`http://localhost:5001`

## API Documentation

Swagger UI:

- `GET /api/docs`

## Authentication

Use JWT token in header:

```http
Authorization: Bearer <token>
```

## Roles & Access

- Viewer: can access dashboard summary only
- Analyst: can read records and view dashboard
- Admin: full access (users + records + dashboard)

## Endpoints List

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### User Management (Admin only)

- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `PATCH /api/users/:id/status`

### Records

- `POST /api/records` (Admin)
- `GET /api/records` (Admin, Analyst)
- `GET /api/records/:id` (Admin, Analyst)
- `PATCH /api/records/:id` (Admin)
- `DELETE /api/records/:id` (Admin, soft delete)

### Dashboard

- `GET /api/dashboard/summary` (Viewer, Analyst, Admin)

## Record Filters

`GET /api/records` supports:

- `type=income|expense`
- `category=food`
- `startDate=YYYY-MM-DD`
- `endDate=YYYY-MM-DD`
- `page=1`
- `limit=10`
- `search=keyword`

Example:

```http
GET /api/records?type=expense&category=food&startDate=2026-01-01&endDate=2026-03-31&page=1&limit=10&search=lunch
```

## Sample Responses

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Something went wrong"
}
```

## Example Requests

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Record (Admin)

```http
POST /api/records
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "amount": 2500,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "Monthly salary"
}
```

### Dashboard Summary

```http
GET /api/dashboard/summary
Authorization: Bearer <token>
```

## Assumptions Made

- Single organization system
- No multi-tenant support
- Category is free text
- All non-auth routes require authentication
- Public registration creates users as Viewer by default for security

## Tradeoffs

- Soft delete is implemented for records only to preserve transaction history
- `GET /api/users` currently returns all users without pagination for admin simplicity
- Unit tests included as baseline smoke test; deeper service/controller tests can be expanded

## Production Notes

- Set a strong `JWT_SECRET`
- Add HTTPS and reverse proxy in production
- Configure MongoDB indexes based on real workloads
- Add CI pipeline with test + lint + security scanning
