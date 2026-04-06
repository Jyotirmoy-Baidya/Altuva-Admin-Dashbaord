import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginApi, getCurrentUser } from '../apis/adminApi';
import { saveToken, saveUser, getToken, getUser, clearAuth } from '../utils/storage';
import type { AdminUser } from '../types/admin';

interface UserState {
    user: AdminUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    _hasHydrated: boolean;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    fetchCurrentUser: () => Promise<void>;
    setUser: (user: AdminUser | null) => void;
    setToken: (token: string | null) => void;
    clearError: () => void;
    initializeAuth: () => void;
    setHasHydrated: (val: boolean) => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            _hasHydrated: false,
            setHasHydrated: (val: boolean) => set({ _hasHydrated: val }),

            // Initialize auth from localStorage
            initializeAuth: () => {
                const token = getToken();
                const user = getUser();

                if (token && user) {
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                    });
                }
            },

            // Login action
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await loginApi({ email, password });

                    const { token, user } = response.data;

                    // Save to localStorage
                    saveToken(token);
                    saveUser(user);

                    // Update store
                    set({
                        token,
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    set({
                        error: errorMessage,
                        isLoading: false,
                        isAuthenticated: false,
                    });
                    throw error;
                }
            },

            // Logout action
            logout: () => {
                clearAuth();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Fetch current user
            fetchCurrentUser: async () => {
                const token = get().token;

                if (!token) {
                    set({ error: 'No token found' });
                    return;
                }

                set({ isLoading: true });

                try {
                    const response = await getCurrentUser(token);

                    if (response.data) {
                        saveUser(response.data);
                        set({
                            user: response.data,
                            isLoading: false,
                            error: null,
                        });
                    }
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
                    set({
                        error: errorMessage,
                        isLoading: false,
                    });
                }
            },

            // Set user manually
            setUser: (user: AdminUser | null) => {
                if (user) {
                    saveUser(user);
                }
                set({ user });
            },

            // Set token manually
            setToken: (token: string | null) => {
                if (token) {
                    saveToken(token);
                } else {
                    clearAuth();
                }
                set({ token, isAuthenticated: !!token });
            },

            // Clear error
            clearError: () => {
                set({ error: null });
            },
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export default useUserStore;
