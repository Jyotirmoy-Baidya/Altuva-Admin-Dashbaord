// Local Storage utilities for token management

const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const saveToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): any | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
    localStorage.removeItem(USER_KEY);
};

export const clearAuth = (): void => {
    removeToken();
    removeUser();
};
