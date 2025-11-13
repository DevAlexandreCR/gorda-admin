# Gorda Admin - AI Coding Agent Instructions

## Architecture Overview

This is a Vue 3 + TypeScript admin dashboard for the **Gorda** ride-sharing platform. The app manages drivers, users, places, services, and WhatsApp integrations through a hybrid Firebase/external API architecture.

### Core Data Flow
- **Firebase Realtime Database**: Core entities (drivers, users, places, clients)
- **Firestore**: Services collection with pagination, WhatsApp chats/messages
- **External REST API**: Privileged operations (`VUE_APP_GORDA_API_URL`)
- **Socket.IO**: Real-time WhatsApp client management (`VUE_APP_WP_CLIENT_API_URL`)

## Development Environment

### Local Development Setup
```bash
npm run serve  # Starts on port 5000
npm run start:emulators  # Firebase emulators with data import/export
```

**Critical**: Environment automatically connects Firebase emulators in non-production mode via `src/services/Firebase.ts`. Copy `.env.example` to `.env.local` and adjust Firebase config.

### Firebase Emulator Ports
- Auth: 9099, Database: 9000, Firestore: 8080, Storage: 9199, Functions: 5001

## Key Architectural Patterns

### Repository Pattern
All data access goes through repositories in `src/repositories/`:
- **Real-time listeners**: Use `onChildAdded`, `onChildRemoved` for live updates
- **Firestore queries**: Complex pagination with cursors in `ServiceRepository.getPaginated()`
- **Dual storage**: Some entities span both RTDB and Firestore (services)

Example:
```typescript
// Real-time Database pattern
onChildAdded(DBService.dbDrivers(), (snapshot) => {
  // Handle live driver updates
})

// Firestore pagination pattern  
query(collection, orderBy('created_at', 'desc'), startAfter(cursor), limit(perPage))
```

### State Management (Pinia)
Stores in `src/services/stores/` follow consistent patterns:
- Repository injection for data operations
- Real-time listener setup in actions
- Computed getters for filtering/searching
- `CacheStore` for performance optimization

### Service Layer Architecture
- `DBService`/`FSService`: Database connection abstractions
- `AuthService`: Firebase Auth + role-based access (`roles.admin`, `roles.operator`)
- `StorageService`: File uploads with predefined paths
- `WhatsAppClient`: Socket.IO singleton with observer pattern

## Component Conventions

### Vue Components
- Use Composition API exclusively (`<script setup lang="ts">`)
- Props/emits with TypeScript interfaces from `src/types/`
- Bootstrap 5 CSS framework - avoid custom styling
- Internationalization via `src/plugins/i18n.ts` with locale files in `src/assets/locales/`

### Route Guards
Authentication handled by `src/router/guards/`:
- `AuthGuard`: Checks `meta.requireRole` + user roles
- Role hierarchy: `admin` > `operator` (see `AuthService.isAdmin()`)

## Critical Environment Variables

```bash
# Firebase Configuration
VUE_APP_PROJECT_ID=gorda-driver
VUE_APP_DATABASE_URL=http://127.0.0.1:9000/?ns=gorda-driver-default-rtdb

# External Services  
VUE_APP_GORDA_API_URL=http://localhost:5001/gorda-driver/us-central1/api
VUE_APP_WP_CLIENT_API_URL=http://localhost
VUE_APP_WP_CLIENT_API_PORT=3000

# WhatsApp Business API (production)
VUE_APP_FACEBOOK_APP_ID=1655291151818452
VUE_APP_WHATSAPP_CONFIG_ID=1155273606054653
```

## WhatsApp Integration Specifics

Complex Socket.IO-based WhatsApp client management:
- `WhatsAppClient.ts`: Singleton per client with observer pattern
- QR code authentication flow for new connections
- Real-time message handling through Firestore collections
- Interactive message builder with validation rules (20 char button limit)
- **Coexistence mode**: Multiple WhatsApp numbers on same business account

## Testing & Quality

### Test Configuration
- Jest with Vue Test Utils, jsdom environment
- Coverage collection from `src/**/*.{js,vue,ts}` (excludes assets, vendor)
- Test files: `tests/unit/**/*.spec.{j,t}s`
- Setup files: `jest.setup.js`, `tests/testSetup.ts`

### Code Quality
- ESLint with Vue 3 + TypeScript rules
- `/* istanbul ignore next */` for Firebase operations in repositories
- Sentry error tracking with Vue router instrumentation

## TypeScript Patterns

### Model/Type Separation
- **Models** (`src/models/`): Classes with methods and computed properties
- **Types** (`src/types/`): Pure interfaces for data transfer
- **Constants** (`src/constants/`): Enums and static configurations

### Common Interfaces
- `*Interface` types for data structures
- `*RequestType`/`*Response` for API communications
- Repository methods return Promise wrappers for Firebase operations

## Build & Deployment

- **Development**: `npm run build:dev` (watch mode available)
- **Production**: `npm run build` → `dist/` directory
- **Firebase Deploy**: Uses `firebase.json` configuration
- **Functions**: External serverless functions in sibling `../functions` directory

## Integration Points

### External API Patterns
- `src/services/gordaApi/`: API clients for external services
- `UserRepository.createUser()`: Hybrid Firebase Auth + external API calls
- Error handling with Axios interceptors and toast notifications

### Mobile App Coordination
Shared Firebase data with mobile driver app (separate repository):
- Driver location tracking via `online_drivers` RTDB path
- Service assignment through `drivers_assigned` collection
- Real-time status updates across platforms