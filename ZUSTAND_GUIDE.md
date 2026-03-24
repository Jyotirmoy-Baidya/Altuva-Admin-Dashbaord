# Zustand Store Guide

This guide explains how to use the Zustand user store in the Altuva Admin Dashboard.

## 📦 User Store

The `userStore` manages all authentication and user-related state globally.

### Store Location
[`src/stores/userStore.ts`](src/stores/userStore.ts)

## 🎯 State

```typescript
interface UserState {
    user: AdminUser | null;           // Current logged-in user
    token: string | null;              // JWT token
    isAuthenticated: boolean;          // Authentication status
    isLoading: boolean;                // Loading state
    error: string | null;              // Error message
}
```

## 🔧 Actions

### `login(email, password)`
Login user and save token to localStorage.

```typescript
import useUserStore from '@/stores/userStore';

function MyComponent() {
    const { login, isLoading, error } = useUserStore();

    const handleLogin = async () => {
        try {
            await login('admin@example.com', 'password123');
            // Automatically redirects after successful login
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
        </button>
    );
}
```

### `logout()`
Clear authentication and redirect to login.

```typescript
import useUserStore from '@/stores/userStore';

function MyComponent() {
    const { logout } = useUserStore();

    const handleLogout = () => {
        logout();
        // Clears token and user from localStorage
    };

    return <button onClick={handleLogout}>Logout</button>;
}
```

### `fetchCurrentUser()`
Fetch current user data from API.

```typescript
import useUserStore from '@/stores/userStore';

function MyComponent() {
    const { fetchCurrentUser } = useUserStore();

    useEffect(() => {
        fetchCurrentUser();
    }, []);
}
```

### `initializeAuth()`
Initialize authentication from localStorage on app start.

```typescript
// Already called in App.tsx on mount
useEffect(() => {
    initializeAuth();
}, [initializeAuth]);
```

## 📖 Usage Examples

### Get Current User

```typescript
import useUserStore from '@/stores/userStore';

function UserProfile() {
    const { user } = useUserStore();

    return (
        <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>{user?.email}</p>
        </div>
    );
}
```

### Check Authentication Status

```typescript
import useUserStore from '@/stores/userStore';

function ProtectedComponent() {
    const { isAuthenticated } = useUserStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <div>Protected Content</div>;
}
```

### Handle Loading States

```typescript
import useUserStore from '@/stores/userStore';

function LoginForm() {
    const { login, isLoading, error, clearError } = useUserStore();

    return (
        <div>
            {error && <p className="error">{error}</p>}
            <button onClick={() => login(email, password)} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
            </button>
        </div>
    );
}
```

## 🔄 Persistence

The user store is **persisted to localStorage** using Zustand's persist middleware:

- **Key:** `user-storage`
- **Persisted fields:** `user`, `token`, `isAuthenticated`
- **Auto-restores** on page reload

## 🛡️ Protected Routes

The `DashboardLayout` uses the store to protect routes:

```typescript
function DashboardLayout() {
    const { isAuthenticated } = useUserStore();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <div>Dashboard Content</div>;
}
```

## 🎨 Benefits of Zustand

1. **Simple API** - No boilerplate, just hooks
2. **TypeScript Support** - Full type safety
3. **Persistence** - Auto-save to localStorage
4. **No Provider Needed** - Use anywhere in the app
5. **Minimal Bundle Size** - ~1KB gzipped

## 📝 Adding New Actions

To add new actions to the store:

```typescript
// In userStore.ts
interface UserState {
    // ... existing state
    updateProfile: (data: Partial<AdminUser>) => Promise<void>;
}

// In create()
updateProfile: async (data) => {
    set({ isLoading: true });
    try {
        const response = await updateUserApi(data);
        set({ user: response.data, isLoading: false });
    } catch (error) {
        set({ error: error.message, isLoading: false });
    }
},
```

## 🔗 Resources

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)

---

**All components now use `export default`** - Import with:
```typescript
import ComponentName from './ComponentName';
```
