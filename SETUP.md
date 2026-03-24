# Admin Dashboard Setup Guide

## 🎨 Features

- **Authentication System**: Login and Register pages with JWT
- **Protected Routes**: DashboardLayout wraps all authenticated pages
- **Sidebar Navigation**: Dashboard, Analytics, Landing Page, Products
- **Axios Instance**: Automatic token injection from localStorage
- **Color Scheme**: Primary (#181818), Background (#ffffff)

## 📁 Project Structure

```
src/
├── apis/
│   └── adminApi.ts           # API calls (login, register, createUser, getCurrentUser)
├── components/
│   └── admin/
│       └── Sidebar.tsx       # Sidebar with navigation and user info
├── layouts/
│   ├── AuthLayout.tsx        # Wrapper for login/register (redirects if logged in)
│   └── DashboardLayout.tsx   # Protected wrapper with sidebar (redirects if not logged in)
├── libs/
│   └── axiosInstance.ts      # Axios with token interceptor
├── pages/
│   ├── LoginPage.tsx         # Login form
│   ├── RegisterPage.tsx      # Registration form
│   ├── DashboardPage.tsx     # Main dashboard with stats
│   ├── AnalyticsPage.tsx     # Analytics page (placeholder)
│   ├── LandingPageManager.tsx # Landing page editor (placeholder)
│   └── ProductsPage.tsx      # Products management (placeholder)
├── constants/
│   └── routes.ts             # Route constants
├── types/
│   └── admin.ts              # TypeScript types
├── utils/
│   └── storage.ts            # localStorage helpers
├── App.tsx                   # Router setup
├── main.tsx                  # App entry point
└── index.css                 # Global styles with color variables
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file is set up with:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Make Sure Backend is Running
```bash
cd ../altuva-server
npm run dev
```

## 🔐 Authentication Flow

### Register Flow
1. User visits `/register`
2. Fills out registration form (name, email, phone, password)
3. Account created with `approved = false`
4. Redirected to login with success message
5. Needs admin approval to login

### Login Flow
1. User visits `/login`
2. Enters email and password
3. Backend validates credentials and checks `approved = true`
4. If approved, JWT token returned
5. Token saved to localStorage
6. User redirected to `/dashboard`

### Protected Routes
All routes inside `DashboardLayout` are protected:
- `/dashboard`
- `/analytics`
- `/landing-page`
- `/products`

If user is not logged in, they're redirected to `/login`.

## 🛠️ Axios Instance

The `axiosInstance` automatically:
1. **Adds Bearer token** to all requests from localStorage
2. **Handles 401 errors** - Clears auth and redirects to login
3. **Handles 403 errors** - Shows "not approved" message

### Usage Example
```typescript
import { axiosInstance } from '@/libs/axiosInstance';

// Token is automatically added
const response = await axiosInstance.get('/admin/get-me-admin-user');
```

## 🎨 Color Scheme

The admin dashboard uses a clean black and white theme:

```css
--primary-color: #181818      /* Main black color */
--background-color: #ffffff   /* White background */
--text-primary: #181818       /* Primary text */
--text-secondary: #666666     /* Secondary text */
--border-color: #e5e5e5       /* Borders */
--hover-bg: #f5f5f5          /* Hover states */
```

## 🧭 Sidebar Navigation

The sidebar includes:
- **Logo**: "Altuva Admin" at the top
- **Navigation**: Dashboard, Analytics, Landing Page, Products
- **User Info**: Name, email, and approval status at the bottom

## 📄 Pages

### Dashboard (`/dashboard`)
- Welcome message with user name
- Stats cards (Total Users, Products, Pending Approvals)
- Recent Activity section

### Analytics (`/analytics`)
- Placeholder for analytics features

### Landing Page Manager (`/landing-page`)
- Placeholder for landing page editor

### Products (`/products`)
- Placeholder for product management

## 🔧 API Integration

All API calls use the functions from `apis/adminApi.ts`:

```typescript
// Login
const response = await login({ email, password });

// Register
await register({ name, email, phone_number, password });

// Create User (Protected)
await createUser(token, { name, email, password, approved: true });

// Get Current User (Protected)
await getCurrentUser(token);
```

## 📝 Notes

- All components use **named exports** (no default exports)
- No `index.ts` files for re-exporting
- Protected routes automatically redirect to login
- Token is stored in localStorage
- Axios instance handles token injection automatically

## 🎯 Next Steps

1. **Test the login/register flow**
2. **Create first admin user** (see backend README)
3. **Approve the user in database**
4. **Login and explore dashboard**
5. **Build out Analytics, Landing Page, and Products features**

---

**Need help?** Check the backend [`ROUTES.md`](../altuva-server/ROUTES.md) for API documentation.
