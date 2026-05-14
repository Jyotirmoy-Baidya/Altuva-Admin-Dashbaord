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
import CustomersPage from './pages/CustomersPage';
import TaxesPage from './pages/TaxesPage';
import DeliveryChargesPage from './pages/DeliveryChargesPage';
import DiscountsPage from './pages/DiscountsPage';
import SpotlightsPage from './pages/SpotlightsPage';
import PopularSectionsPage from './pages/PopularSectionsPage';
import ShowcaseTeaPage from './pages/ShowcaseTeaPage';
import OrdersPage from './pages/OrdersPage';
import useUserStore from './stores/userStore';
import { ROUTES } from './constants/routes';
import { Toaster } from 'react-hot-toast';

function App() {
    const { initializeAuth } = useUserStore();

    useEffect(() => {
        // Initialize auth from localStorage on app load
        initializeAuth();
    }, [initializeAuth]);
    return (
        <BrowserRouter>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
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
                    <Route path="/customers" element={<CustomersPage />} />
                    <Route path="/taxes" element={<TaxesPage />} />
                    <Route path="/delivery-charges" element={<DeliveryChargesPage />} />
                    <Route path="/discounts" element={<DiscountsPage />} />
                    <Route path="/spotlights" element={<SpotlightsPage />} />
                    <Route path="/popular-sections" element={<PopularSectionsPage />} />
                    <Route path="/showcase-tea" element={<ShowcaseTeaPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
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
