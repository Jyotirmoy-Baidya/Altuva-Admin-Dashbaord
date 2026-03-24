import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LandingPageCms from './pages/LandingPageCms';
import ProductsPage from './pages/ProductsPage';
import useUserStore from './stores/userStore';
import { ROUTES } from './constants/routes';

function App() {
    const { initializeAuth } = useUserStore();

    useEffect(() => {
        // Initialize auth from localStorage on app load
        initializeAuth();
    }, [initializeAuth]);
    return (
        <BrowserRouter>
            <Routes>
                {/* Auth Routes - Redirect to dashboard if logged in */}
                <Route element={<AuthLayout />}>
                    <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                    <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                </Route>

                {/* Protected Dashboard Routes - Redirect to login if not authenticated */}
                <Route element={<DashboardLayout />}>
                    <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/landing-page" element={<LandingPageCms />} />
                    <Route path="/products" element={<ProductsPage />} />
                </Route>

                {/* Default route - Redirect to dashboard */}
                <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

                {/* 404 - Redirect to dashboard */}
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
