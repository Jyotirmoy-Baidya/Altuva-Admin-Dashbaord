// Type definitions for admin dashboard

// User Types
export interface AdminUser {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    role: string;
    approved: boolean;
    created_at: string;
    updated_at: string;
}

// Auth State
export interface AuthState {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// API Request Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
    role?: string;
}

export interface CreateUserData {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
    role?: string;
    approved?: boolean;
}

// API Response Types
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: AdminUser;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

// Form Data Types
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
    confirmPassword?: string;
}

export interface CreateUserFormData {
    name: string;
    email: string;
    phone_number?: string;
    password: string;
    role: string;
    approved: boolean;
}
