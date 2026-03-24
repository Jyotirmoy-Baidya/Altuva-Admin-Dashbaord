// Route constants for the admin dashboard

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    USERS: '/users',
    CREATE_USER: '/users/create',
    PROFILE: '/profile',
} as const;

export type RouteType = typeof ROUTES[keyof typeof ROUTES];
