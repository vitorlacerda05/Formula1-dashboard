# F1 Dashboard API

A simple RESTful API for managing Formula 1 data. This is a base implementation with authentication routes for other developers to build upon.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── @types/           # Type definitions (.d.ts files)
│   ├── index.d.ts    # Re-exports all types
│   ├── auth.d.ts     # Authentication types
│   ├── api.d.ts      # API response types
│   ├── driver.d.ts   # Driver-related types
│   ├── team.d.ts     # Team-related types
│   └── race.d.ts     # Race-related types
├── routes/
│   └── index.ts      # Main routes file
└── src/
    └── index.ts      # Server entry point
```

## API Endpoints

### Health Check
- `GET /` - Basic health check
- `GET /api/health` - API health check

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Authentication

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@f1dashboard.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "mock-jwt-token-12345",
  "user": {
    "id": "1",
    "email": "admin@f1dashboard.com",
    "name": "Admin User"
  }
}
```

### Logout
**POST** `/api/auth/logout`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

## Type Definitions

All types are organized in the `@types` folder as `.d.ts` files:

- **auth.d.ts** - Authentication-related types
- **api.d.ts** - Generic API response types
- **driver.d.ts** - Driver and driver standings types
- **team.d.ts** - Team and team standings types
- **race.d.ts** - Race-related types

Import types like this:
```typescript
import { LoginRequest, Driver, Team } from '../@types'
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development Notes

This is a base implementation. Other developers can:

1. **Add new routes** - Create new route handlers in the routes folder
2. **Extend types** - Add new type definitions in the @types folder
3. **Add middleware** - Implement authentication, validation, etc.
4. **Add database** - Replace mock authentication with real database
5. **Add more endpoints** - Drivers, teams, races, standings, etc.

## Next Steps for Developers

1. Create separate route files for different entities (drivers, teams, races)
2. Implement proper JWT authentication
3. Add database integration (PostgreSQL, MongoDB, etc.)
4. Add request validation middleware
5. Add comprehensive error handling
6. Add API documentation with Swagger/OpenAPI
