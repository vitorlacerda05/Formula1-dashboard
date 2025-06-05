# 🏎️ F1 Dashboard API - Developer Guide

## Adding New Routes

This guide shows how to extend the API with new endpoints.

### Example: Adding Driver Routes

1. **Create a new route file** (e.g., `routes/drivers.ts`):

```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { Driver, ApiResponse } from '../@types'

// Mock data - replace with database calls
const mockDrivers: Driver[] = [
  { 
    id: '1', 
    name: 'Max Verstappen', 
    team: 'Red Bull Racing', 
    nationality: 'Dutch', 
    number: 1, 
    points: 575, 
    wins: 19, 
    position: 1 
  },
  // ... more drivers
]

export default async function driverRoutes(fastify: FastifyInstance) {
  // Get all drivers
  fastify.get('/drivers', async (_request: FastifyRequest, _reply: FastifyReply): Promise<ApiResponse<Driver[]>> => {
    try {
      return { success: true, data: mockDrivers }
    } catch (error) {
      fastify.log.error(error)
      throw new Error('Failed to fetch drivers')
    }
  })

  // Get driver by ID
  fastify.get('/drivers/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params
      const driver = mockDrivers.find(d => d.id === id)
      
      if (!driver) {
        reply.status(404).send({ success: false, error: 'Driver not found' })
        return
      }
      
      return { success: true, data: driver }
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to fetch driver' })
    }
  })

  // Create new driver
  fastify.post('/drivers', async (request: FastifyRequest<{ Body: Omit<Driver, 'id'> }>, reply: FastifyReply) => {
    try {
      const newDriver = {
        id: String(mockDrivers.length + 1),
        ...request.body
      }
      mockDrivers.push(newDriver)
      
      reply.status(201).send({ success: true, data: newDriver })
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ success: false, error: 'Failed to create driver' })
    }
  })
}
```

2. **Register the route in `src/index.ts`**:

```typescript
import driverRoutes from '../routes/drivers'

// Register routes
server.register(routes, { prefix: '/api' })
server.register(driverRoutes, { prefix: '/api' }) // Add this line
```

### Example: Adding Custom Types

1. **Create a new type file** (e.g., `@types/circuit.d.ts`):

```typescript
export interface Circuit {
  id: string
  name: string
  location: string
  country: string
  length: number
  turns: number
  lapRecord?: {
    time: string
    driver: string
    year: number
  }
}

export interface CircuitStats {
  circuitId: string
  totalRaces: number
  fastestLap: string
  averageSpeed: number
}
```

2. **Export it in `@types/index.d.ts`**:

```typescript
export * from './circuit' // Add this line
```

## Why Use `.d.ts` Files for Types?

Using `.d.ts` (TypeScript Declaration) files for pure type definitions is the recommended approach:

### **Benefits of `.d.ts` files:**

1. **Performance** - TypeScript compiler processes them faster since they contain no runtime code
2. **Clarity** - Clearly indicates these files contain only type information
3. **Convention** - Standard practice in the TypeScript ecosystem (used by all major libraries)
4. **Separation of Concerns** - Keeps types separate from implementation code
5. **Better IDE Support** - IDEs can optimize type checking and IntelliSense

### **When to use `.d.ts` vs `.ts`:**

- **`.d.ts`** - Pure type definitions, interfaces, type aliases
- **`.ts`** - Implementation code, functions, classes, constants

### **Example: Converting `.ts` to `.d.ts`**

**Before (`types.ts`):**
```typescript
export interface User {
  id: string
  name: string
}

// This would cause issues in a .d.ts file
export const DEFAULT_USER = { id: '', name: '' }
```

**After (`types.d.ts`):**
```typescript
export interface User {
  id: string
  name: string
}

// Remove implementation code - types only!
export declare const DEFAULT_USER: User
```

### **File Structure Best Practice**

```
@types/
├── index.d.ts        # Re-exports all types
├── api.d.ts          # API response types
├── auth.d.ts         # Authentication types
├── driver.d.ts       # Driver entity types
├── team.d.ts         # Team entity types
└── race.d.ts         # Race entity types
```

### Best Practices

1. **Type Files**: Use `.d.ts` files for pure type definitions (faster compilation, clearer intent)
2. **Consistent Error Handling**: Always use try-catch blocks and log errors
3. **Type Safety**: Use TypeScript interfaces for all request/response data
4. **Status Codes**: Use appropriate HTTP status codes
5. **Validation**: Add request validation for POST/PUT endpoints
6. **Documentation**: Update README.md when adding new endpoints

## 🚀 **Complete Workflow Example**

Here's a complete example of adding a new feature to the F1 Dashboard API:

### Step 1: Create Types

**`@types/standings.d.ts`:**
```typescript
export interface ChampionshipStanding {
  position: number
  points: number
  wins: number
  podiums: number
  fastestLaps: number
}

export interface DriverChampionshipStanding extends ChampionshipStanding {
  driverId: string
  driverName: string
  teamName: string
}

export interface TeamChampionshipStanding extends ChampionshipStanding {
  teamId: string
  teamName: string
  nationality: string
}
```

### Step 2: Export Types

**Add to `@types/index.d.ts`:**
```typescript
export * from './standings'
```

### Step 3: Create Route File

**`routes/standings.ts`:**
```typescript
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { DriverChampionshipStanding, TeamChampionshipStanding, ApiResponse } from '../@types'

export default async function standingsRoutes(fastify: FastifyInstance) {
  fastify.get('/standings/drivers', async (_request: FastifyRequest, _reply: FastifyReply): Promise<ApiResponse<DriverChampionshipStanding[]>> => {
    try {
      // Your implementation here
      const standings: DriverChampionshipStanding[] = []
      return { success: true, data: standings }
    } catch (error) {
      fastify.log.error(error)
      throw new Error('Failed to fetch driver standings')
    }
  })
}
```

### Step 4: Register Routes

**In `src/index.ts`:**
```typescript
import standingsRoutes from '../routes/standings'

// Register routes
server.register(routes, { prefix: '/api' })
server.register(standingsRoutes, { prefix: '/api' })
```

## ✅ **Final Summary**

Your F1 Dashboard API now has:

- ✅ **Proper `.d.ts` type files** - Better performance and conventions
- ✅ **Clean authentication base** - Ready for extension
- ✅ **Organized structure** - Easy for developers to understand
- ✅ **TypeScript configuration** - Properly set up for the project structure
- ✅ **Developer documentation** - Clear examples and best practices

The API is now perfectly set up as a base for other developers to branch from and build upon!
