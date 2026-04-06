import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import useUserStore from '../stores/userStore';
import { ROUTES } from '../constants/routes';

function DashboardLayout() {
    const { isAuthenticated, _hasHydrated } = useUserStore();

    // Wait for Zustand persist to rehydrate from localStorage
    if (!_hasHydrated) {
        return null;
    }

    // Protected route - redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />

            <main
                style={{
                    marginLeft: 'var(--sidebar-width)',
                    flex: 1,
                    padding: '40px',
                    backgroundColor: 'var(--background-color)',
                    minHeight: '100vh',
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;
