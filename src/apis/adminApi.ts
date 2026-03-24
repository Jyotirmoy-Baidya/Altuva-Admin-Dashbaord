import type {
    LoginCredentials,
    RegisterData,
    CreateUserData,
    AdminUser,
    LoginResponse,
    ApiResponse,
} from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Login API
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
};

// Register API
export const register = async (data: RegisterData): Promise<ApiResponse<AdminUser>> => {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
};

// Create User API (Protected)
export const createUser = async (token: string, data: CreateUserData): Promise<ApiResponse<AdminUser>> => {
    const response = await fetch(`${API_BASE_URL}/admin/create-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
    }

    return response.json();
};

// Get Current User API (Protected)
export const getCurrentUser = async (token: string): Promise<ApiResponse<AdminUser>> => {
    const response = await fetch(`${API_BASE_URL}/admin/get-me-admin-user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch user data');
    }

    return response.json();
};

export default {
    login,
    register,
    createUser,
    getCurrentUser,
};
