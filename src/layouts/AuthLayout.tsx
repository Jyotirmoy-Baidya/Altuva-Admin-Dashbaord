import { Navigate, Outlet } from 'react-router-dom';
import useUserStore from '../stores/userStore';
import { ROUTES } from '../constants/routes';

function AuthLayout() {
    const { isAuthenticated } = useUserStore();

    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--background-color)',
            }}
        >
            <Outlet />
        </div>
    );
}

export default AuthLayout;
