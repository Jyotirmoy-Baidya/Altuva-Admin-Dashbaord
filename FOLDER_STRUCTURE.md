# Admin Dashboard Folder Structure

This document explains the folder structure of the Altuva Admin Dashboard.

```
src/
├── apis/               # API calls and HTTP requests
│   └── adminApi.ts    # Admin authentication and user management APIs
│
├── components/         # React components
│   ├── basic/         # Basic reusable components (Button, Input, Card, etc.)
│   └── admin/         # Admin-specific components (UserTable, Dashboard, etc.)
│
├── constants/          # Application constants
│   └── routes.ts      # Route path constants
│
├── layouts/            # Layout components
│                      # (Header, Sidebar, MainLayout, AuthLayout, etc.)
│
├── libs/              # Third-party library configurations
│                      # (axios setup, react-query config, etc.)
│
├── pages/             # Page components (routes)
│                      # (LoginPage, DashboardPage, UsersPage, etc.)
│
├── stores/            # State management (Zustand/Redux)
│                      # (authStore, userStore, etc.)
│
├── types/             # TypeScript type definitions
│   └── admin.ts       # Admin and user type definitions
│
└── utils/             # Utility functions
    └── storage.ts     # LocalStorage utilities for tokens
```

## Folder Purposes

### `/apis`
Contains all API call functions. Each file represents a domain (admin, users, products, etc.).
- Uses `fetch` or `axios` for HTTP requests
- Handles authentication headers
- Returns typed responses

### `/components`
Reusable React components organized by category.
- **basic/**: Generic UI components (buttons, inputs, modals)
- **admin/**: Admin-specific components (tables, forms, dashboards)

### `/constants`
Application-wide constants that don't change.
- Route paths
- API endpoints
- Configuration values

### `/layouts`
Layout wrapper components for different sections.
- AuthLayout (for login/register pages)
- DashboardLayout (for authenticated pages with sidebar)

### `/libs`
Third-party library setup and configuration.
- Axios instance with interceptors
- React Query setup
- Other library configs

### `/pages`
Top-level page components that correspond to routes.
- Each page uses layouts and components
- Connected to routing system

### `/stores`
Global state management.
- Authentication state
- User data
- UI state (modals, notifications)

### `/types`
TypeScript type definitions and interfaces.
- Shared types across the application
- API response types
- Form data types

### `/utils`
Helper functions and utilities.
- Date formatting
- Validation functions
- LocalStorage helpers
- String manipulation

---

## Architecture Rules

1. **No `index.ts` files** - Import directly from files
2. **No default exports** - Use named exports only
3. **Type everything** - Full TypeScript coverage
4. **API calls in `/apis`** - Keep components clean
5. **Reusable components** - DRY principle

---

## Example Usage

```typescript
// ❌ Don't do this (default export)
export default function LoginPage() { ... }

// ✅ Do this (named export)
export function LoginPage() { ... }

// ❌ Don't do this (index.ts re-export)
// apis/index.ts
export * from './adminApi';

// ✅ Do this (direct import)
import { login } from '@/apis/adminApi';
```

---

**Last Updated:** 2026-03-25
